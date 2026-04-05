# SARAS API Endpoints Report

## 1. Authentication (`/api/auth/`)
- `POST /api/auth/login/` - Authenticate and get JWT tokens
- `POST /api/auth/logout/` - Blacklist refresh token
- `POST /api/auth/token/refresh/` - Get new access token
- `POST /api/auth/password/change/` - Change user password
- `GET /api/auth/me/` - Get current authenticated user details

## 2. Users & Profiles (`/api/users/`)
- `GET /api/users/` - List all users
- `POST /api/users/create/` - Create a new user
- `GET /api/users/profile/` - Get own profile (student/teacher)
- `GET /api/users/departments/` - List departments for registration/filtering
- `GET /api/users/sections/` - List sections for registration/filtering
- `GET /api/users/<uuid:id>/` - Get specific user details
- `PUT/PATCH /api/users/<uuid:id>/update/` - Update specific user

## 3. Administration (`/api/admin/`)
- `GET /api/admin/stats/` - Dashboard statistics
- `GET /api/admin/audit-log/` - View login/system audit log
- `GET/PUT /api/admin/settings/` - Platform settings
- `POST /api/admin/users/bulk-upload/` - Upload CSV for bulk user creation
- `GET /api/admin/users/bulk-upload/<uuid:job_id>/status/` - Check bulk upload status
- `GET /api/admin/users/bulk-upload/<uuid:job_id>/errors/` - Get bulk upload errors
- `POST /api/admin/users/<uuid:user_id>/reset-password/` - Admin reset user password
- `POST /api/admin/users/<uuid:user_id>/toggle-active/` - Admin disable/enable user
- `GET/POST/PUT/DELETE /api/admin/departments/` - Department management
- `GET/POST/PUT/DELETE /api/admin/sections/` - Section management
- `GET/POST/PUT/DELETE /api/admin/documents/` - Document management

## 4. Documents (`/api/documents/`)
- `GET /api/documents/` - List all available documents
- `POST /api/documents/upload/` - Upload a new document
- `GET /api/documents/my-uploads/` - List documents uploaded by current user
- `GET/DELETE /api/documents/<uuid>/` - Get document details or delete
- `GET /api/documents/<uuid>/serve/` - Serve document file via signed URL
- `GET/PUT /api/documents/<uuid>/manage/` - Manage document metadata/permissions
- `POST /api/documents/<uuid>/flag/` - Report an inappropriate document
- `GET /api/documents/<uuid>/view-log/` - History of users who viewed document

## 5. Assessments (`/api/assessments/`)
- `GET/POST/PUT/DELETE /api/assessments/tests/` - Test/Exam management

## 6. Notifications (`/api/notifications/`)
- `GET /api/notifications/` - List personal & broadcast notifications
- `POST /api/notifications/` - Admin creates announcement
- `GET /api/notifications/unread-count/` - Get count of unread notifications
- `POST /api/notifications/read-all/` - Mark all notifications as read
- `PATCH /api/notifications/<uuid>/read/` - Mark specific notification as read
- `DELETE /api/notifications/<uuid>/` - Delete a notification

## 7. System
- `GET /health/` - System health check

---

### Test Results

(Run `python test_endpoints.py` to see the automated test check results)

```text
  #  Name                       Method    Endpoint Path                     Status
---  -------------------------  --------  --------------------------------  --------------------------
  1  Health Check               GET       /health/                          200 OK
  2  My Profile Info            GET       /api/auth/me/                     401 Forbidden/Unauthorized
  3  List All Users             GET       /api/users/                       401 Forbidden/Unauthorized
  4  Department List            GET       /api/users/departments/           401 Forbidden/Unauthorized
  5  Section List               GET       /api/users/sections/              401 Forbidden/Unauthorized
  6  Admin Platform Stats       GET       /api/admin/stats/                 401 Forbidden/Unauthorized
  7  Admin Active Users         GET       /api/admin/users/                 404 Not Found
  8  Global Document List       GET       /api/documents/                   401 Forbidden/Unauthorized
  9  My Uploaded Documents      GET       /api/documents/my-uploads/        401 Forbidden/Unauthorized
 10  Assessment Tests List      GET       /api/assessments/tests/           401 Forbidden/Unauthorized
 11  Notification Inbox         GET       /api/notifications/               401 Forbidden/Unauthorized
 12  Notification Unread Count  GET       /api/notifications/unread-count/  401 Forbidden/Unauthorized
```

