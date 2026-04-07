from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tests', views.TestViewSet, basename='test')
router.register(r'attempts', views.TestAttemptViewSet, basename='attempt')

urlpatterns = [
    path('', include(router.urls)),
]

