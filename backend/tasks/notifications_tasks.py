from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from apps.assessments.models import Test
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

@shared_task(name='tasks.send_notification_email')
def send_notification_email(recipient_id: str, subject: str, body: str):
    try:
        user = User.objects.get(id=recipient_id)
        if user.email:
            send_mail(
                subject=subject,
                message=body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
            return f"Email sent to {user.email}"
        return f"User {recipient_id} has no email address."
    except User.DoesNotExist:
        return f"User {recipient_id} not found."
    except Exception as e:
        logger.error(f"Failed to send email to {recipient_id}: {str(e)}")
        return f"Error sending email: {str(e)}"

@shared_task(name='tasks.broadcast_test_result_release')
def broadcast_test_result_release(test_id: str):
    try:
        test = Test.objects.select_related('section').get(id=test_id)
        students = User.objects.filter(student_profile__section=test.section)
        
        email_subject = f"Results Released: {test.title}"
        email_body = f"The results for '{test.title}' in {test.subject_name} have been released. Please check your dashboard."
        
        sent_count = 0
        for student in students:
            if student.email:
                # We could queue individual emails or send directly
                send_notification_email.delay(str(student.id), email_subject, email_body)
                sent_count += 1
                
        return f"Broadcasted results for test {test_id} to {sent_count} students."
        
    except Test.DoesNotExist:
        return f"Test {test_id} not found."
    except Exception as e:
        logger.error(f"Failed to broadcast test results for test {test_id}: {str(e)}")
        return f"Error broadcasting test result: {str(e)}"
