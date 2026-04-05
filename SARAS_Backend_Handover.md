# SARAS — Backend Agent Handover Report
## Smart Academic Resource and Secure Assessment System
### Prepared For: Backend Development Team

---

## UI VERIFICATION AUDIT

Before backend specification begins, this section confirms that the delivered UI (SARAS Hub UI Structure & Technical Documentation) aligns with the agreed frontend page specification.

### Verified Matches ✅

| Agreed Page | UI Route | Status |
|---|---|---|
| Login Page | `/` | ✅ Matched — role selector, credential inputs, brand identity present |
| Forgot Password | `/forgot-password` | ✅ Matched |
| Student Dashboard | `/dashboard` | ✅ Matched — welcome banner, active tests, quick actions present |
| Student Profile | `/profile` | ✅ Matched — identity card, security settings, activity trace present |
| Tests List | `/tests` | ✅ Matched — test grid, filters, conduct guidelines present |
| Resource Library | `/resources` | ✅ Matched — search, category filters, material grid present |
| My Uploads | `/uploads` | ✅ Matched — upload stats, submission list, policy banner present |
| Teacher Dashboard | `/teacher/dashboard` | ✅ Matched — institutional stats, quick test creator present |
| Teacher Resources | `/teacher/resources` | ✅ Matched |
| Admin Dashboard | `/admin/dashboard` | ✅ Matched — global analytics, audit stream present |
| User Control | `/admin/users` | ✅ Matched — bulk upload, master table present |
| Department Management | `/admin/departments` | ✅ Matched |
| System Settings | `/settings` | ✅ Matched — tabbed config (General, SMTP, Security) present |
| Pre-Test Instructions | `/assessments/instructions` | ✅ Matched |
| Active Test Environment | `/assessments/active` | ✅ Matched — question palette, proctoring banner, control footer present |

### Gaps Identified — Backend Must Handle 🔴

| Missing from UI Docs | Required Per Spec | Backend Action Required |
|---|---|---|
| Forced Password Change page | Page 2 of spec — mandatory on first login | Backend must return `force_password_change: true` flag in login response |
| Test Submitted Confirmation | Page 12 of spec | Auto-redirect after submission — backend returns submission receipt |
| Test Result Page | Page 13 of spec | Separate results endpoint gated by `results_released` flag |
| Admin Content Moderation Page | Page 27 of spec | Full moderation endpoints required — flagging, removal, approval |
| 403 / 404 / Session Expired pages | Pages 30–32 | Backend returns correct HTTP status codes — frontend handles display |
| Student Attempt Detail (Teacher) | Page 19 of spec | Full behavioral event log endpoint per student per test |

**Conclusion**: UI is approximately 82% aligned with agreed specification. The missing pages are downstream pages (post-action states and admin moderation) that the UI team likely deferred. Backend must implement full API support for all 32 pages as specified. The UI is cleared for backend integration.

---

## Section 1 — Architecture Overview

### 1.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│              React/Next.js Frontend (SPA)                   │
└───────────────────┬─────────────────────────────────────────┘
                    │ HTTPS / WSS
┌───────────────────▼─────────────────────────────────────────┐
│                      API GATEWAY LAYER                      │
│        Django (REST API) + FastAPI (WebSocket/RT)           │
│              Nginx reverse proxy in front                   │
└──────┬──────────────────────┬──────────────────────┬────────┘
       │                      │                      │
┌──────▼──────┐    ┌──────────▼──────┐    ┌─────────▼───────┐
│  PostgreSQL │    │  Redis Cache +  │    │  Celery Worker  │
│  (Primary   │    │  Message Broker │    │  (Async Tasks)  │
│   Database) │    │                 │    │                 │
└─────────────┘    └─────────────────┘    └─────────────────┘
                                                   │
                                    ┌──────────────▼──────────┐
                                    │   File Storage          │
                                    │   (Local FS / S3)       │
                                    │   PDF files only        │
                                    └─────────────────────────┘
