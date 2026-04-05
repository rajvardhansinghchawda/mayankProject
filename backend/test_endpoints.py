import os
import django
import sys
from tabulate import tabulate

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saras.settings')
django.setup()

from django.conf import settings
from rest_framework.test import APIClient
from apps.users.models import User

# Endpoints format: (Name, URL, Requires_Auth, HTTP_Method)
ENDPOINTS = [
    ("Health Check", "/health/", False, "GET"),
    ("My Profile Info", "/api/auth/me/", True, "GET"),
    ("List All Users", "/api/users/", True, "GET"),
    ("Department List", "/api/users/departments/", True, "GET"),
    ("Section List", "/api/users/sections/", True, "GET"),
    ("Admin Platform Stats", "/api/admin/stats/", True, "GET"),
    ("Admin Active Users", "/api/admin/users/", True, "GET"),
    ("Global Document List", "/api/documents/", True, "GET"),
    ("My Uploaded Documents", "/api/documents/my-uploads/", True, "GET"),
    ("Assessment Tests List", "/api/assessments/tests/", True, "GET"),
    ("Notification Inbox", "/api/notifications/", True, "GET"),
    ("Notification Unread Count", "/api/notifications/unread-count/", True, "GET"),
]

def map_status_code_color(status_code):
    if 200 <= status_code < 300:
        return f"{status_code} OK"
    if status_code == 401 or status_code == 403:
        return f"{status_code} Forbidden/Unauthorized"
    if status_code == 404:
        return f"{status_code} Not Found"
    if status_code >= 500:
        return f"{status_code} Server Error"
    return str(status_code)

def run_tests():
    print(f"Initialize Test Client (SECRET_KEY: {settings.SECRET_KEY[:10]}...)")
    
    # Check if we have an admin user
    try:
        admin_user = User.objects.get(email="admin@mayankcollege.edu")
        print(f"Found test admin user '{admin_user.email}'")
    except User.DoesNotExist:
        print("Test admin user not found. Please run 'python seed.py' first.")
        sys.exit(1)

    client = APIClient(SERVER_NAME='localhost')
 
    # Step 1: Login to get token (Test POST /api/auth/login/)
    login_response = client.post('/api/auth/login/', {
        'email': 'admin@mayankcollege.edu',
        'password': 'Test@123'
    }, format='json')
    
    if login_response.status_code != 200:
        # Fallback to older password if they hadn't changed it via frontend
        login_response = client.post('/api/auth/login/', {
            'email': 'admin@mayankcollege.edu',
            'password': 'password123'
        }, format='json')
 
    if login_response.status_code == 200:
        tokens = login_response.json()
        # SARAS API returns tokens inside a 'data' key
        data = tokens.get('data', {})
        access_token = data.get('access')
        if not access_token:
            print(f"ERROR: Login returned 200 but no 'access' token found in 'data': {tokens}")
            is_authenticated = False
        else:
            print(f"Login Successful. Access token: {access_token[:15]}...")
        
        # Verify it manually right here
        try:
            import jwt
            decoded = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
            print(f"DEBUG: Token manually verified in test script logic. Payload: {decoded.get('user_id')}")
        except Exception as e:
            print(f"DEBUG: Token manual verification FAILED in test script: {e}")
            
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        is_authenticated = True
    else:
        print(f"Login Failed with status {login_response.status_code}")
        print(f"Response: {login_response.content}")
        is_authenticated = False

    results = []
    
    print("\nTesting Endpoints...")
    for index, (name, path, req_auth, method) in enumerate(ENDPOINTS):
        try:
            if method == "GET":
                response = client.get(path)
            elif method == "POST":
                response = client.post(path)
            
            if response.status_code == 401 and req_auth:
                print(f"Auth Failure on {name}: {response.content}")
            
            # Record outcome
            results.append([index + 1, name, method, path, map_status_code_color(response.status_code)])
        except Exception as e:
            results.append([index + 1, name, method, path, f"ERROR: {str(e)}"])

    # Pretty print the table
    out_table = tabulate(results, headers=["#", "Name", "Method", "Endpoint Path", "Status"])
    print(out_table)
    
    with open("api_endpoints_report.md", "a", encoding="utf-8") as f:
        f.write("\n```text\n")
        f.write(out_table)
        f.write("\n```\n")

    print("\nNote: Status codes 200/201/204 indicate endpoint success.")
    print("      Status codes 401/403 indicate token expiration or lack of Role clearance.")
    print("      Status codes 404 indicates endpoint exists but resource missing (normal).")
    print("      Any 500 status code indicates a server crash/breakage.")

if __name__ == "__main__":
    run_tests()
