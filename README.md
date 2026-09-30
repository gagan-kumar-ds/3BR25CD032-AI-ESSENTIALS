# Smart Attendance Tracker

A modern web application built with React, Vite, Tailwind CSS, and Lucide Icons featuring strict Role-Based Access Control (RBAC) where **only Administrators can modify attendance records**, while non-admin users (Students) have read-only access.

---

## 🌟 Key Features

1. **Role-Based Access Control (RBAC)**:
   - **Admin Mode**: Full control to add/delete students, change status for any date (Present, Absent, Late, Excused), and perform bulk updates.
   - **Student Mode**: Read-only dashboard with progress metrics, attendance rates, status badges, and history timeline. All modification controls are disabled with admin lock indicators.

2. **Smart Attendance Dashboard**:
   - Real-time statistics (Total Students, Present %, Absent %, Late %, Excused %).
   - Bulk marking (e.g. Mark All Present / Absent).
   - Search by name or roll number & filter by department.

---

## 🚀 How to Run the Project on Your Laptop

Follow these simple steps to run the Smart Attendance Tracker on your local machine:

### Prerequisites
Make sure you have **Node.js** (v18+ recommended) and **npm** installed on your laptop. You can verify by running:
```bash
node -v
npm -v
```

---

### Step 1: Open Terminal and Navigate to Project Directory
Open your terminal / command prompt and change directory to the repository folder:
```bash
cd /path/to/smart-attendance-tracker
```

### Step 2: Install Dependencies
Run the following command to install all required dependencies (`react`, `tailwindcss`, `lucide-react`, `vite`):
```bash
npm install
```

### Step 3: Start Development Server
Run the local development server:
```bash
npm run dev
```

### Step 4: Open in Web Browser
Once started, open your web browser and go to:
```
http://localhost:3000
```

---

## 🛠️ Build for Production

To create an optimized production build, run:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```