```

### 1.2 Service Responsibilities

| Service | Technology | Responsibility |
|---|---|---|
| Primary REST API | Django 4.2 + DRF | Auth, CRUD operations, user management, file upload/serve |
| Real-Time Service | FastAPI + WebSockets | Test timer sync, live proctoring events, tab-switch push alerts |
| Task Queue | Celery + Redis | Auto-submission jobs, bulk CSV processing, watermark generation, email dispatch |
| Cache & Broker | Redis 7 | Session cache, WebSocket pub/sub, Celery broker, rate limiting |
| Database | PostgreSQL 15 | All persistent data including PDF binary storage |
| Reverse Proxy | Nginx | SSL termination, route to Django (8000) or FastAPI (8001) |

---

## Section 2 — Database Schema (PostgreSQL)

### 2.1 Schema Design Philosophy

- All PDF files are stored as `BYTEA` in PostgreSQL — no filesystem dependency, no separate S3 required for MVP. Max enforced size: 2 MB (2,097,152 bytes). Validation at both application and database constraint level.
- Behavioral events are stored in a separate high-write table with a BRIN index on timestamp.
- All tables use UUID primary keys to prevent enumeration attacks.
- Soft delete pattern used across all user-facing entities — `is_deleted` + `deleted_at` columns.

### 2.2 Complete Table Definitions

```sql
-- ============================================================
-- INSTITUTIONS (multi-tenant foundation)
-- ============================================================
CREATE TABLE institutions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    logo_data       BYTEA,                          -- institution logo stored in DB
    logo_mime       VARCHAR(50),
    color_accent    VARCHAR(7) DEFAULT '#1a73e8',   -- hex color for branding
    smtp_host       VARCHAR(255),
    smtp_port       INTEGER DEFAULT 587,
    smtp_user       VARCHAR(255),
    smtp_password   VARCHAR(255),                   -- encrypted at app layer
    smtp_use_tls    BOOLEAN DEFAULT TRUE,
    session_timeout INTEGER DEFAULT 30,             -- minutes
    max_upload_mb   INTEGER DEFAULT 2,              -- 2 MB hard cap
    min_password_len INTEGER DEFAULT 8,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DEPARTMENTS
-- ============================================================
CREATE TABLE departments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    code            VARCHAR(20) NOT NULL,           -- e.g., "CSE", "ECE"
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(institution_id, code)
);

-- ============================================================
-- SECTIONS
-- ============================================================
CREATE TABLE sections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id   UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name            VARCHAR(20) NOT NULL,           -- e.g., "A", "B", "C"
    semester        INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    academic_year   VARCHAR(9) NOT NULL,            -- e.g., "2024-2025"
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(department_id, name, semester, academic_year)
);

-- ============================================================
-- USERS (unified table for all roles)
-- ============================================================
CREATE TABLE users (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id          UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    role                    VARCHAR(20) NOT NULL CHECK (role IN ('student','teacher','admin')),
    full_name               VARCHAR(255) NOT NULL,
    email                   VARCHAR(255),
    roll_number             VARCHAR(50),            -- students only
    enrollment_number       VARCHAR(50),            -- students only
    employee_id             VARCHAR(50),            -- teachers/admins only
    password_hash           VARCHAR(255) NOT NULL,
    force_password_change   BOOLEAN DEFAULT TRUE,   -- TRUE for new accounts
    is_active               BOOLEAN DEFAULT TRUE,
    is_deleted              BOOLEAN DEFAULT FALSE,
    deleted_at              TIMESTAMPTZ,
    last_login_at           TIMESTAMPTZ,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(institution_id, email),
    UNIQUE(institution_id, roll_number),
    UNIQUE(institution_id, enrollment_number)
);

