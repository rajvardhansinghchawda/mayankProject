import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saras.settings')
django.setup()

print(f"DJANGO_SECRET_KEY in settings: {settings.SECRET_KEY}")
