from django.contrib import admin
from .models import Test, TestQuestion, QuestionOption, TestAttempt, StudentAnswer, BehavioralEvent

@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject_name', 'status', 'created_by', 'created_at')
    list_filter = ('status', 'section')
    search_fields = ('title', 'subject_name')

class QuestionOptionInline(admin.TabularInline):
    model = QuestionOption
    extra = 1

@admin.register(TestQuestion)
class TestQuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'test', 'question_type', 'marks')
    list_filter = ('question_type', 'test')
    inlines = [QuestionOptionInline]

@admin.register(TestAttempt)
class TestAttemptAdmin(admin.ModelAdmin):
    list_display = ('test', 'student', 'status', 'score', 'risk_level')
    list_filter = ('status', 'risk_level', 'is_passed')
    search_fields = ('student__full_name', 'student__email')

@admin.register(StudentAnswer)
class StudentAnswerAdmin(admin.ModelAdmin):
    list_display = ('attempt', 'question', 'is_correct', 'marks_awarded')
    list_filter = ('is_correct',)

@admin.register(BehavioralEvent)
class BehavioralEventAdmin(admin.ModelAdmin):
    list_display = ('attempt', 'event_type', 'created_at')
    list_filter = ('event_type',)