-- ============================================================
-- STUDENT PROFILES (extends users for students)
-- ============================================================
CREATE TABLE student_profiles (
    user_id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    section_id      UUID NOT NULL REFERENCES sections(id),
    cgpa            NUMERIC(4,2),
    attendance_pct  NUMERIC(5,2),
    profile_photo   BYTEA,
    photo_mime      VARCHAR(50),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TEACHER PROFILES (extends users for teachers)
-- ============================================================
CREATE TABLE teacher_profiles (
    user_id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    department_id   UUID NOT NULL REFERENCES departments(id),
    designation     VARCHAR(100),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TEACHER SUBJECT ASSIGNMENTS
-- ============================================================
CREATE TABLE teacher_subject_assignments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    section_id      UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    subject_name    VARCHAR(255) NOT NULL,
    subject_code    VARCHAR(30),
    academic_year   VARCHAR(9) NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    UNIQUE(teacher_id, section_id, subject_code, academic_year)
);

-- ============================================================
-- LOGIN AUDIT LOG
-- ============================================================
CREATE TABLE login_audit (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ip_address      INET,
    user_agent      TEXT,
    status          VARCHAR(20) NOT NULL CHECK (status IN ('success','failure','locked')),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_login_audit_user ON login_audit(user_id);
CREATE INDEX idx_login_audit_created ON login_audit USING BRIN (created_at);

-- ============================================================
-- DOCUMENTS (PDF file storage in database)
-- ============================================================
CREATE TABLE documents (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploader_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    section_id          UUID NOT NULL REFERENCES sections(id),
    subject_name        VARCHAR(255) NOT NULL,
    title               VARCHAR(500) NOT NULL,
    description         TEXT,
    doc_type            VARCHAR(50) NOT NULL CHECK (doc_type IN (
                            'notes','assignment','project_report',
                            'presentation','lab_manual','study_guide','other'
                        )),
    status              VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN (
                            'draft','published','removed','blocked'
                        )),

    -- PDF stored directly in PostgreSQL as BYTEA
    file_data           BYTEA NOT NULL,
    file_size_bytes     INTEGER NOT NULL CHECK (file_size_bytes <= 2097152),  -- 2 MB hard limit
    file_mime           VARCHAR(50) NOT NULL DEFAULT 'application/pdf',
    original_filename   VARCHAR(255) NOT NULL,
    file_hash           VARCHAR(64) NOT NULL,      -- SHA-256 for dedup detection

    view_count          INTEGER DEFAULT 0,
    flag_count          INTEGER DEFAULT 0,
    admin_note          TEXT,                      -- moderation notes (not shown to student)
    is_deleted          BOOLEAN DEFAULT FALSE,
    deleted_at          TIMESTAMPTZ,
    published_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_documents_section ON documents(section_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_uploader ON documents(uploader_id);

-- ============================================================
-- DOCUMENT VIEW LOG (for watermark forensics)
-- ============================================================
CREATE TABLE document_views (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id     UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    viewer_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewer_name     VARCHAR(255) NOT NULL,         -- snapshot at time of view
    viewed_at       TIMESTAMPTZ DEFAULT NOW(),
    ip_address      INET
);
CREATE INDEX idx_doc_views_doc ON document_views(document_id);
CREATE INDEX idx_doc_views_created ON document_views USING BRIN (viewed_at);

-- ============================================================
-- DOCUMENT FLAGS / REPORTS
-- ============================================================
CREATE TABLE document_flags (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id     UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    reporter_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason          VARCHAR(100) NOT NULL,
    description     TEXT,
    status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','reviewed','dismissed')),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(document_id, reporter_id)               -- one flag per user per document
);

-- ============================================================
-- TESTS
-- ============================================================
CREATE TABLE tests (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by              UUID NOT NULL REFERENCES users(id),
    section_id              UUID NOT NULL REFERENCES sections(id),
    subject_name            VARCHAR(255) NOT NULL,
    title                   VARCHAR(500) NOT NULL,
    description             TEXT,
    status                  VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN (
                                'draft','published','active','closed','results_released'
                            )),
    availability_start      TIMESTAMPTZ NOT NULL,
    availability_end        TIMESTAMPTZ NOT NULL,
    duration_minutes        INTEGER NOT NULL CHECK (duration_minutes > 0),
    total_marks             INTEGER NOT NULL DEFAULT 0,
    passing_marks           INTEGER,
    shuffle_questions       BOOLEAN DEFAULT FALSE,
    shuffle_options         BOOLEAN DEFAULT FALSE,
    show_answers_after      BOOLEAN DEFAULT FALSE,  -- reveal correct answers post-result release
    tab_switch_threshold    INTEGER DEFAULT 3,       -- switches before "High Risk" flag
    is_deleted              BOOLEAN DEFAULT FALSE,
    deleted_at              TIMESTAMPTZ,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW(),
    CHECK (availability_end > availability_start)
);
CREATE INDEX idx_tests_section ON tests(section_id);
CREATE INDEX idx_tests_status ON tests(status);

-- ============================================================
-- TEST QUESTIONS
-- ============================================================
CREATE TABLE test_questions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id         UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    question_text   TEXT NOT NULL,
    question_type   VARCHAR(20) NOT NULL CHECK (question_type IN ('mcq','short_answer','true_false')),
    marks           INTEGER NOT NULL DEFAULT 1,
    order_index     INTEGER NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_questions_test ON test_questions(test_id);

-- ============================================================
-- MCQ OPTIONS
-- ============================================================
CREATE TABLE question_options (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id     UUID NOT NULL REFERENCES test_questions(id) ON DELETE CASCADE,
    option_text     TEXT NOT NULL,
    is_correct      BOOLEAN DEFAULT FALSE,
    order_index     INTEGER NOT NULL
);

-- ============================================================
-- TEST ATTEMPTS (one row per student per test)
-- ============================================================
CREATE TABLE test_attempts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id             UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    student_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status              VARCHAR(20) NOT NULL DEFAULT 'not_started' CHECK (status IN (
                            'not_started','in_progress','submitted','auto_submitted'
                        )),
    started_at          TIMESTAMPTZ,
    submitted_at        TIMESTAMPTZ,
    time_taken_seconds  INTEGER,
    score               NUMERIC(8,2),
    is_passed           BOOLEAN,
    tab_switch_count    INTEGER DEFAULT 0,
    fullscreen_exit_count INTEGER DEFAULT 0,
    risk_level          VARCHAR(10) DEFAULT 'low' CHECK (risk_level IN ('low','medium','high')),
    teacher_note        TEXT,                       -- private teacher observation
    expires_at          TIMESTAMPTZ,               -- calculated: started_at + duration
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(test_id, student_id)
);
CREATE INDEX idx_attempts_test ON test_attempts(test_id);
CREATE INDEX idx_attempts_student ON test_attempts(student_id);

-- ============================================================
-- STUDENT ANSWERS
-- ============================================================
CREATE TABLE student_answers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id          UUID NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
    question_id         UUID NOT NULL REFERENCES test_questions(id) ON DELETE CASCADE,
    selected_option_id  UUID REFERENCES question_options(id),  -- for MCQ
    text_answer         TEXT,                                   -- for short answer
    is_correct          BOOLEAN,
    marks_awarded       NUMERIC(6,2),
    is_marked_review    BOOLEAN DEFAULT FALSE,
    answered_at         TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(attempt_id, question_id)
);

