# SARAS — Credentials & Access Reference
## Smart Academic Resource and Secure Assessment System
### ⚠️ CONFIDENTIAL — DO NOT COMMIT TO VERSION CONTROL ⚠️

---

> This file documents all system credentials, default access values, service ports, and
> account seeding data for the SARAS platform. This file is for development and internal
> team reference only. All production secrets must be rotated before going live.
> Store production secrets in a secrets manager (e.g., HashiCorp Vault, AWS Secrets Manager).

---

## Section 1 — Default Seeded Accounts

These accounts are created by the database seed script (`python manage.py seed_defaults`).
All default passwords must be changed on first login — the system enforces this.

### Super Administrator

| Field | Value |
|---|---|
| **Role** | Administrator |
| **Full Name** | System Administrator |
| **Email** | `admin@saras.local` |
| **Password** | `SarasAdmin@2025` |
| **Force Change on Login** | YES |
| **Employee ID** | `ADMIN-001` |
| **Note** | This is the master admin. First action after first login should be creating the institution and departments. |

### Demo Teacher Account

| Field | Value |
|---|---|
| **Role** | Teacher |
| **Full Name** | Demo Faculty |
| **Email** | `teacher@saras.local` |
| **Password** | `Faculty@2025` |
| **Force Change on Login** | YES |
| **Employee ID** | `FAC-001` |
| **Department** | Computer Science (seeded) |

### Demo Student Account

| Field | Value |
|---|---|
| **Role** | Student |
| **Full Name** | Demo Student |
| **Email** | `student@saras.local` |
| **Roll Number** | `CS2024001` |
| **Enrollment Number** | `ENR2024001` |
| **Password** | `CS2024001` (roll number — default pattern) |
| **Force Change on Login** | YES |
| **Department** | Computer Science (seeded) |
| **Section** | A |
| **Semester** | 3 |

---

## Section 2 — Default Password Policy

| Rule | Value |
|---|---|
| **Student Default Password** | Equal to Roll Number (e.g., `CS2024001`) |
| **Teacher Default Password** | Equal to Employee ID |
| **Admin Default Password** | Set manually by deployer — no automatic default |
| **Minimum Password Length** | 8 characters |
| **Password Requirements** | At least 1 uppercase, 1 lowercase, 1 number |
| **Force Change on First Login** | YES — cannot be bypassed |
| **Password Reset** | Admin-triggered OR email link (if SMTP configured) |

---

## Section 3 — Local Development Services

### Django REST API

| Field | Value |
|---|---|
| **URL** | `http://localhost:8000` |
| **Admin Panel** | `http://localhost:8000/django-admin/` |
| **API Base** | `http://localhost:8000/api/` |
| **Django Admin User** | `admin` |
| **Django Admin Password** | `localdevpassword` |

### FastAPI Real-Time Service

| Field | Value |
|---|---|
| **URL** | `http://localhost:8001` |
| **WebSocket Base** | `ws://localhost:8001/ws/` |
| **API Docs (Swagger)** | `http://localhost:8001/docs` |
| **ReDoc** | `http://localhost:8001/redoc` |

### PostgreSQL Database

| Field | Value |
|---|---|
| **Host** | `localhost` |
| **Port** | `5432` |
| **Database Name** | `saras_db` |
| **App User** | `saras_user` |
| **App Password** | `saras_dev_password` |
| **Superuser** | `postgres` |
| **Superuser Password** | `postgres` (local dev only) |
| **Connection String** | `postgresql://saras_user:saras_dev_password@localhost:5432/saras_db` |

### Redis

| Field | Value |
|---|---|
| **Host** | `localhost` |
| **Port** | `6379` |
| **Password** | None (local dev) |
| **DB 0** | Django cache + session store |
| **DB 1** | Celery task broker |
| **DB 2** | Celery result backend |
| **DB 3** | WebSocket pub/sub channels |
| **CLI Access** | `redis-cli -h localhost -p 6379` |

### Celery

| Field | Value |
|---|---|
| **Broker** | `redis://localhost:6379/1` |
| **Result Backend** | `redis://localhost:6379/2` |
| **Flower Monitor URL** | `http://localhost:5555` |
| **Flower User** | `admin` |
| **Flower Password** | `floweradmin` |

### Nginx (Production)

| Field | Value |
|---|---|
| **HTTP Port** | 80 (redirects to 443) |
| **HTTPS Port** | 443 |
| **Upstream Django** | `http://127.0.0.1:8000` |
| **Upstream FastAPI** | `http://127.0.0.1:8001` |
| **Config Location** | `/etc/nginx/sites-available/saras` |
| **SSL Cert Location** | `/etc/ssl/saras/cert.pem` |
| **SSL Key Location** | `/etc/ssl/saras/key.pem` |

---

## Section 4 — JWT & Token Configuration

| Field | Value |
|---|---|
| **Algorithm** | HS256 |
| **Access Token Expiry** | 60 minutes |
| **Refresh Token Expiry** | 7 days |
| **Document Serve Token Expiry** | 5 minutes |
| **Secret Key (dev)** | `dev-secret-key-change-in-production-min-64-chars-random` |
| **Header Format** | `Authorization: Bearer <token>` |

---

## Section 5 — File Upload Constraints

