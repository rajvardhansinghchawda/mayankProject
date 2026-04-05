# SARAS Hub: UI Structure & Technical Documentation

This document provides a comprehensive, screen-by-screen breakdown of the **SARAS Hub** (Secure Academic Record & Assessment System). It details every visible component, user action, and functional element identified in the UI.

---

## 1. 🧾 Overall System Overview
*   **System Name**: SARAS Hub (Institutional Management Engine)
*   **Core Purpose**: A secure, audit-ready platform for academic administration, study resource management, and digital assessment execution.
*   **Target Roles**: Students (Candidates), Faculty (Teachers), and Institutional Administrators.

---

## 2. 📱 Screen-by-Screen Detailed Breakdown

### **2.1 Portal Entry & Authentication**

#### **Login Screen (`/`)**
*   **Purpose**: Secure entry and role-based routing.
*   **Components**:
    *   **Brand Identity Group**: "Mayank College" logo (account_balance icon) and system subtitle.
    *   **Role Selection Dropdown**: Options for Student, Faculty, and Administrator.
    *   **Credential Inputs**: Email/Roll Number field and Password field with security icons.
    *   **Action Button**: "Login to Dashboard" (gradient-styled CTA).
    *   **Trust Labels**: ISO 27001 and Encrypted badges.
*   **Actions**: Authenticate, navigate to password recovery.

#### **Forgot Password (`/forgot-password`)**
*   **Purpose**: Account recovery via institutional email.
*   **Components**: Input for registered email, "Send Reset Link" button.

---

### **2.2 Student Portal**

#### **Dashboard (`/dashboard`)**
*   **Purpose**: Daily academic summary.
*   **Components**:
    *   **Welcome Banner**: Personalized message and system status.
    *   **Quick Actions**: Large touch-friendly buttons (Start Test, Results, Help).
    *   **Active Tests List**: Cards showing ongoing or immediate assessments.
    *   **System Alerts**: Notifications regarding university announcements.
*   **Actions**: Quick navigation to active modules.

#### **Profile (`/profile`)**
*   **Purpose**: Personal and academic identity management.
*   **Components**:
    *   **Identity Card**: Photo, ID, Department, and Batch details.
    *   **Academic details**: CGPA, Attendance, and Course enrollment stats.
    *   **Security Settings**: Password change and Two-factor authentication toggles.
    *   **Activity Trace**: Timeline of recent logins and actions.
*   **Actions**: Update profile photo, change password, view login history.

#### **Tests List (`/tests`)**
*   **Purpose**: Browsing and scheduling assessments.
*   **Components**:
    *   **Search/Filters**: Filter by Subject, Difficulty, or Type.
    *   **Test Grid**: Cards with "Duration", "Total Questions", and "Action" buttons.
    *   **Conduct Guidelines**: Banner explaining AI Proctoring and Exam Integrity protocols.
*   **Actions**: Filter tests, view test guidelines, initiate "Pre-Test Instructions".

#### **Resources Library (`/resources`)**
*   **Purpose**: Accessing study materials.
*   **Components**:
    *   **Search Bar**: Omni-search for lecture notes and research papers.
    *   **Category Pills**: Engineering, Medical, Arts, etc.
    *   **Material Grid**: Cards with "Type" (PDF/DOC) and "Download" buttons.
    *   **Request Card**: "Request Subject Access" form.
*   **Actions**: Search materials, download resources, request new material.

#### **My Uploads (`/uploads`)**
*   **Purpose**: Management of personal academic submissions.
*   **Components**:
    *   **Upload Stats**: "Total Files", "Approved", "Storage Used".
    *   **Submission List**: Table/List showing "File Name", "Status" (Pending/Approved), "Date".
    *   **Policy Banner**: Virus scan and 25MB limit warnings.
*   **Actions**: Upload new files, delete/preview previous submissions.

---

### **2.3 Teacher Portal**

#### **Teacher Hub (`/teacher/dashboard`)**
*   **Purpose**: Faculty mission control.
*   **Components**:
    *   **Institutional Stats Counter**: "Active Batches", "Tests Scheduled", "Submissions Today".
    *   **Quick Assessment Creator**: Button to launch test creation wizard.
    *   **Faculty Module List**: Grid of assigned courses.
*   **Actions**: Monitor batch performance, manage test schedules.

#### **Course Content (`/teacher/resources`)**
*   **Purpose**: Managing material for students.
*   **Components**: Resource management table, "Upload for Batch" button.

---

### **2.4 Administration Portal**

#### **Admin Dashboard (`/admin/dashboard`)**
*   **Purpose**: Global institutional state monitoring.
*   **Components**:
    *   **Global Trend Chart**: Analytics for the entire university.
    *   **Audit Stream**: Longitudinal log of admin activities.
    *   **Emergency Dashboard**: "System Lock" and "Master Sync" controls.
*   **Actions**: Trigger global test lockout, view system-wide audits.

#### **User Control (`/admin/users`)**
*   **Purpose**: Master user database management.
*   **Components**:
    *   **Management Actions**: "Add User" (Manual) and "Bulk Upload" (CSV/XLS).
    *   **Master Table**: Multi-column table with "Biometric Status", "Role", and "Dept".
*   **Actions**: Change roles, suspend users, execute bulk imports.

#### **Department Management (`/admin/departments`)**
*   **Purpose**: Hierarchy and organizational setup.
*   **Components**: Grid of departmental cards with count of faculties and students.
*   **Actions**: Create new department, edit hierarchy.

#### **System Settings (`/settings`)**
*   **Purpose**: Technical configuration.
*   **Components**:
    *   **Tabs**: General (Branding), SMTP (Email Server), LDAP (Identity), Security Policy.
    *   **Branding Card**: Input for University Name and Color Accent selector.
*   **Actions**: Commit system configuration, restart services (implied).

---

### **2.5 Assessment Hub Flow**

#### **Pre-Test Instructions (`/assessments/instructions`)**
*   **Purpose**: Required reading and hardware check.
*   **Components**: List of rules, technical check checklist, "Start Test" button.

#### **Active Test environment (`/assessments/active`)**
*   **Purpose**: Locked-down testing UI.
*   **Components**:
    *   **Question Palette**: 45-question grid with status colors.
    *   **Proctoring Banner**: Ticker indicating AI Eye-Tracking and Browser Lock.
    *   **Interactive Panel**: Question text with A/B/C/D selectable options.
    *   **Control Footer**: Prev/Next, Mark for Review, and Submit.
*   **Actions**: Select answers, navigate between questions, final submission.

---

## 3. 🧩 Identified High-Level Features
*   **Multi-Role Access Control**: Dynamic Sidebar/UI based on `userRole`.
*   **Integrated Assessment Engine**: End-to-end flow from instruction to submission.
*   **AI-Enhanced Proctoring**: UI-level monitoring indicators for integrity.
*   **Institutional Analytics**: Real-time stats and visual charts (Admin/Teacher).
*   **Bulk Provisioning**: Wizard-based bulk user and data upload.
*   **Resource Moderation**: Student-to-University document contribution pipeline.

---

## 4. 📂 Data Entities (UI Representation)
*   **Identity**: User profiles, Roles, Biometric status.
*   **Academic**: CGPA, Marks, Attendance, Batches.
*   **Assessment**: Questions, Answers, Timers, Submission IDs.
*   **Files**: Research papers, Lecture notes, Student uploads (PDF/DOC).

---

## 5. 👥 Roles Configuration
*   **Administrator**: Full "Super Profile", global stats, user/dept control.
*   **Teacher**: Module-specific control, submission evaluation, content upload.
*   **Student**: Consumer role, test participant, resource uploader.