-- ============================================================
-- BEHAVIORAL EVENT LOG (high-write, BRIN indexed)
-- ============================================================
CREATE TABLE behavioral_events (
    id              BIGSERIAL PRIMARY KEY,          -- bigserial for high-volume writes
    attempt_id      UUID NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
    event_type      VARCHAR(50) NOT NULL CHECK (event_type IN (
                        'tab_switch','fullscreen_exit','fullscreen_enter',
                        'test_started','test_submitted','answer_changed',
                        'focus_lost','focus_gained','right_click_attempt',
                        'keyboard_shortcut_blocked'
                    )),
    event_data      JSONB,                          -- additional context per event
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_behavioral_attempt ON behavioral_events(attempt_id);
CREATE INDEX idx_behavioral_created ON behavioral_events USING BRIN (created_at);

-- ============================================================
-- BULK IMPORT JOBS
-- ============================================================
CREATE TABLE bulk_import_jobs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id        UUID NOT NULL REFERENCES users(id),
    import_type     VARCHAR(20) NOT NULL CHECK (import_type IN ('students','teachers')),
    status          VARCHAR(20) NOT NULL DEFAULT 'queued' CHECK (status IN (
                        'queued','processing','completed','failed'
                    )),
    total_rows      INTEGER DEFAULT 0,
    success_rows    INTEGER DEFAULT 0,
    error_rows      INTEGER DEFAULT 0,
    error_report    JSONB,                          -- array of {row, error} objects
    celery_task_id  VARCHAR(255),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    completed_at    TIMESTAMPTZ
);

-- ============================================================
-- SYSTEM NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id    UUID REFERENCES users(id) ON DELETE CASCADE,    -- NULL = broadcast
    institution_id  UUID NOT NULL REFERENCES institutions(id),
    title           VARCHAR(255) NOT NULL,
    body            TEXT,
    notification_type VARCHAR(50) NOT NULL,
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
```

---

## Section 3 — Django REST API Specification

### 3.1 Project Structure

```
saras_backend/
├── manage.py
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── auth_module/          # login, JWT, password management
│   ├── users/                # user CRUD, bulk import
│   ├── institutions/         # departments, sections, settings
│   ├── documents/            # upload, serve, moderate
│   ├── assessments/          # tests, questions, attempts
│   └── notifications/        # system notifications
├── realtime/                 # FastAPI service (separate process)
│   ├── main.py
│   ├── routers/
│   │   ├── test_session.py
│   │   └── proctoring.py
│   └── deps.py
├── tasks/                    # Celery tasks
│   ├── celery_app.py
│   ├── bulk_import.py
│   ├── auto_submit.py
│   ├── watermark.py
│   └── notifications.py
└── requirements.txt
```

### 3.2 Authentication Endpoints

```
POST   /api/auth/login/
POST   /api/auth/logout/
POST   /api/auth/token/refresh/
POST   /api/auth/forgot-password/
POST   /api/auth/reset-password/
POST   /api/auth/change-password/           # forced change on first login
GET    /api/auth/me/                        # current user profile + force_change flag
```

**Login Response Contract:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "user": {
    "id": "uuid",
    "full_name": "string",
    "role": "student|teacher|admin",
    "department": "string",
    "force_password_change": true
  }
}
```
If `force_password_change` is `true`, frontend must redirect to `/change-password/first-login` and block all other navigation until changed.

