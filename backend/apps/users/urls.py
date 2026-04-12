"""
SARAS — Users URLs
"""
from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('', views.UserListView.as_view(), name='list'),
    path('create/', views.UserCreateView.as_view(), name='create'),
    path('profile/', views.my_profile, name='my-profile'),
    path('departments/', views.departments_list, name='departments'),
    path('sections/', views.sections_list, name='sections'),
    path('bulk-action/', views.UserBulkActionView.as_view(), name='bulk-action'),
    path('<uuid:id>/', views.UserDetailView.as_view(), name='detail'),
    path('<uuid:id>/update/', views.UserUpdateView.as_view(), name='update'),
    path('<uuid:id>/delete/', views.UserDeleteView.as_view(), name='delete'),
]

