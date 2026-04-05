from rest_framework import serializers
from .models import Test, TestQuestion, QuestionOption, TestAttempt, StudentAnswer, BehavioralEvent

class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ['id', 'option_text', 'is_correct', 'order_index']

class QuestionOptionStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ['id', 'option_text', 'order_index']

class TestQuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True, required=False)

    class Meta:
        model = TestQuestion
        fields = ['id', 'question_text', 'question_type', 'marks', 'order_index', 'options']

    def create(self, validated_data):
        options_data = validated_data.pop('options', [])
        question = TestQuestion.objects.create(**validated_data)
        for option_data in options_data:
            QuestionOption.objects.create(question=question, **option_data)
        return question

    def update(self, instance, validated_data):
        options_data = validated_data.pop('options', None)
        instance.question_text = validated_data.get('question_text', instance.question_text)
        instance.question_type = validated_data.get('question_type', instance.question_type)
        instance.marks = validated_data.get('marks', instance.marks)
        instance.order_index = validated_data.get('order_index', instance.order_index)
        instance.save()

        if options_data is not None:
            instance.options.all().delete()
            for option_data in options_data:
                QuestionOption.objects.create(question=instance, **option_data)
        return instance

class TestQuestionStudentSerializer(serializers.ModelSerializer):
    options = QuestionOptionStudentSerializer(many=True, read_only=True)

    class Meta:
        model = TestQuestion
        fields = ['id', 'question_text', 'question_type', 'marks', 'order_index', 'options']

class TestSerializer(serializers.ModelSerializer):
    questions = TestQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = ['id', 'created_by', 'section', 'subject_name', 'title', 'description', 
                  'status', 'availability_start', 'availability_end', 'duration_minutes', 
                  'total_marks', 'passing_marks', 'shuffle_questions', 'shuffle_options', 
                  'show_answers_after', 'tab_switch_threshold', 'created_at', 'questions']
        read_only_fields = ['created_by', 'status', 'total_marks']

class TestListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['id', 'title', 'subject_name', 'status', 'availability_start', 'availability_end', 'duration_minutes']

class StartTestResponseSerializer(serializers.Serializer):
    attempt_id = serializers.UUIDField()
    expires_at = serializers.DateTimeField()
    duration_seconds = serializers.IntegerField()
    questions = TestQuestionStudentSerializer(many=True)

class StudentAnswerSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = ['question', 'selected_option', 'text_answer', 'is_marked_review']
        
class BehavioralEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = BehavioralEvent
        fields = ['event_type', 'event_data', 'created_at']

class TestAttemptResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestAttempt
        fields = ['id', 'status', 'started_at', 'submitted_at', 'time_taken_seconds', 'score', 'is_passed', 'risk_level']

class TestAttemptTeacherSerializer(serializers.ModelSerializer):
    behavioral_events = BehavioralEventSerializer(many=True, read_only=True)
    
    class Meta:
        model = TestAttempt
        fields = ['id', 'student', 'status', 'started_at', 'submitted_at', 'time_taken_seconds', 'score', 'is_passed', 'tab_switch_count', 'fullscreen_exit_count', 'risk_level', 'teacher_note', 'behavioral_events']