### 3.3 User Management Endpoints

```
GET    /api/users/                          # admin only — filtered list
POST   /api/users/                          # admin only — create single user
GET    /api/users/:id/
PUT    /api/users/:id/
DELETE /api/users/:id/                      # soft delete
POST   /api/users/:id/reset-password/       # admin resets to roll number
POST   /api/users/:id/toggle-active/        # suspend/activate

POST   /api/users/bulk-upload/              # upload CSV — triggers Celery job
GET    /api/users/bulk-upload/:jobId/status/ # poll Celery job status
GET    /api/users/bulk-upload/:jobId/errors/ # download error report
```

### 3.4 Document (Resource) Endpoints

**CRITICAL SECURITY NOTE — No direct file download ever. The serve endpoint streams the PDF through the server with all protective headers applied. The frontend renders it in an embedded viewer. There is no public URL that returns a raw PDF file.**

```
GET    /api/documents/                      # browse — filtered by dept/section/subject
POST   /api/documents/                      # upload — student/teacher only
GET    /api/documents/:id/                  # metadata only — NO file data
GET    /api/documents/:id/serve/            # PROTECTED stream endpoint (see below)
GET    /api/documents/:id/watermarked/      # returns PDF with dynamic watermark injected
PUT    /api/documents/:id/                  # edit metadata — uploader only
POST   /api/documents/:id/publish/          # uploader publishes draft
POST   /api/documents/:id/unpublish/        # uploader unpublishes
DELETE /api/documents/:id/                  # soft delete — uploader or admin
POST   /api/documents/:id/flag/             # report document
GET    /api/documents/my-uploads/           # uploader's own documents

# Admin moderation
GET    /api/admin/documents/                # all documents with flag counts
POST   /api/admin/documents/:id/approve/    # clear flags
POST   /api/admin/documents/:id/remove/     # force unpublish + block
DELETE /api/admin/documents/:id/            # permanent delete
```

**Serve Endpoint Behavior (`GET /api/documents/:id/serve/`):**
```python
# This endpoint MUST:
# 1. Verify JWT token — unauthenticated = 401
# 2. Verify the user's role has access to this document's section
# 3. Log the view in document_views table (viewer name + timestamp)
# 4. Inject dynamic text watermark into PDF using PyMuPDF (fitz)
#    Watermark text: "{viewer_full_name}  |  Viewed: {datetime}"
# 5. Return the watermarked PDF with the following response headers:

response.headers["Content-Type"] = "application/pdf"
response.headers["Content-Disposition"] = "inline"        # inline, NEVER attachment
response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, private"
response.headers["Pragma"] = "no-cache"
response.headers["X-Content-Type-Options"] = "nosniff"
response.headers["X-Frame-Options"] = "SAMEORIGIN"
response.headers["Content-Security-Policy"] = (
    "default-src 'self'; "
    "object-src 'none'; "
    "script-src 'none'"
)

# The watermarked PDF is generated on-the-fly per request — never cached to disk
# Original file_data (BYTEA) is retrieved from PostgreSQL
# PyMuPDF injects the watermark, returns bytes — streamed to client
# Watermarked version is NEVER stored — only original is in DB
```

**Upload Validation (Server-Side — enforced regardless of client):**
```python
ALLOWED_MIME = ['application/pdf']
MAX_SIZE_BYTES = 2 * 1024 * 1024   # 2 MB = 2,097,152 bytes

def validate_document_upload(file):
    if file.content_type not in ALLOWED_MIME:
        raise ValidationError("Only PDF files are accepted.")
    if file.size > MAX_SIZE_BYTES:
        raise ValidationError("File exceeds the 2 MB maximum size.")
    # Read magic bytes to verify actual PDF (not just spoofed content-type)
    header = file.read(5)
    file.seek(0)
    if header != b'%PDF-':
        raise ValidationError("File is not a valid PDF document.")
```

### 3.5 Assessment Endpoints

