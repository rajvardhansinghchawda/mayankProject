from celery import shared_task
import redis
import json
from django.conf import settings
from django.utils import timezone
from apps.assessments.models import TestAttempt, TestQuestion

@shared_task(name='tasks.auto_submit_attempt')
def auto_submit_attempt(attempt_id: str):
    try:
        attempt = TestAttempt.objects.get(id=attempt_id)
        if attempt.status != TestAttempt.Status.IN_PROGRESS:
            return f"Attempt {attempt_id} is already in status {attempt.status}."

        attempt.status = TestAttempt.Status.AUTO_SUBMITTED
        attempt.submitted_at = timezone.now()
        
        if attempt.started_at:
            attempt.time_taken_seconds = (attempt.submitted_at - attempt.started_at).seconds
        
        total_score = 0
        answers = attempt.answers.all()
        for ans in answers:
            if ans.question.question_type in [TestQuestion.QuestionType.MCQ, TestQuestion.QuestionType.TRUE_FALSE]:
                if ans.selected_option and ans.selected_option.is_correct:
                    ans.is_correct = True
                    ans.marks_awarded = ans.question.marks
                    total_score += ans.question.marks
                else:
                    ans.is_correct = False
                    ans.marks_awarded = 0
                ans.save()
                
        attempt.score = total_score
        if attempt.test.passing_marks is not None:
            attempt.is_passed = (total_score >= attempt.test.passing_marks)
        attempt.save()

        try:
            redis_client = redis.Redis.from_url(settings.REDIS_URL)
            channel = f"saras:test_events:{attempt_id}"
            message = {
                "type": "force_submit",
                "data": {
                    "reason": "timer_expired",
                    "attempt_id": str(attempt_id)
                }
            }
            redis_client.publish(channel, json.dumps(message))
        except Exception as e:
            # log redis error
            pass

        return f"Successfully auto_submitted attempt {attempt_id}. Score: {total_score}"

    except TestAttempt.DoesNotExist:
        return f"TestAttempt {attempt_id} does not exist."
    except Exception as e:
        return f"Error auto_submitting attempt {attempt_id}: {str(e)}"
