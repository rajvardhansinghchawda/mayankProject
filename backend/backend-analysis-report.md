# SARAS Backend: Complete Analysis & API Report

This document provides an exhaustive, low-level technical analysis of the completely assembled SARAS backend application. It breaks down the codebase structure, database schemas, and outlines every active REST API and WebSocket endpoint.

---

## 1. Project Topology & Frameworks

The system is deployed using a hybrid multi-framework architecture:

*   **Django + DRF (Port 8000)**: Serves as the primary ORM, admin panel, and REST HTTP interface. Handles authentication, database migrations, and heavy computational data parsing.
*   **FastAPI (Port 8001)**: Dedicated narrowly to asynchronous WebSockets for live examination tracking and proctor alerting, bypassing Django's synchronous ORM overhead for immense speed.
*   **Celery & Redis**: Offloads asynchronous burdens (like document watermarking queues, automated attempt grading at timer expiration, and mass email broadcasting).

### Complete Backend File Structure

```text
backend/
├── .env.example
├── manage.py
├── requirements.txt
├── backend-workflow.md
├── backend-analysis-report.md
│
├── saras/                             # Django Root Configurations
│   ├── __init__.py
│   ├── asgi.py
│   ├── celery.py                      # Core Celery init tying to Redis
│   ├── exceptions.py                  # Custom global exception handlers
│   ├── middleware.py                  # LoginAudit & SecurityHeaders middlewares
│   ├── pagination.py                  # DRF standard pagination classes
│   ├── settings.py                    # Environment, Apps, DRF, JWT bindings
│   ├── urls.py                        # Master router map
│   └── wsgi.py
│
├── apps/                              # Core Django Apps Packages
│   ├── __init__.py
│   │
│   ├── authentication/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── serializers.py             # Login, Token, Password resetting payloads
│   │   ├── urls.py
│   │   └── views.py                   # Auth endpoints over DRF
│   │
│   ├── users/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py                  # User, Profiles, Institution, Dept, Section
│   │   ├── serializers.py             # User CRUD serialization mappings
│   │   ├── urls.py
│   │   ├── views.py
│   │   └── management/
│   │       ├── __init__.py
│   │       └── commands/
│   │           ├── __init__.py
│   │           └── seed_defaults.py   # Seeding for Demo defaults & admin profiles
│   │
│   ├── documents/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py                  # Document (BYTEA storage), DocumentView
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py                   # Catalog & Anti-Screenshot `/serve/` logic
│   │
│   ├── assessments/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py                  # Test, Questions, Attempt, Answers, Events
│   │   ├── serializers.py             # Complex Student vs Teacher restricted views
│   │   ├── urls.py
│   │   └── views.py                   # 15+ complex exam cycle endpoints
│   │
│   ├── administration/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py                  # BulkImportJob tracker
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py                   # Aggregation stats, imports, content moderation
│   │
│   └── notifications/
│       ├── __init__.py
│       ├── apps.py
│       ├── models.py                  # App notifications history
│       ├── serializers.py
│       ├── urls.py
│       └── views.py
│
├── realtime/                          # FastAPI Standalone WebSockets Service
│   ├── main.py                        # ASGI FastAPI App configuration
│   ├── deps.py                        # Standalone PyJWT parsing mirroring Django
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── proctoring.py              # Subscribes to proctor alert PubSubs
│   │   └── test_session.py            # Student behavior detection & timer websockets
│   └── services/
│       ├── __init__.py
│       └── redis_service.py           # Async native Redis driver mappings
│
└── tasks/                             # Celery Deferrable Background Tasks
    ├── __init__.py
    ├── celery_app.py                  # Decorator linkage bindings
    ├── auto_submit.py                 # Calculates late quiz scoring
    ├── bulk_import.py                 # Batch SQL transaction csv parses
    └── notifications_tasks.py         # SMTP email broadcasting routines
```

---

## 2. Database Models Architecture