```
# Test management
GET    /api/tests/                          # student: available tests for their section
POST   /api/tests/                          # teacher: create test
GET    /api/tests/:id/
PUT    /api/tests/:id/                      # teacher: edit (only if no attempts exist)
DELETE /api/tests/:id/
POST   /api/tests/:id/publish/
POST   /api/tests/:id/close/

# Questions
POST   /api/tests/:id/questions/
PUT    /api/tests/:id/questions/:qid/
DELETE /api/tests/:id/questions/:qid/

# Attempts — student
POST   /api/tests/:id/start/                # creates attempt, starts timer, returns questions
GET    /api/tests/:id/attempt/              # get current attempt state (resume support)
POST   /api/tests/:id/attempt/answer/       # save single answer (auto-saves)
POST   /api/tests/:id/attempt/submit/       # manual submit
GET    /api/tests/:id/result/               # student result (only if results_released)

# Submissions — teacher
GET    /api/tests/:id/submissions/          # all student attempts for this test
GET    /api/tests/:id/submissions/:studentId/ # detailed attempt + behavioral log
POST   /api/tests/:id/release-results/      # make results visible to students
GET    /api/tests/:id/submissions/export/   # CSV export of results

# Behavioral events — posted by frontend during test
POST   /api/tests/:id/attempt/event/        # log behavioral event
```

**Start Test Response Contract:**
```json
{
  "attempt_id": "uuid",
  "expires_at": "2025-04-05T14:30:00Z",
  "duration_seconds": 1800,
  "questions": [
    {
      "id": "uuid",
      "order_index": 1,
      "question_text": "string",
      "question_type": "mcq",
      "marks": 2,
      "options": [
        { "id": "uuid", "option_text": "Option A", "order_index": 1 },
        { "id": "uuid", "option_text": "Option B", "order_index": 2 }
      ]
    }
  ]
}
```
Note: `is_correct` is NEVER included in the start-test response. It is only resolved at submission time server-side.

### 3.6 Admin Endpoints

```
GET    /api/admin/stats/                    # global dashboard stats
GET    /api/admin/audit-log/               # system-wide action log

GET    /api/admin/departments/
POST   /api/admin/departments/
PUT    /api/admin/departments/:id/
DELETE /api/admin/departments/:id/

GET    /api/admin/sections/
POST   /api/admin/sections/
PUT    /api/admin/sections/:id/

GET    /api/admin/settings/
PUT    /api/admin/settings/

GET    /api/notifications/
POST   /api/notifications/                  # admin broadcast
PATCH  /api/notifications/:id/read/
```

---

## Section 4 — FastAPI Real-Time Service

### 4.1 Purpose

The FastAPI service runs as a separate process on port 8001. It handles all WebSocket connections for:
- Live test timer synchronization (prevents client-side timer manipulation)
- Real-time behavioral event streaming to teacher dashboards
- Live test submission acknowledgment

### 4.2 WebSocket Routes

```python
# Test session — student connects when test begins
WS  /ws/test/{attempt_id}/?token={jwt}

# Proctoring feed — teacher connects to see live attempt activity
WS  /ws/proctor/{test_id}/?token={jwt}
```

### 4.3 Test Session WebSocket Protocol

**Client → Server messages:**
```json
{ "type": "heartbeat" }
{ "type": "tab_switch", "data": { "timestamp": "ISO8601" } }
{ "type": "fullscreen_exit", "data": { "timestamp": "ISO8601" } }
{ "type": "focus_lost", "data": { "timestamp": "ISO8601" } }
{ "type": "answer_saved", "data": { "question_id": "uuid", "timestamp": "ISO8601" } }
```

**Server → Client messages:**
```json
{ "type": "timer_sync", "data": { "remaining_seconds": 1234, "server_time": "ISO8601" } }
{ "type": "warning", "data": { "message": "Tab switch logged.", "switch_count": 2 } }
{ "type": "force_submit", "data": { "reason": "timer_expired" } }
{ "type": "session_invalid", "data": { "reason": "attempt_not_found|test_closed|already_submitted" } }
```

**Auto-Submit Logic (Server-Side — Celery):**
```
When a test_attempt is created (student starts test):
  1. Celery schedules a task: auto_submit_attempt(attempt_id) with ETA = expires_at
  2. If student submits manually before ETA: Celery task is revoked
  3. If ETA is reached and attempt.status is still 'in_progress':
     - Celery task fires: marks attempt as 'auto_submitted'
     - FastAPI broadcasts force_submit message to the student's WebSocket
     - Score is calculated with whatever answers exist at that moment
```

### 4.4 Redis Channel Structure

