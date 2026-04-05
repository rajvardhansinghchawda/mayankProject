import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saras.settings')
import django
django.setup()

from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken
from apps.users.models import User
import jwt

def verify():
    print(f"DEBUG: Using SECRET_KEY starting with: {settings.SECRET_KEY[:10]}")
    
    user = User.objects.get(email="admin@mayankcollege.edu")
    token = AccessToken.for_user(user)
    token_str = str(token)
    
    print(f"DEBUG: Token generated successfully.")
    
    try:
        # Manually decode using PyJWT with the settings key
        decoded = jwt.decode(token_str, settings.SECRET_KEY, algorithms=["HS256"])
        print("SUCCESS: PyJWT decoded the token perfectly.")
        print(f"Payload: {decoded}")
    except Exception as e:
        print(f"FAILURE: PyJWT failed to decode: {e}")

if __name__ == "__main__":
    verify()
