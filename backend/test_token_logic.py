import os
import django
from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken
from apps.users.models import User

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saras.settings')
django.setup()

def debug_token():
    print(f"DEBUG: SECRET_KEY = {settings.SECRET_KEY}")
    
    user = User.objects.get(email='admin@mayankcollege.edu')
    token = AccessToken.for_user(user)
    token_str = str(token)
    
    print(f"DEBUG: Generated Token = {token_str[:20]}...")
    
    try:
        validated_token = AccessToken(token_str)
        print("SUCCESS: Token validated locally in the same process.")
    except Exception as e:
        print(f"FAILURE: Token validation failed: {str(e)}")

if __name__ == "__main__":
    debug_token()