```
saras:test_session:{attempt_id}         # Hash — attempt state cache
saras:test_events:{attempt_id}          # List — buffered behavioral events
saras:proctor_channel:{test_id}         # Pub/Sub channel for teacher dashboard
saras:timer:{attempt_id}                # String — remaining seconds (TTL set)
saras:rate_limit:event:{attempt_id}     # String — event rate limiter (max 50 events/min)
```

---

## Section 5 — Celery Tasks

### 5.1 Task Definitions

```python
# auto_submit.py
@celery_app.task(name='tasks.auto_submit_attempt')
def auto_submit_attempt(attempt_id: str):
    """
    Scheduled at test start time. ETA = attempt.expires_at.
    Fires if student does not submit manually.
    """

# bulk_import.py
@celery_app.task(name='tasks.process_bulk_import', bind=True)
def process_bulk_import(self, job_id: str):
    """
    Processes CSV row-by-row. Updates job progress.
    Creates user accounts. Sends first-login email per user.
    Reports errors back to bulk_import_jobs table.
    """

# watermark.py
@celery_app.task(name='tasks.generate_watermarked_pdf')
def generate_watermarked_pdf(document_id: str, viewer_id: str) -> bytes:
    """
    Called by serve endpoint for heavy PDFs.
    For small PDFs (< 500KB), watermark is generated synchronously.
    For larger PDFs, this task pre-generates and caches in Redis for 60s.
    """

# notifications.py
@celery_app.task(name='tasks.send_notification_email')
def send_notification_email(recipient_id: str, subject: str, body: str):
    """Sends institutional email via configured SMTP."""

@celery_app.task(name='tasks.broadcast_test_result_release')
def broadcast_test_result_release(test_id: str):
    """Notifies all students in section that results are available."""
```

---

## Section 6 — Privacy & Screenshot Prevention Architecture

### 6.1 Philosophy (Snapchat Web Pattern)

Snapchat Web and similar platforms use a layered approach — no single mechanism blocks screenshots, but the combination makes it extremely difficult or socially costly. SARAS uses the same philosophy.

### 6.2 Server-Side Headers (Applied to Every Document Serve Request)

```python
# Applied in Django middleware for /api/documents/*/serve/ and /api/documents/*/watermarked/
{
    "Cache-Control": "no-store, no-cache, must-revalidate, private, max-age=0",
    "Pragma": "no-cache",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Content-Security-Policy": "default-src 'self'; object-src 'none'; script-src 'none'; img-src 'none'",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), clipboard-read=(), clipboard-write=()"
}
```

### 6.3 Dynamic Per-Request Watermarking (PyMuPDF)

Every time a document is served, a new watermark is injected before streaming. The watermark contains:
- Viewer's full name
- Viewer's roll number
- Exact timestamp of this specific view
- Institution name

This means every screenshot or photo of the screen contains forensic evidence identifying who took it and when.

```python
import fitz  # PyMuPDF

def inject_watermark(pdf_bytes: bytes, viewer_name: str, viewer_id: str, timestamp: str) -> bytes:
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    watermark_text = f"{viewer_name}  |  ID: {viewer_id}  |  {timestamp}"
    
    for page in doc:
        # Diagonal semi-transparent watermark across each page
        page.insert_text(
            point=(100, page.rect.height / 2),
            text=watermark_text,
            fontsize=14,
            color=(0.8, 0.8, 0.8),    # light grey
            rotate=45,
            overlay=True
        )
        # Footer watermark — smaller, on every page
        page.insert_text(
            point=(20, page.rect.height - 20),
            text=f"SARAS Confidential — {viewer_name} — {timestamp}",
            fontsize=8,
            color=(0.6, 0.6, 0.6),
        )
    
    return doc.tobytes()
```

### 6.4 Frontend Enforcement Layer (Backend Must Enable These via API Flags)

The following must be returned in the document metadata API response so the frontend knows to enforce them:

```json
{
  "id": "uuid",
  "title": "...",
  "viewer_controls": {
    "allow_download": false,
    "allow_print": false,
    "allow_text_select": false,
    "allow_right_click": false,
    "embed_mode": "iframe_sandbox",
    "sandbox_policy": "allow-scripts allow-same-origin"
  }
}
```

The PDF viewer iframe must be rendered with:
```html
<iframe
  src="/api/documents/{id}/serve/?token={jwt}"
  sandbox="allow-scripts allow-same-origin"
  allow="fullscreen"
  style="pointer-events: auto; user-select: none;"
>
```

### 6.5 Overlay Div Pattern (Anti-Screenshot Layer)