| Constraint | Value |
|---|---|
| **Accepted MIME Type** | `application/pdf` only |
| **Magic Bytes Validation** | `%PDF-` (first 5 bytes checked server-side) |
| **Maximum File Size** | 2 MB (2,097,152 bytes) |
| **Storage Location** | PostgreSQL `BYTEA` column — no filesystem storage |
| **Serve Token Required** | Yes — 5-minute expiring signed token |
| **Download Headers** | `Content-Disposition: inline` — never `attachment` |

---

## Section 6 — Email / SMTP Configuration (Development)

For local development, use Mailtrap or Django's console email backend.

**Option A — Console Backend (prints emails to terminal):**
```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

**Option B — Mailtrap (catches all outgoing mail):**

| Field | Value |
|---|---|
| **Host** | `sandbox.smtp.mailtrap.io` |
| **Port** | `2525` |
| **Username** | *(Create free Mailtrap account — get from dashboard)* |
| **Password** | *(From Mailtrap dashboard)* |
| **Use TLS** | True |

**Production SMTP:** Configure in Admin → System Settings → SMTP tab. Stored encrypted in `institutions` table.

---

## Section 7 — Environment File Template

Copy this to `.env` in the project root and fill in values:

```env
# ============================================================
# DJANGO
# ============================================================
DJANGO_SECRET_KEY=CHANGE-THIS-TO-A-64-CHAR-RANDOM-STRING
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# ============================================================
# POSTGRESQL
# ============================================================
DB_NAME=saras_db
DB_USER=saras_user
DB_PASSWORD=saras_dev_password
DB_HOST=localhost
DB_PORT=5432

# ============================================================
# REDIS
# ============================================================
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2
WEBSOCKET_CHANNEL_DB=redis://localhost:6379/3

# ============================================================
# FASTAPI REAL-TIME SERVICE
# ============================================================
FASTAPI_HOST=0.0.0.0
FASTAPI_PORT=8001
FASTAPI_SECRET_KEY=SAME-AS-DJANGO-SECRET-KEY

# ============================================================
# JWT
# ============================================================
JWT_ACCESS_TOKEN_EXPIRY_MINUTES=60
JWT_REFRESH_TOKEN_EXPIRY_DAYS=7
SERVE_TOKEN_EXPIRY_MINUTES=5

# ============================================================
# FILE CONSTRAINTS
# ============================================================
MAX_UPLOAD_SIZE_BYTES=2097152

# ============================================================
# CELERY
# ============================================================
CELERY_WORKER_CONCURRENCY=4
CELERY_TASK_TIME_LIMIT=300
FLOWER_USER=admin
FLOWER_PASSWORD=floweradmin

# ============================================================
# EMAIL (development — use console backend)
# ============================================================
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@saras.local
```

---

## Section 8 — Database Setup Commands

```bash
# Create database and user (run as postgres superuser)
psql -U postgres -c "CREATE DATABASE saras_db;"
psql -U postgres -c "CREATE USER saras_user WITH PASSWORD 'saras_dev_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE saras_db TO saras_user;"
psql -U postgres -c "ALTER DATABASE saras_db OWNER TO saras_user;"

# Run Django migrations
python manage.py migrate

# Seed default institution, departments, and demo accounts
python manage.py seed_defaults

# Create Django superuser (for /django-admin/ panel access)
python manage.py createsuperuser
# Username: admin
# Email: admin@saras.local
# Password: localdevpassword
```

---

## Section 9 — Bulk CSV Upload Format

### Student CSV Template

```csv
full_name,email,roll_number,enrollment_number,department_code,section_name,semester,academic_year
Aarav Sharma,aarav@example.com,CS2024001,ENR2024001,CSE,A,3,2024-2025
Priya Patel,priya@example.com,CS2024002,ENR2024002,CSE,A,3,2024-2025
```

### Teacher CSV Template

```csv
full_name,email,employee_id,department_code,designation
Dr. Ramesh Kumar,ramesh@example.com,FAC-101,CSE,Associate Professor
Ms. Sunita Verma,sunita@example.com,FAC-102,ECE,Assistant Professor
```

**Rules:**
- All fields required except `email` (students can be created without email)
- `department_code` must match an existing department in the system
- `section_name` must match an existing section in the specified department
- Duplicate `roll_number` or `enrollment_number` within the same institution will be skipped with an error
- Maximum 1000 rows per upload. Larger imports should be split.

---

## Section 10 — Security Notes for Production Deployment

```
⚠️  BEFORE GOING LIVE — MANDATORY ACTIONS:

1. Rotate ALL passwords in this document
2. Generate a new 64-character random DJANGO_SECRET_KEY
3. Set DJANGO_DEBUG=False
4. Configure proper ALLOWED_HOSTS (no wildcards)
5. Set Redis password: requirepass <strong-password>
6. Set PostgreSQL to only accept connections from application server IP
7. Issue proper SSL certificate (not self-signed)
8. Remove Flower from public access OR put behind HTTP basic auth
9. Disable Django admin panel (/django-admin/) or restrict to internal IP only
10. Set up automated PostgreSQL backups — database contains all PDF files
```

---

*Document Version: 1.0*
*Classification: CONFIDENTIAL — INTERNAL DEVELOPMENT USE ONLY*
*Do not commit this file to any version control system*
*Add credentials.md to .gitignore immediately*
