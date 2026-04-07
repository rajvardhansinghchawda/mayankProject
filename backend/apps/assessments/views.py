from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.db import models
from django.db.models import Sum, Q
from datetime import timedelta
import csv
from django.http import HttpResponse


from .models import Test, TestQuestion, QuestionOption, TestAttempt, StudentAnswer, BehavioralEvent
from .serializers import (
    TestSerializer, TestListSerializer, TestQuestionSerializer, 
    StartTestResponseSerializer, StudentAnswerSaveSerializer,
    TestAttemptTeacherSerializer, TestAttemptResultSerializer,
    BehavioralEventSerializer
)

from .permissions import IsTestOwnerOrAdmin, CanTakeTest

class TestViewSet(viewsets.ModelViewSet):
    serializer_class = TestSerializer
    
    def get_permissions(self):
        # Student-accessible actions: read tests + take tests
        student_actions = ['list', 'retrieve', 'start', 'get_attempt', 'save_answer', 'submit_attempt', 'behavioral_event']
        if self.action in student_actions:
            return [IsAuthenticated()]
        # Everything else (create, update, delete, publish, close, questions) = teachers/admins only
        return [IsAuthenticated(), IsTestOwnerOrAdmin()]

    def get_queryset(self):
        user = self.request.user
        qs = Test.objects.filter(is_deleted=False).order_by('-created_at')

        # Admin: See everything in the institution
        if user.is_admin:
            if user.institution:
                return qs.filter(section__department__institution=user.institution)
            return qs

        # Teacher: See tests they created OR tests assigned to their sections
        if user.is_teacher:
            if hasattr(user, 'teacher_profile'):
                assigned_section_ids = user.teacher_profile.assignments.values_list('section_id', flat=True)
                return qs.filter(Q(created_by=user) | Q(section_id__in=assigned_section_ids)).distinct()
            return qs.filter(created_by=user)

        # Student: See only published tests for their section
        if user.is_student and hasattr(user, 'student_profile'):
            student_section = user.student_profile.section
            if student_section:
                return qs.filter(section=student_section, status__in=[Test.Status.PUBLISHED, Test.Status.ACTIVE, Test.Status.CLOSED, Test.Status.RESULTS_RELEASED])
            return qs.none()

        return qs.none()



    def get_serializer_class(self):
        if self.action == 'list':
            return TestListSerializer
        return TestSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        test = self.get_object()
        test.status = Test.Status.PUBLISHED
        test.save()
        return Response({'status': 'published'})

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        test = self.get_object()
        test.status = Test.Status.CLOSED
        test.save()
        return Response({'status': 'closed'})

    @action(detail=True, methods=['post'])
    def release_results(self, request, pk=None):
        test = self.get_object()
        test.status = Test.Status.RESULTS_RELEASED
        test.save()
        # Trigger Celery task here: tasks.broadcast_test_result_release.delay(str(test.id))
        return Response({'status': 'results_released'})

    # ================= QUESTIONS =================
    @action(detail=True, methods=['get', 'post'], url_path='questions')
    def handle_questions(self, request, pk=None):
        test = self.get_object()
        if request.method == 'GET':
            questions = test.questions.all()
            serializer = TestQuestionSerializer(questions, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = TestQuestionSerializer(data=request.data)
            if serializer.is_valid():
                question = serializer.save(test=test)
                # update test total marks
                test.total_marks = test.questions.aggregate(Sum('marks'))['marks__sum'] or 0
                test.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put', 'patch', 'delete'], url_path=r'questions/(?P<qid>[^/.]+)')
    def handle_question_detail(self, request, pk=None, qid=None):
        test = self.get_object()
        question = get_object_or_404(TestQuestion, pk=qid, test=test)
        if request.method in ['PUT', 'PATCH']:
            serializer = TestQuestionSerializer(question, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                test.total_marks = test.questions.aggregate(Sum('marks'))['marks__sum'] or 0
                test.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'DELETE':
            question.delete()
            test.total_marks = test.questions.aggregate(Sum('marks'))['marks__sum'] or 0
            test.save()
            return Response(status=status.HTTP_204_NO_CONTENT)


    # ================= ATTEMPTS (STUDENT) =================
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        test = self.get_object()
        if test.status not in [Test.Status.PUBLISHED, Test.Status.ACTIVE]:
            return Response({'error': 'Test not available'}, status=status.HTTP_400_BAD_REQUEST)
        
        attempt, created = TestAttempt.objects.get_or_create(test=test, student=request.user)
        
        # Already submitted — block permanently
        if attempt.status in [TestAttempt.Status.SUBMITTED, TestAttempt.Status.AUTO_SUBMITTED]:
            return Response(
                {'error': 'already_submitted', 'score': str(attempt.score), 'submitted_at': attempt.submitted_at},
                status=status.HTTP_409_CONFLICT
            )
        
        # Already in progress — allow resume
        if attempt.status == TestAttempt.Status.IN_PROGRESS:
            return Response(
                {'error': 'already_in_progress', 'attempt_id': attempt.id, 'expires_at': attempt.expires_at},
                status=status.HTTP_200_OK
            )
            
        attempt.status = TestAttempt.Status.IN_PROGRESS
        attempt.started_at = timezone.now()
        duration_seconds = test.duration_minutes * 60
        attempt.expires_at = attempt.started_at + timedelta(seconds=duration_seconds)
        attempt.save()

        questions = test.questions.all()
        if test.shuffle_questions:
            questions = questions.order_by('?')
        
        resp_data = {
            'attempt_id': attempt.id,
            'expires_at': attempt.expires_at,
            'duration_seconds': duration_seconds,
            'questions': questions
        }
        
        serializer = StartTestResponseSerializer(resp_data)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='attempt')
    def get_attempt(self, request, pk=None):
        test = self.get_object()
        attempt = get_object_or_404(TestAttempt, test=test, student=request.user)
        serializer = TestAttemptResultSerializer(attempt)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='attempt/answer')
    def save_answer(self, request, pk=None):
        test = self.get_object()
        attempt = get_object_or_404(TestAttempt, test=test, student=request.user)
        
        if attempt.status != TestAttempt.Status.IN_PROGRESS:
            return Response({'error': 'Test is not in progress'}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = StudentAnswerSaveSerializer(data=request.data)
        if serializer.is_valid():
            question = serializer.validated_data['question']
            if question.test != test:
                return Response({'error': 'Question does not belong to this test'}, status=status.HTTP_400_BAD_REQUEST)
                
            ans, created = StudentAnswer.objects.update_or_create(
                attempt=attempt,
                question=question,
                defaults={
                    'selected_option': serializer.validated_data.get('selected_option'),
                    'text_answer': serializer.validated_data.get('text_answer'),
                    'is_marked_review': serializer.validated_data.get('is_marked_review', False)
                }
            )
            return Response({'status': 'saved'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='attempt/submit')
    def submit_attempt(self, request, pk=None):
        test = self.get_object()
        attempt = get_object_or_404(TestAttempt, test=test, student=request.user)
        
        if attempt.status != TestAttempt.Status.IN_PROGRESS:
            return Response({'error': 'Test already submitted'}, status=status.HTTP_400_BAD_REQUEST)

        attempt.status = TestAttempt.Status.SUBMITTED
        attempt.submitted_at = timezone.now()
        if attempt.started_at:
            attempt.time_taken_seconds = (attempt.submitted_at - attempt.started_at).seconds
            
        # Optional: Calculate score synchronously or asynchronously
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
        if test.passing_marks is not None:
            attempt.is_passed = (total_score >= test.passing_marks)
        attempt.save()

        # revoke scheduled auto_submit here
        
        return Response({'status': 'submitted', 'score': attempt.score})

    @action(detail=True, methods=['post'], url_path='attempt/event')
    def log_event(self, request, pk=None):
        test = self.get_object()
        attempt = get_object_or_404(TestAttempt, test=test, student=request.user)
        
        serializer = BehavioralEventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(attempt=attempt)
            
            # Simple aggregation logic for some events
            ev_type = serializer.validated_data['event_type']
            if ev_type == BehavioralEvent.EventType.TAB_SWITCH:
                attempt.tab_switch_count += 1
                if attempt.tab_switch_count >= test.tab_switch_threshold:
                    attempt.risk_level = TestAttempt.RiskLevel.HIGH
                attempt.save()
            elif ev_type == BehavioralEvent.EventType.FULLSCREEN_EXIT:
                attempt.fullscreen_exit_count += 1
                attempt.save()
                
            return Response({'status': 'logged'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], url_path='result')
    def get_result(self, request, pk=None):
        test = self.get_object()
        if test.status != Test.Status.RESULTS_RELEASED:
            return Response({'error': 'Results not released yet'}, status=status.HTTP_403_FORBIDDEN)
            
        attempt = get_object_or_404(TestAttempt, test=test, student=request.user)
        serializer = TestAttemptResultSerializer(attempt)
        return Response(serializer.data)

    # ================= SUBMISSIONS (TEACHER) =================
    @action(detail=True, methods=['get'], url_path='submissions')
    def get_submissions(self, request, pk=None):
        test = self.get_object()
        attempts = test.attempts.all()
        serializer = TestAttemptTeacherSerializer(attempts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path=r'submissions/(?P<student_id>[^/.]+)')
    def get_student_submission(self, request, student_id=None, pk=None):
        test = self.get_object()
        attempt = get_object_or_404(TestAttempt, test=test, student__id=student_id)
        serializer = TestAttemptTeacherSerializer(attempt)
        return Response(serializer.data)
        
    @action(detail=True, methods=['get'], url_path='submissions/export')
    def export_csv(self, request, pk=None):
        test = self.get_object()
        attempts = test.attempts.all()
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="test_{test.id}_results.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Student ID', 'Student Name', 'Status', 'Score', 'Passed', 'Start Time', 'Submit Time', 'Risk Level'])
        for attempt in attempts:
            writer.writerow([
                attempt.student.id, 
                attempt.student.full_name, 
                attempt.get_status_display(),
                attempt.score,
                attempt.is_passed,
                attempt.started_at,
                attempt.submitted_at,
                attempt.get_risk_level_display()
            ])
            
        return response

class TestAttemptViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for students to see their own attempts and 
    for teachers to see submissions for their tests.
    """
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TestAttemptListSerializer
        return TestAttemptTeacherSerializer

    def get_queryset(self):
        user = self.request.user
        
        # Admins see everything in their institution
        if user.is_admin:
            return TestAttempt.objects.filter(
                test__section__department__institution=user.institution
            ).order_by('-submitted_at')
            
        # Teachers: see attempts for tests they created or are assigned to their sections
        if user.is_teacher and hasattr(user, 'teacher_profile'):
            assigned_sections = user.teacher_profile.assignments.values_list('section_id', flat=True)
            return TestAttempt.objects.filter(
                Q(test__created_by=user) | 
                Q(test__section_id__in=assigned_sections)
            ).distinct().order_by('-submitted_at')
            
        # Students see only their own attempts
        return TestAttempt.objects.filter(student=user).order_by('-created_at')