Backend provides a flag that tells the frontend to render a transparent CSS overlay on top of the PDF iframe. This overlay intercepts right-click, drag, and selection events. While it cannot block OS-level screenshots, it prevents:
- Right-click → Save Image
- Drag-to-desktop of iframe content
- Browser print-to-PDF via Ctrl+P (intercepted by JS)
- DevTools network panel download (file is streamed, not a static URL — token expires after 5 min)

### 6.6 Signed Expiring Serve URLs

Document serve URLs are not permanent. The token embedded in the serve URL is a short-lived signed token (5 minutes TTL) generated server-side. Even if someone copies the URL, it expires before they can share it meaningfully.

```python
# On document view request, generate a short-lived serve token
import jwt, datetime

def generate_serve_token(user_id: str, document_id: str) -> str:
    payload = {
        "sub": user_id,
        "doc": document_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=5),
        "type": "serve"
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
```

---

## Section 7 — Key Middleware Requirements

### 7.1 Django Middleware Stack (in order)

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'apps.auth_module.middleware.JWTAuthMiddleware',
    'apps.auth_module.middleware.RoleEnforcementMiddleware',    # block wrong-role access at middleware level
    'apps.documents.middleware.DocumentServeSecurityMiddleware', # injects privacy headers on serve routes
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'apps.auth_module.middleware.ForcePasswordChangeMiddleware', # redirects if flag is true
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

### 7.2 Rate Limiting

Applied via Redis on these critical endpoints:
- `POST /api/auth/login/` — 5 attempts per IP per minute
- `POST /api/tests/:id/attempt/event/` — 50 events per attempt per minute
- `GET /api/documents/:id/serve/` — 10 requests per user per minute

---

## Section 8 — Environment Configuration Reference

All environment variables are defined in `.env`. Never commit `.env` to version control.

```env
# Django
DJANGO_SECRET_KEY=
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=

# Database
DB_NAME=saras_db
DB_USER=saras_user
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2

# FastAPI (Real-Time Service)
FASTAPI_HOST=0.0.0.0
FASTAPI_PORT=8001
FASTAPI_SECRET_KEY=        # Same as DJANGO_SECRET_KEY for JWT validation

# JWT
JWT_ACCESS_TOKEN_EXPIRY_MINUTES=60
JWT_REFRESH_TOKEN_EXPIRY_DAYS=7
SERVE_TOKEN_EXPIRY_MINUTES=5

# File Storage
MAX_UPLOAD_SIZE_BYTES=2097152

# Celery
CELERY_WORKER_CONCURRENCY=4
CELERY_TASK_SERIALIZER=json
```

---

## Section 9 — Development Startup Sequence

```bash
# 1. PostgreSQL — must be running first
pg_ctl start

# 2. Redis
redis-server

# 3. Django migrations
python manage.py migrate

# 4. Django development server (port 8000)
python manage.py runserver 0.0.0.0:8000

# 5. FastAPI real-time service (port 8001) — separate terminal
uvicorn realtime.main:app --host 0.0.0.0 --port 8001 --reload

# 6. Celery worker — separate terminal
celery -A tasks.celery_app worker --loglevel=info --concurrency=4

# 7. Celery beat scheduler (for periodic tasks) — separate terminal
celery -A tasks.celery_app beat --loglevel=info
```

---

## Section 10 — Security Checklist Before Production

- [ ] `DJANGO_DEBUG=False` in production
- [ ] All secrets in environment variables — zero hardcoded secrets in code
- [ ] PostgreSQL user has minimum required permissions — no superuser in app connection
- [ ] Redis password set and AUTH configured
- [ ] SSL/TLS on all HTTP and WebSocket connections (Nginx handles termination)
- [ ] JWT secret key is minimum 64 characters, randomly generated
- [ ] SMTP password stored encrypted in institution settings table
- [ ] `force_password_change` flag cannot be bypassed — enforced at middleware level
- [ ] Document serve endpoint validates serve token AND user role on every request
- [ ] Behavioral event endpoint validates that attempt belongs to the requesting student
- [ ] Auto-submit Celery task cannot be triggered by any client API call
- [ ] File upload: magic bytes checked server-side regardless of Content-Type header
- [ ] File size enforced both in DRF serializer AND database constraint
- [ ] No raw SQL with user-supplied input — all queries via Django ORM parameterization
- [ ] Admin endpoints require `role == 'admin'` check at view level, not just middleware

---

*Report Version: 1.0*
*Prepared For: SARAS Backend Development Team*
*Classification: Internal Technical Handover — Confidential*