```text
  #  Name                       Method    Endpoint Path                     Status
---  -------------------------  --------  --------------------------------  --------------------------
  1  Health Check               GET       /health/                          200 OK
  2  My Profile Info            GET       /api/auth/me/                     401 Forbidden/Unauthorized
  3  List All Users             GET       /api/users/                       401 Forbidden/Unauthorized
  4  Department List            GET       /api/users/departments/           401 Forbidden/Unauthorized
  5  Section List               GET       /api/users/sections/              401 Forbidden/Unauthorized
  6  Admin Platform Stats       GET       /api/admin/stats/                 401 Forbidden/Unauthorized
  7  Admin Active Users         GET       /api/admin/users/                 404 Not Found
  8  Global Document List       GET       /api/documents/                   401 Forbidden/Unauthorized
  9  My Uploaded Documents      GET       /api/documents/my-uploads/        401 Forbidden/Unauthorized
 10  Assessment Tests List      GET       /api/assessments/tests/           401 Forbidden/Unauthorized
 11  Notification Inbox         GET       /api/notifications/               401 Forbidden/Unauthorized
 12  Notification Unread Count  GET       /api/notifications/unread-count/  401 Forbidden/Unauthorized
```

```text
  #  Name                       Method    Endpoint Path                     Status
---  -------------------------  --------  --------------------------------  --------------------------
  1  Health Check               GET       /health/                          200 OK
  2  My Profile Info            GET       /api/auth/me/                     401 Forbidden/Unauthorized
  3  List All Users             GET       /api/users/                       401 Forbidden/Unauthorized
  4  Department List            GET       /api/users/departments/           401 Forbidden/Unauthorized
  5  Section List               GET       /api/users/sections/              401 Forbidden/Unauthorized
  6  Admin Platform Stats       GET       /api/admin/stats/                 401 Forbidden/Unauthorized
  7  Admin Active Users         GET       /api/admin/users/                 404 Not Found
  8  Global Document List       GET       /api/documents/                   401 Forbidden/Unauthorized
  9  My Uploaded Documents      GET       /api/documents/my-uploads/        401 Forbidden/Unauthorized
 10  Assessment Tests List      GET       /api/assessments/tests/           401 Forbidden/Unauthorized
 11  Notification Inbox         GET       /api/notifications/               401 Forbidden/Unauthorized
 12  Notification Unread Count  GET       /api/notifications/unread-count/  401 Forbidden/Unauthorized
```

```text
  #  Name                       Method    Endpoint Path                     Status
---  -------------------------  --------  --------------------------------  --------------------------
  1  Health Check               GET       /health/                          200 OK
  2  My Profile Info            GET       /api/auth/me/                     401 Forbidden/Unauthorized
  3  List All Users             GET       /api/users/                       401 Forbidden/Unauthorized
  4  Department List            GET       /api/users/departments/           401 Forbidden/Unauthorized
  5  Section List               GET       /api/users/sections/              401 Forbidden/Unauthorized
  6  Admin Platform Stats       GET       /api/admin/stats/                 401 Forbidden/Unauthorized
  7  Admin Active Users         GET       /api/admin/users/                 404 Not Found
  8  Global Document List       GET       /api/documents/                   401 Forbidden/Unauthorized
  9  My Uploaded Documents      GET       /api/documents/my-uploads/        401 Forbidden/Unauthorized
 10  Assessment Tests List      GET       /api/assessments/tests/           401 Forbidden/Unauthorized
 11  Notification Inbox         GET       /api/notifications/               401 Forbidden/Unauthorized
 12  Notification Unread Count  GET       /api/notifications/unread-count/  401 Forbidden/Unauthorized
```

```text
  #  Name                       Method    Endpoint Path                     Status
---  -------------------------  --------  --------------------------------  --------------------------
  1  Health Check               GET       /health/                          200 OK
  2  My Profile Info            GET       /api/auth/me/                     401 Forbidden/Unauthorized
  3  List All Users             GET       /api/users/                       401 Forbidden/Unauthorized
  4  Department List            GET       /api/users/departments/           401 Forbidden/Unauthorized
  5  Section List               GET       /api/users/sections/              401 Forbidden/Unauthorized
  6  Admin Platform Stats       GET       /api/admin/stats/                 401 Forbidden/Unauthorized
  7  Admin Active Users         GET       /api/admin/users/                 404 Not Found
  8  Global Document List       GET       /api/documents/                   401 Forbidden/Unauthorized
  9  My Uploaded Documents      GET       /api/documents/my-uploads/        401 Forbidden/Unauthorized
 10  Assessment Tests List      GET       /api/assessments/tests/           401 Forbidden/Unauthorized
 11  Notification Inbox         GET       /api/notifications/               401 Forbidden/Unauthorized
 12  Notification Unread Count  GET       /api/notifications/unread-count/  401 Forbidden/Unauthorized
```

