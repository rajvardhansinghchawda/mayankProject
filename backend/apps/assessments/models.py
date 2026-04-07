import uuid
from django.db import models
from django.conf import settings
from apps.users.models import Section

User = settings.AUTH_USER_MODEL

class Test(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'
        ACTIVE = 'active', 'Active'
        CLOSED = 'closed', 'Closed'
        RESULTS_RELEASED = 'results_released', 'Results Released'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tests')
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='tests')
    subject_name = models.CharField(max_length=255)
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    
    availability_start = models.DateTimeField()
    availability_end = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField()
    total_marks = models.IntegerField(default=0)
    passing_marks = models.IntegerField(null=True, blank=True)
    
    shuffle_questions = models.BooleanField(default=False)
    shuffle_options = models.BooleanField(default=False)
    show_answers_after = models.BooleanField(default=False)
    tab_switch_threshold = models.IntegerField(default=3)
    
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tests'
        indexes = [
            models.Index(fields=['section']),
            models.Index(fields=['status']),
        ]

class TestQuestion(models.Model):
    class QuestionType(models.TextChoices):
        MCQ = 'mcq', 'Multiple Choice'
        SHORT_ANSWER = 'short_answer', 'Short Answer'
        TRUE_FALSE = 'true_false', 'True/False'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField(blank=True)
    question_type = models.CharField(max_length=20, choices=QuestionType.choices)
    marks = models.IntegerField(default=1)
    order_index = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'test_questions'
        indexes = [
            models.Index(fields=['test']),
        ]
        ordering = ['order_index']

class QuestionOption(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.ForeignKey(TestQuestion, on_delete=models.CASCADE, related_name='options')
    option_text = models.TextField()
    is_correct = models.BooleanField(default=False)
    order_index = models.IntegerField()

    class Meta:
        db_table = 'question_options'
        ordering = ['order_index']

class TestAttempt(models.Model):
    class Status(models.TextChoices):
        NOT_STARTED = 'not_started', 'Not Started'
        IN_PROGRESS = 'in_progress', 'In Progress'
        SUBMITTED = 'submitted', 'Submitted'
        AUTO_SUBMITTED = 'auto_submitted', 'Auto Submitted'

    class RiskLevel(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='attempts')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='test_attempts')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NOT_STARTED)
    
    started_at = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    time_taken_seconds = models.IntegerField(null=True, blank=True)
    score = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    is_passed = models.BooleanField(null=True, blank=True)
    
    tab_switch_count = models.IntegerField(default=0)
    fullscreen_exit_count = models.IntegerField(default=0)
    risk_level = models.CharField(max_length=10, choices=RiskLevel.choices, default=RiskLevel.LOW)
    teacher_note = models.TextField(null=True, blank=True)
    
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'test_attempts'
        unique_together = ('test', 'student')
        indexes = [
            models.Index(fields=['test']),
            models.Index(fields=['student']),
        ]

class StudentAnswer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    attempt = models.ForeignKey(TestAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(TestQuestion, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(QuestionOption, on_delete=models.SET_NULL, null=True, blank=True)
    text_answer = models.TextField(null=True, blank=True)
    is_correct = models.BooleanField(null=True, blank=True)
    marks_awarded = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    is_marked_review = models.BooleanField(default=False)
    answered_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_answers'
        unique_together = ('attempt', 'question')

class BehavioralEvent(models.Model):
    class EventType(models.TextChoices):
        TAB_SWITCH = 'tab_switch', 'Tab Switch'
        FULLSCREEN_EXIT = 'fullscreen_exit', 'Fullscreen Exit'
        FULLSCREEN_ENTER = 'fullscreen_enter', 'Fullscreen Enter'
        TEST_STARTED = 'test_started', 'Test Started'
        TEST_SUBMITTED = 'test_submitted', 'Test Submitted'
        ANSWER_CHANGED = 'answer_changed', 'Answer Changed'
        FOCUS_LOST = 'focus_lost', 'Focus Lost'
        FOCUS_GAINED = 'focus_gained', 'Focus Gained'
        RIGHT_CLICK_ATTEMPT = 'right_click_attempt', 'Right Click Attempt'
        KEYBOARD_SHORTCUT_BLOCKED = 'keyboard_shortcut_blocked', 'Keyboard Shortcut Blocked'

    id = models.BigAutoField(primary_key=True)
    attempt = models.ForeignKey(TestAttempt, on_delete=models.CASCADE, related_name='behavioral_events')
    event_type = models.CharField(max_length=50, choices=EventType.choices)
    event_data = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'behavioral_events'
        indexes = [
            models.Index(fields=['attempt']),
        ]