All core logic tables utilize `UUIDField` as primary keys to halt sequential ID scraping, and employ `history` / `deleted_at` markers prioritizing Soft Deletion.

### A. Users App (`apps.users`)
*   `Institution`: `name`, `short_name`, `address`
*   `Department`: `institution`, `name`, `code`
*   `Section`: `department`, `name`, `semester`, `academic_year`
*   `User`: Inherits `AbstractBaseUser`. Connects natively to PyJWT. Tracks `role` (Admin/Teacher/Student) and `force_password_change`.
*   `StudentProfile` (O2O mapped to User): `roll_number`, `enrollment_number`, `section_id`
*   `TeacherProfile` (O2O mapped to User): `employee_id`, `department_id`, `designation`

### B. Documents App (`apps.documents`)
*   `Document`: `title`, `description`, `file_data` (`BYTEA`), `mime_type`, `watermark_enabled`, `flag_count`, `status`.
*   `DocumentView`: Audit tracker mapping `viewer`, `document`, `ip_address`, `viewed_at`.

### C. Assessments App (`apps.assessments`)
*   `Test`: `title`, `description`, `subject_name`, `duration_minutes`, `passing_marks`, `status` (DRAFT/PUBLISHED/CLOSED), `sections_allowed`.
*   `TestQuestion`: `test_id`, `text`, `question_type` (MCQ/TF/DESCRIPTIVE), `marks`, `order`.
*   `QuestionOption`: `question_id`, `text`, `is_correct`.
*   `TestAttempt`: Tracks individual student sessions (`student_id`, `test_id`, `started_at`, `submitted_at`, `expires_at`, `score`, `status`).
*   `StudentAnswer`: Maps `attempt_id` + `question_id` to either `selected_option_id` (MCQ) or `text_answer` (Descriptive). Tracks `is_correct`.
*   `BehavioralEvent`: Intensive logging table (`attempt_id`, `event_type` [tab_switch, fullscreen_exit], `timestamp`).

### D. Administration App (`apps.administration`)
*   `BulkImportJob`: Tracks async celery `.csv` processing (`import_type`, `total_rows`, `success_rows`, `error_rows`, `status`).

---

## 3. Comprehensive API Endpoints Registry

> **Note on Authentication**: With the exclusion of `/api/auth/login/`, all endpoints enforce `Authorization: Bearer <access_token>` validation matching the JWT signature (`HS256`).

### 🔑 Authentication (`/api/auth/`)
*   **POST** `/api/auth/login/` 
    *   *Payload:* `{ "email": "...", "password": "..." }`
    *   *Response:* JWT `access`, `refresh`, and user basic dict. Fires `LoginAudit` row generation.
*   **POST** `/api/auth/refresh/`
    *   *Payload:* `{ "refresh": "..." }`
    *   *Response:* Rotates current session granting new `access` token.
*   **POST** `/api/auth/change-password/`
    *   *Required:* Used intensely during first-login sequence if `force_password_change` restricts actions.
*   **POST** `/api/auth/logout/`
    *   Blacklists the provided refresh token terminating the session server-side.

### 👤 Users (`/api/users/`)
*   **GET/POST** `/api/users/` 
    *   CRUD management for users. Strict role filtering (Admins can view all, Teachers view only their Dept).
*   **GET** `/api/users/me/`
    *   Yields customized dynamic payload returning respective `StudentProfile` or `TeacherProfile` data based on requesting JWT.

### 📄 Documents (Anti-Screenshot Module) (`/api/documents/`)
*   **GET/POST** `/api/documents/`
    *   Catalog querying. Teachers insert records (uploading binary PDF data directly to DB).
*   **GET** `/api/documents/{id}/`
    *   Yields metadata.
*   **GET** `/api/documents/{id}/serve/`
    *   *CRITICAL:* Requires specific 5-min short-lived JWTs. Executes `PyMuPDF` rendering to dynamically inject *"Viewed By: [User]"* onto every raw PDF byte. Rejects standard HTTP caching formats.