```text
  #  Name                       Method    Endpoint Path                     Status
---  -------------------------  --------  --------------------------------  --------------------------
  1  Health Check               GET       /health/                          200 OK
  2  My Profile Info            GET       /api/auth/me/                     401 Forbidden/Unauthorized
  3  List All Users             GET       /api/users/                       401 Forbidden/Unauthorized
  4  Department List            GET       /api/users/departments/           401 Forbidden/Unauthorized
  5  Section List               GET       /api/users/sections/              401 Forbidden/Unauthorized
  6  Admin Platform Stats       GET       /api/admin/stats/                 401 Forbidden/Unauthorized
  7  Admin Active Users         GET       /api/admin/users/                 404 Not Found
  8  Global Document List       GET       /api/documents/                   401 Forbidden/Unauthorized
  9  My Uploaded Documents      GET       /api/documents/my-uploads/        401 Forbidden/Unauthorized
 10  Assessment Tests List      GET       /api/assessments/tests/           401 Forbidden/Unauthorized
 11  Notification Inbox         GET       /api/notifications/               401 Forbidden/Unauthorized
 12  Notification Unread Count  GET       /api/notifications/unread-count/  401 Forbidden/Unauthorized
```

```text
  #  Name                       Method    Endpoint Path                     Status
---  -------------------------  --------  --------------------------------  --------------------------
  1  Health Check               GET       /health/                          200 OK
  2  My Profile Info            GET       /api/auth/me/                     401 Forbidden/Unauthorized
  3  List All Users             GET       /api/users/                       401 Forbidden/Unauthorized
  4  Department List            GET       /api/users/departments/           401 Forbidden/Unauthorized
  5  Section List               GET       /api/users/sections/              401 Forbidden/Unauthorized
  6  Admin Platform Stats       GET       /api/admin/stats/                 401 Forbidden/Unauthorized
  7  Admin Active Users         GET       /api/admin/users/                 404 Not Found
  8  Global Document List       GET       /api/documents/                   401 Forbidden/Unauthorized
  9  My Uploaded Documents      GET       /api/documents/my-uploads/        401 Forbidden/Unauthorized
 10  Assessment Tests List      GET       /api/assessments/tests/           401 Forbidden/Unauthorized
 11  Notification Inbox         GET       /api/notifications/               401 Forbidden/Unauthorized
 12  Notification Unread Count  GET       /api/notifications/unread-count/  401 Forbidden/Unauthorized
```

```text
  #  Name                       Method    Endpoint Path                     Status
---  -------------------------  --------  --------------------------------  --------------------------
  1  Health Check               GET       /health/                          200 OK
  2  My Profile Info            GET       /api/auth/me/                     401 Forbidden/Unauthorized
  3  List All Users             GET       /api/users/                       401 Forbidden/Unauthorized
  4  Department List            GET       /api/users/departments/           401 Forbidden/Unauthorized
  5  Section List               GET       /api/users/sections/              401 Forbidden/Unauthorized
  6  Admin Platform Stats       GET       /api/admin/stats/                 401 Forbidden/Unauthorized
  7  Admin Active Users         GET       /api/admin/users/                 404 Not Found
  8  Global Document List       GET       /api/documents/                   401 Forbidden/Unauthorized
  9  My Uploaded Documents      GET       /api/documents/my-uploads/        401 Forbidden/Unauthorized
 10  Assessment Tests List      GET       /api/assessments/tests/           401 Forbidden/Unauthorized
 11  Notification Inbox         GET       /api/notifications/               401 Forbidden/Unauthorized
 12  Notification Unread Count  GET       /api/notifications/unread-count/  401 Forbidden/Unauthorized
```

```text
  #  Name                       Method    Endpoint Path                     Status
---  -------------------------  --------  --------------------------------  --------------------------
  1  Health Check               GET       /health/                          200 OK
  2  My Profile Info            GET       /api/auth/me/                     401 Forbidden/Unauthorized
  3  List All Users             GET       /api/users/                       401 Forbidden/Unauthorized
  4  Department List            GET       /api/users/departments/           401 Forbidden/Unauthorized
  5  Section List               GET       /api/users/sections/              401 Forbidden/Unauthorized
  6  Admin Platform Stats       GET       /api/admin/stats/                 401 Forbidden/Unauthorized
  7  Admin Active Users         GET       /api/admin/users/                 404 Not Found
  8  Global Document List       GET       /api/documents/                   401 Forbidden/Unauthorized
  9  My Uploaded Documents      GET       /api/documents/my-uploads/        401 Forbidden/Unauthorized
 10  Assessment Tests List      GET       /api/assessments/tests/           401 Forbidden/Unauthorized
 11  Notification Inbox         GET       /api/notifications/               401 Forbidden/Unauthorized
 12  Notification Unread Count  GET       /api/notifications/unread-count/  401 Forbidden/Unauthorized
```

