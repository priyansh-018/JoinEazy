# 🎓 JoinEazy — Collaborative Assignment Submission & Academic Management Platform

[![Live Platform](https://img.shields.io/badge/Live%20Platform-Render-brightgreen?style=for-the-badge&logo=render)](https://joineazy-q36y.onrender.com)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Tailwind%20CSS-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-Neon%20Serverless%20PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://neon.tech/)

A production-ready academic collaboration platform that bridges the gap between cloud storage submission folders (Microsoft OneDrive) and university coursework management. **JoinEazy** enables students to form project teams, manage peer memberships, and execute two-step verified coursework submissions with automatic team-wide synchronization — while giving professors real-time cohort analytics, course-wise tracking, and granular submission rosters.

🌐 **Live Production URL:** [https://joineazy-q36y.onrender.com](https://joineazy-q36y.onrender.com)

---

## 📌 Table of Contents
1. [Platform Overview & Mission](#-platform-overview--mission)
2. [UI/UX Design Philosophy & Architecture](#-uiux-design-philosophy--architecture)
3. [Key Platform Features](#-key-platform-features)
   - [Student Experience](#-student-experience)
   - [Professor & Admin Experience](#-professor--admin-experience)
   - [Submission Protocol & Verification](#-submission-protocol--verification)
4. [Component & System Architecture](#-component--system-architecture)
5. [Database Schema & Data Model](#-database-schema--data-model)
6. [API Endpoints Reference](#-api-endpoints-reference)
7. [Local Setup & Installation](#-local-setup--installation)
8. [Production Deployment Details](#-production-deployment-details)

---

## 🎯 Platform Overview & Mission

In university coursework, collaborative assignments typically require students to upload artifacts to external institutional drives (e.g., Microsoft OneDrive). However, traditional Learning Management Systems (LMS) create significant friction:
- **No visibility into individual student contributions** when one student uploads a team archive.
- **Accidental or premature submissions** by team members before work is complete.
- **Lack of clear course-level organization** when professors manage multiple subjects simultaneously.

**JoinEazy** solves these challenges through:
1. **Subject-Based Course & Group Isolation**: Students join specific courses via unique codes and form collaborative teams within each course context.
2. **Two-Step Verification Protocol**: Submissions require explicit file upload affirmation followed by final confirmation to prevent accidental submissions.
3. **Leader Acknowledgment Synchronization**: For group assignments, only the designated Team Leader has authority to acknowledge submission, immediately synchronizing confirmation across all teammates' records.
4. **Independent Tracking for Individual Tasks**: For individual coursework, each student submits and confirms their work independently.
5. **Real-time Professor Analytics**: Live enrollment tracking, group progress monitoring, and granular student-wise verification rosters with dynamic status filtering.

---

## 🎨 UI/UX Design Philosophy & Architecture

JoinEazy utilizes a modern **Neo-Brutalist & Editorial Design System** built with **Tailwind CSS** and **Lucide Icons**:

### Design Choices & Rationales:
* **High Contrast & Visual Hierarchy (`#FAF7F2` warm canvas, `#1c1917` deep ink, `#E11D48` accent rose)**:
  - Eliminates visual fatigue common in standard corporate LMS portals while emphasizing critical action items (deadlines, submit buttons, verification alerts).
* **Responsive Card Grids (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)**:
  - The Student Dashboard displays enrolled academic courses in adaptive card grids. Each card is interactive and directly routes to filtered coursework.
* **Contextual Badge System**:
  - Immediately signals coursework parameters (`[👥 Group Submission]` vs. `[👤 Individual Submission]`), submission state (`Awaiting Submission`, `Submitted`, `Verified by Professor`), and team roles (`👑 Leader` vs. `Member`).
* **Visual Progress Feedback**:
  - Cohort-wide and group-level completion progress meters with dynamic color transitions (`emerald` for complete, `indigo` for intermediate, `amber` for pending).
* **Defensive Modal UX (Leader Guarding)**:
  - When non-leaders open the two-step verification modal on group assignments, the UI presents an informative warning banner (`LEADER MUST SUBMIT`) and safely disables the submit action, eliminating confusion.

---

## ⚡ Key Platform Features

### 👨‍🎓 Student Experience
* **Course Enrollment**: Join academic subjects via unique 8-character course codes (e.g., `CRS-401-LAB`).
* **Enrolled Courses Grid**: Responsive dashboard displaying active courses with direct links to assignments.
* **Team & Group Formation**:
  - Create project groups under specific enrolled courses (creator is automatically assigned the **Group Leader** role).
  - Alphanumeric Group Join Codes (e.g., `GRP-ALPHA`) for effortless teammate onboarding.
  - In-app peer invites via email or student ID.
* **Coursework Dashboard**:
  - Filter assignments dynamically by course with one-click filter resets.
  - Direct links to institutional OneDrive folders.
* **Two-Step Submission Verification**:
  - Step 1: Affirmative check: *"Yes, I confirm files have been uploaded to OneDrive."*
  - Step 2: Final confirmation and timestamped submission logging.
  - Visual status badges and achievement milestones.

### 👨‍🏫 Professor & Admin Experience
* **Course Management**: Create courses, generate join codes, and inspect enrolled student rosters.
* **Assignment Authoring**:
  - Post coursework with title, description, due date/time, and OneDrive submission folder URL.
  - Select submission type: **`Group Submission`** vs. **`Individual Submission`**.
  - Target assignments to **All Student Groups** or restrict to **Specific Groups**.
* **Cohort & Subject Analytics**:
  - Track total enrolled students, formed groups, and received submissions per course.
  - Cohort-wide submission completion rate with progress meters.
  - Real-time recent submission feed.
* **Granular Submission Rosters**:
  - Drill down into any assignment to see group-wise and student-wise breakdowns.
  - Inspect Step 1 verification, Step 2 confirmation, and exact timestamps for every individual student.
  - **Status Filtering**: Filter submission rosters instantly by `All`, `Submitted`, `Verified`, or `Pending`.
  - Verification action: Mark submissions as `Verified by Professor`.

### 🔐 Submission Protocol & Verification

```
+-----------------------------------------------------------------------------------+
|                           SUBMISSION HANDLING LOGIC                               |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [GROUP SUBMISSION]                                                               |
|  - Non-leader opens modal  --> Displays "LEADER MUST SUBMIT" banner (Action disabled)|
|  - Leader submits          --> Step 1 & Step 2 recorded in `submissions`          |
|                                --> Batch confirms ALL active teammates in        |
|                                    `student_confirmations`                        |
|                                --> Teammates immediately see "Submission Confirmed"|
|                                --> Professor roster shows 100% team confirmation  |
|                                                                                   |
|  [INDIVIDUAL SUBMISSION]                                                          |
|  - Any student submits     --> Records submission for that specific student only  |
|                                --> Teammates remain "Pending Submission"          |
|                                --> Professor roster tracks each student separately|
+-----------------------------------------------------------------------------------+
```

---

## 🏛 Component & System Architecture

The application adopts a decoupled full-stack architecture with strict separation of concerns:

```
+------------------------------------------------------------------------------------+
|                                CLIENT LAYER (React 18)                             |
|  +--------------------+   +-----------------------+   +-------------------------+  |
|  |  Student Dashboard |   |    Assignments Page   |   |   TwoStepConfirmModal   |  |
|  | (Enrolled Grid)    |   | (Course Filtering)    |   | (Leader Guard / Steps)  |  |
|  +--------------------+   +-----------------------+   +-------------------------+  |
|  +--------------------+   +-----------------------+   +-------------------------+  |
|  |  Professor Portal  |   |    Analytics Dashboard|   |  Submissions Roster     |  |
|  | (Course Setup)     |   | (Enrolled Analytics)  |   | (Status Filtering)      |  |
|  +--------------------+   +-----------------------+   +-------------------------+  |
|                                      |                                             |
|                              AuthContext (JWT)                                     |
+--------------------------------------|---------------------------------------------+
                                       | HTTPS / REST JSON
+--------------------------------------v---------------------------------------------+
|                            BACKEND API LAYER (Node.js & Express)                   |
|  +-------------------------------------------------------------------------------+ |
|  |                              authMiddleware                                   | |
|  |                       (JWT Verification & Role Guard)                         | |
|  +-------------------------------------------------------------------------------+ |
|  +------------------+  +------------------+  +------------------+  +-------------+ |
|  | authController   |  | courseController |  | groupController  |  | ...         | |
|  +------------------+  +------------------+  +------------------+  +-------------+ |
|  +-------------------------+  +-------------------------+  +---------------------+ |
|  | assignmentController    |  | submissionController    |  | analyticsController | |
|  +-------------------------+  +-------------------------+  +---------------------+ |
+--------------------------------------|---------------------------------------------+
                                       | Parameterized Queries (Pool)
+--------------------------------------v---------------------------------------------+
|                     DATA LAYER (Neon Serverless PostgreSQL)                        |
|   courses  <--  groups  <--  group_members  <--  users                             |
|   courses  <--  assignments  <--  submissions  <--  student_confirmations         |
+------------------------------------------------------------------------------------+
```

---

## 🗄 Database Schema & Data Model

The PostgreSQL schema enforces strong referential integrity, foreign key cascading, and role constraints:

### 1. `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Unique user identifier |
| `name` | VARCHAR(120) | NOT NULL | User full name |
| `email` | VARCHAR(180) | UNIQUE, NOT NULL | Institutional or personal email |
| `student_id`| VARCHAR(50) | UNIQUE | University registration number (students) |
| `password_hash`| VARCHAR(255)| NOT NULL | Bcrypt hashed credentials |
| `role` | VARCHAR(20) | CHECK ('student', 'admin') | Role for access control |
| `created_at`| TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Registration date |

### 2. `courses`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Unique course identifier |
| `name` | VARCHAR(150) | NOT NULL | Course title (e.g., Cloud Computing) |
| `course_code`| VARCHAR(50) | NOT NULL | Course code (e.g., CS401) |
| `join_code` | VARCHAR(30) | UNIQUE, NOT NULL | Alphanumeric invite code for students |
| `professor_id`| INTEGER | REFERENCES users(id) ON DELETE CASCADE | Instructor owner |

### 3. `groups`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Unique group identifier |
| `name` | VARCHAR(150) | NOT NULL | Team name |
| `course_id` | INTEGER | REFERENCES courses(id) ON DELETE SET NULL | Linked academic course |
| `created_by`| INTEGER | REFERENCES users(id) ON DELETE CASCADE | Creator / Leader |
| `join_code` | VARCHAR(20) | UNIQUE | Team join code |

### 4. `group_members`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Membership record |
| `group_id` | INTEGER | REFERENCES groups(id) ON DELETE CASCADE | Linked group |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | Enrolled student |
| `role` | VARCHAR(20) | CHECK ('leader', 'member') | Team leadership flag |
| `status` | VARCHAR(20) | CHECK ('active', 'invited') | Membership status |

### 5. `assignments`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Unique assignment identifier |
| `title` | VARCHAR(200) | NOT NULL | Coursework title |
| `description`| TEXT | NOT NULL | Instructions and guidelines |
| `due_date` | TIMESTAMP | NOT NULL | Submission deadline |
| `onedrive_link`| TEXT | NOT NULL | External OneDrive destination folder URL |
| `course_id` | INTEGER | REFERENCES courses(id) ON DELETE CASCADE | Associated subject |
| `submission_type`| VARCHAR(20)| CHECK ('group', 'individual') | Group or individual coursework |
| `target_type`| VARCHAR(30) | CHECK ('all', 'specific_groups') | Cohort targeting scope |

### 6. `submissions`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Submission record |
| `assignment_id`| INTEGER | REFERENCES assignments(id) ON DELETE CASCADE | Target assignment |
| `group_id` | INTEGER | REFERENCES groups(id) ON DELETE CASCADE | Submitting team |
| `submitted_by`| INTEGER | REFERENCES users(id) | Student who initiated submit |
| `confirmation_step_1` | BOOLEAN | DEFAULT FALSE | OneDrive upload confirmation |
| `confirmation_step_2` | BOOLEAN | DEFAULT FALSE | Final submission verification |
| `status` | VARCHAR(30) | CHECK ('draft', 'submitted', 'verified') | Workflow status |
| `submitted_at`| TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Submission timestamp |
| *Constraint* | UNIQUE | (assignment_id, group_id, submitted_by) | Multi-student individual submission support |

### 7. `student_confirmations`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Confirmation record |
| `submission_id`| INTEGER | REFERENCES submissions(id) ON DELETE CASCADE | Parent submission |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | Individual student confirmed |
| `assignment_id`| INTEGER | REFERENCES assignments(id) ON DELETE CASCADE | Assignment |
| `group_id` | INTEGER | REFERENCES groups(id) ON DELETE CASCADE | Group |
| `confirmed_step_1` | BOOLEAN | DEFAULT FALSE | Step 1 confirmed |
| `confirmed_step_2` | BOOLEAN | DEFAULT FALSE | Step 2 confirmed |
| `confirmed_at`| TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Exact confirmation timestamp |

---

## 📡 API Endpoints Reference

All authenticated endpoints require the HTTP header `Authorization: Bearer <JWT_TOKEN>`.

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new student or professor account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile & memberships |
| `GET` | `/api/auth/students/search` | Authenticated | Search peers by name, email, or Student ID |

### Courses (`/api/courses`)
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses/all` | Authenticated | List courses (students see enrolled; profs see taught) |
| `POST` | `/api/courses` | Professor | Create a new subject & generate join code |
| `POST` | `/api/courses/join` | Student | Join an academic course via join code |
| `GET` | `/api/courses/:id` | Authenticated | Get course details and enrolled teams |

### Groups (`/api/groups`)
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/groups` | Student | Create a team under a course (creator becomes Leader) |
| `GET` | `/api/groups/my` | Student | List user's active groups & teammates |
| `GET` | `/api/groups/all` | Professor | View all formed groups across courses |
| `POST` | `/api/groups/join` | Student | Join team via alphanumeric group code |
| `POST` | `/api/groups/:id/members`| Member | Add a peer by email or student ID |
| `DELETE`| `/api/groups/:id/members/:userId` | Leader/Self | Remove a member or voluntarily leave group |

### Assignments (`/api/assignments`)
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/assignments` | Authenticated | List assignments (supports `?courseId=...` filter) |
| `POST` | `/api/assignments` | Professor | Create assignment (Group/Individual, OneDrive URL) |
| `PUT` | `/api/assignments/:id` | Professor | Update assignment instructions, due date, or OneDrive link |
| `DELETE`| `/api/assignments/:id` | Professor | Remove an assignment |

### Submissions & Verification (`/api/submissions`)
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/submissions/two-step-confirm` | Student | Execute two-step submission (Leader-enforced for groups) |
| `GET` | `/api/submissions/assignment/:id` | Authenticated | View group & student-wise confirmation roster |
| `PUT` | `/api/submissions/:id/verify` | Professor | Approve and verify submission (`status = verified`) |

### Analytics (`/api/analytics`)
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/admin` | Professor | Enrolled student counts, group rates, cohort metrics |
| `GET` | `/api/analytics/student-progress` | Student | Personal progress percentages, completion stats, badges |

---

## ⚡ Local Setup & Installation

### Prerequisites
- **Node.js** (v18.x or v20.x recommended)
- **npm** (v9.x or higher)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/priyansh-018/JoinEazy.git
cd JoinEazy
```

### 2. Configure Environment Variables
Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secure-jwt-secret-key-2026

# Neon PostgreSQL connection URL
DATABASE_URL=your-postgresql-connection-string
```
*(Note: If `DATABASE_URL` is omitted, JoinEazy automatically activates its zero-setup embedded persistent database engine).*

### 3. Run Backend Server
```bash
cd backend
npm install
npm start
# Backend server runs on http://localhost:5000
```

### 4. Run Frontend Application
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Production Deployment Details

JoinEazy is deployed as a unified full-stack web service on **Render**:
- **Hosting Platform**: [Render Web Services](https://render.com)
- **Database Engine**: Neon Serverless PostgreSQL with SSL connection pooling
- **Routing Strategy**: Single-process architecture where Express serves production-compiled Vite assets (`dist/`) with SPA fallback routing for client-side React routes (`/*`).
- **Live Endpoint**: **[https://joineazy-q36y.onrender.com](https://joineazy-q36y.onrender.com)**

---

## 📄 License
This project is developed for academic coursework evaluation and is distributed under the MIT License.