*   **POST** `/api/documents/{id}/flag/`
    *   Student triggers regarding inappropriate docs, increments `flag_count` for admin moderation workflows.

### 📝 Assessments Core (`/api/tests/`)
*   **GET/POST** `/api/tests/`
    *   Test listings. Students only view published tests mapped to their assigned `section`.
*   **GET/PUT/DELETE** `/api/tests/{id}/`
    *   Deep crud. 
*   **GET** `/api/tests/{id}/questions/`
    *   *Teacher View:* Yields questions and marks correct answers true. 
    *   *Student View:* Mutates payload to entirely strip `is_correct` markers preventing client-side inspection hacking.
*   **POST** `/api/tests/{id}/publish/` & `/api/tests/{id}/close/`
    *   Transitions state markers preventing active modifications.

### 🚦 Live Test Execution (`/api/tests/{id}/attempt/`)
*   **POST** `/api/tests/{id}/start/`
    *   Fires attempt generation. Checks `duration_minutes` mapping `expires_at`. Triggers synchronous Celery `ETA` task. Returns first batch of shuffled questions.
*   **GET** `/api/tests/{id}/attempt/`
    *   Recovers active session matching `IN_PROGRESS` tags in case of accidental browser crashes.
*   **POST** `/api/tests/{id}/attempt/answer/`
    *   High-throughput auto-save. Updates `StudentAnswer` dynamically.
*   **POST** `/api/tests/{id}/attempt/submit/`
    *   Manual grading trigger. Tallies scoring, marks test `SUBMITTED`, revokes overlapping celery-timeouts, restricts further endpoints.
*   **POST** `/api/tests/{id}/attempt/event/`
    *   Rate-limited (50/min). Catch-all for http-side logging (mouse drift, keystrokes).

### 🖥️ Administration & Settings (`/api/admin/`)
*   **GET** `/api/admin/stats/`
    *   Dashboard aggregations: Returns counters for Active Users, Tests generated, Avg scores.
*   **POST** `/api/admin/users/bulk-upload/`
    *   Spawns `BulkImportJob` Celery queue yielding job UUID for progress tracking.
*   **GET** `/api/admin/audit-logs/`
    *   Fetches `LoginAuditLog` tracking metrics.
*   **GET/POST** `/api/admin/departments/` & `/api/admin/sections/`
    *   Standard foundational setup routes. Mapped heavily to views initializing choices menus.
*   **POST** `/api/admin/documents/{id}/approve/` & `/api/admin/documents/{id}/remove/`
    *   Content moderation pipelines managing heavy `flag_count` anomalies.

---

## 4. Standalone Real-Time Pipelines (FastAPI)

These endpoints strictly handle `wSS://` WebSockets, accepting queries over standard upgrades. They extract `user_id` by executing native PyJWT decoding logic mirroring Django's config.

*   **WebSocket `/ws/test/{attempt_id}/`**
    *   *Users:* Students executing an active assessment.
    *   *Purpose:* Listens actively to inbound window-focus events. Emits heartbeat synchronous pulses preventing arbitrary disconnections.
    *   *Integrations:* Hooks directly into Redis Pub/Sub modifying caching configurations.

*   **WebSocket `/ws/proctor/{test_id}/`**
    *   *Users:* Active Teachers monitoring an ongoing exam room.
    *   *Purpose:* Acts as a Read-Only subscriber catching anomalies broadcasted directly from the student channels (via `saras:proctor_channel:global`). Instantly yields JSON updates regarding cheating behaviors.

---

## 5. Background Process Integrations (Celery)

Celery executes via local `redis://` buses to prevent UI locking. Tasks explicitly include:
*   `tasks.process_bulk_import(job_id)`: Maps `csv` rows, executes bulk inserts cleanly stopping mid-point failures via transactions.
*   `tasks.auto_submit_attempt(attempt_id)`: Triggered entirely automatically by clock `ETA`. Grades non-committed logic, marks session closed.
*   `tasks.send_notification_email(str)`: Binds simple SMTP dispatch queues. 