```text
  #  Name                       Method    Endpoint Path                     Status
---  -------------------------  --------  --------------------------------  --------------------------
  1  Health Check               GET       /health/                          200 OK
  2  My Profile Info            GET       /api/auth/me/                     401 Forbidden/Unauthorized
  3  List All Users             GET       /api/users/                       401 Forbidden/Unauthorized
  4  Department List            GET       /api/users/departments/           401 Forbidden/Unauthorized
  5  Section List               GET       /api/users/sections/              401 Forbidden/Unauthorized
  6  Admin Platform Stats       GET       /api/admin/stats/                 401 Forbidden/Unauthorized
  7  Admin Active Users         GET       /api/admin/users/                 404 Not Found
  8  Global Document List       GET       /api/documents/                   401 Forbidden/Unauthorized
  9  My Uploaded Documents      GET       /api/documents/my-uploads/        401 Forbidden/Unauthorized
 10  Assessment Tests List      GET       /api/assessments/tests/           401 Forbidden/Unauthorized
 11  Notification Inbox         GET       /api/notifications/               401 Forbidden/Unauthorized
 12  Notification Unread Count  GET       /api/notifications/unread-count/  401 Forbidden/Unauthorized
```

```text
  #  Name                       Method    Endpoint Path                     Status
---  -------------------------  --------  --------------------------------  --------------------------
  1  Health Check               GET       /health/                          200 OK
  2  My Profile Info            GET       /api/auth/me/                     401 Forbidden/Unauthorized
  3  List All Users             GET       /api/users/                       401 Forbidden/Unauthorized
  4  Department List            GET       /api/users/departments/           401 Forbidden/Unauthorized
  5  Section List               GET       /api/users/sections/              401 Forbidden/Unauthorized
  6  Admin Platform Stats       GET       /api/admin/stats/                 401 Forbidden/Unauthorized
  7  Admin Active Users         GET       /api/admin/users/                 404 Not Found
  8  Global Document List       GET       /api/documents/                   401 Forbidden/Unauthorized
  9  My Uploaded Documents      GET       /api/documents/my-uploads/        401 Forbidden/Unauthorized
 10  Assessment Tests List      GET       /api/assessments/tests/           401 Forbidden/Unauthorized
 11  Notification Inbox         GET       /api/notifications/               401 Forbidden/Unauthorized
 12  Notification Unread Count  GET       /api/notifications/unread-count/  401 Forbidden/Unauthorized
```

```text
  #  Name                       Method    Endpoint Path                     Status
---  -------------------------  --------  --------------------------------  --------------------------
  1  Health Check               GET       /health/                          200 OK
  2  My Profile Info            GET       /api/auth/me/                     401 Forbidden/Unauthorized
  3  List All Users             GET       /api/users/                       401 Forbidden/Unauthorized
  4  Department List            GET       /api/users/departments/           401 Forbidden/Unauthorized
  5  Section List               GET       /api/users/sections/              401 Forbidden/Unauthorized
  6  Admin Platform Stats       GET       /api/admin/stats/                 401 Forbidden/Unauthorized
  7  Admin Active Users         GET       /api/admin/users/                 404 Not Found
  8  Global Document List       GET       /api/documents/                   401 Forbidden/Unauthorized
  9  My Uploaded Documents      GET       /api/documents/my-uploads/        401 Forbidden/Unauthorized
 10  Assessment Tests List      GET       /api/assessments/tests/           401 Forbidden/Unauthorized
 11  Notification Inbox         GET       /api/notifications/               401 Forbidden/Unauthorized
 12  Notification Unread Count  GET       /api/notifications/unread-count/  401 Forbidden/Unauthorized
```

```text
  #  Name                       Method    Endpoint Path                     Status
---  -------------------------  --------  --------------------------------  -------------
  1  Health Check               GET       /health/                          200 OK
  2  My Profile Info            GET       /api/auth/me/                     200 OK
  3  List All Users             GET       /api/users/                       200 OK
  4  Department List            GET       /api/users/departments/           200 OK
  5  Section List               GET       /api/users/sections/              200 OK
  6  Admin Platform Stats       GET       /api/admin/stats/                 200 OK
  7  Admin Active Users         GET       /api/admin/users/                 404 Not Found
  8  Global Document List       GET       /api/documents/                   200 OK
  9  My Uploaded Documents      GET       /api/documents/my-uploads/        200 OK
 10  Assessment Tests List      GET       /api/assessments/tests/           200 OK
 11  Notification Inbox         GET       /api/notifications/               200 OK
 12  Notification Unread Count  GET       /api/notifications/unread-count/  200 OK
```
