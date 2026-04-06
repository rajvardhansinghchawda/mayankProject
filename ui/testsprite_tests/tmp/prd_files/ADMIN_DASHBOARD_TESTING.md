# Admin Panel Frontend Testing Guide: SARAS Hub

This document defines the comprehensive testing strategy for the **SARAS Hub Admin Panel**. It covers functional verification, security (RBAC), and UI/UX standards for all administrative modules.

---

## 1. Test Environment & Scope
*   **Target URL**: `http://localhost:5173/admin/dashboard` (Local Dev)
*   **Primary Browser**: Google Chrome (Latest)
*   **Prerequisites**: 
    1.  Valid Administrator Account.
    2.  Active backend services (Django + PostgreSQL).
    3.  Sample CSV data for bulk upload testing.

---

## 2. Authentication & Security (RBAC)

| Test ID | Scenario | Expected Result | Priority |
| :--- | :--- | :--- | :--- |
| **SEC-01** | Direct Admin Login | Redirects to `/admin/dashboard` with admin-specific sidebar items. | Critical |
| **SEC-02** | Student path access | Accessing `/admin/*` as a Student redirects to `/system/403`. | Critical |
| **SEC-03** | Faculty path access | Accessing restricted admin paths (Settings) as Faculty redirects to `/system/403`. | High |
| **SEC-04** | Session Timeout | Inactivity for 30 minutes triggers redirection to `/system/expired`. | Medium |

---

## 3. Module-Specific Test Cases

### 3.1 Admin Dashboard (`/admin/dashboard`)
*   **DB-01: Global Trend Chart**: Verify the chart renders and reflects data accurately from the `/api/admin/stats` endpoint.
*   **DB-02: Audit Stream**: Ensure latest 10 activities are listed with timestamp and user ID.
*   **DB-03: System Lock**: Toggling "System Lock" modal triggers a confirmation and successfully puts the system into restricted mode.
*   **DB-04: Master Sync**: Clicking "Master Sync" shows a progress loader and success notification upon completion.

### 3.2 User Management (`/admin/users`)
*   **USR-01: Manual Addition**:
    1.  Navigate to `/admin/users/add`.
    2.  Fill form (Name, Email, Role, Dept).
    3.  Confirm successful creation and appearance in "Master Table".
*   **USR-02: Bulk CSV Upload**:
    1.  Navigate to `/admin/users/bulk-upload`.
    2.  Upload a CSV with 50+ users.
    3.  Verify validation report: Shows correct count of successful vs. failed entries.
*   **USR-03: Role Modification**: Change a user from 'Student' to 'Faculty' and verify immediate update in the UI.

### 3.3 Department Management (`/admin/departments`)
*   **DEPT-01: Card Rendering**: Every department should show its headcount (Faculties/Students).
*   **DEPT-02: Create Dept**: Form validation for unique department names and codes.
*   **DEPT-03: Hierarchy Edit**: Drag-and-drop or parent-selection for nested departments (if implemented).

### 3.4 Test & Submission Management
*   **TEST-01: Wizard Flow**: 
    1.  Start `/admin/create-test`.
    2.  Step 1: Details (Title, Description).
    3.  Step 2: Questions (Add/Edit).
    4.  Step 3: Schedule (Date/Duration).
    5.  Finish and verify test appears in `/admin/tests`.
*   **SUB-01: Attempt Detail**: 
    1.  View results in `/admin/submissions`.
    2.  Select a student attempt.
    3.  Verify question-level analysis and proctoring flags are visible.

### 3.5 System Settings (`/settings`)
*   **SET-01: Branding Update**: 
    1.  Change "University Name".
    2.  Update "Primary Color" via picker.
    3.  Verify global changes (Logo title and button colors) after save.
*   **SET-02: Security Policy**: 
    1.  Toggle "Require 2FA".
    2.  Update "Max Login Attempts".
    3.  Confirm settings persist after page refresh.

---

## 4. UI/UX & Performance Verification

### 4.1 Responsive Design
- [ ] **Desktop (1920x1080)**: Sidebar expanded, full grid view.
- [ ] **Laptop (1440x900)**: Proper scaling of dashboard charts.
- [ ] **Tablet (768x1024)**: Sidebar collapsed by default, menu burger visible.
- [ ] **Mobile (375x812)**: Single column layout for cards and tables.

### 4.2 Error Handling
- [ ] **API 500**: Visual toast notification "Internal Server Error".
- [ ] **API 404**: "Resource Not Found" placeholder for empty tables.
- [ ] **Network Loss**: Sticky "Connection Lost" banner at the top.

### 4.3 Performance (Lighthouse)
- [ ] **LCP (Largest Contentful Paint)**: < 2.5s
- [ ] **FID (First Input Delay)**: < 100ms
- [ ] **CLS (Cumulative Layout Shift)**: < 0.1

---

## 5. Success Criteria
1.  All **Critical** and **High** priority test cases pass.
2.  Administrative actions (User Create, System Lock) reflect in the backend within 200ms.
3.  Bulk uploads of 500+ records do not cause the browser to freeze or crash.
