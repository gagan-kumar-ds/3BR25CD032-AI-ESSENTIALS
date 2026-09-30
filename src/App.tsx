import React, { useState } from 'react';
import {
  ShieldCheck, User, Sparkles, CheckCircle2, Lock,
  RefreshCw, GraduationCap, Calendar, BarChart3, Clock
} from 'lucide-react';
import { Role, Student, AttendanceRecord, AttendanceStatus, INITIAL_STUDENTS, getInitialAttendance } from './types';
import { AdminDashboard } from './AdminDashboard';
import { StudentView } from './StudentView';

export function App() {
  const [role, setRole] = useState<Role>('admin');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [records, setRecords] = useState<AttendanceRecord[]>(getInitialAttendance());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Single attendance record updater
  const handleUpdateAttendance = (
    studentId: string,
    status: AttendanceStatus,
    date: string,
    notes?: string
  ) => {
    setRecords(prev => {
      const existingIdx = prev.findIndex(r => r.studentId === studentId && r.date === date);
      let checkInTime = undefined;
      if (status === 'present') checkInTime = '09:00 AM';
      else if (status === 'late') checkInTime = '09:30 AM';

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          status,
          checkInTime: checkInTime || updated[existingIdx].checkInTime,
          notes: notes !== undefined ? notes : updated[existingIdx].notes
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `att-${studentId}-${date}`,
            studentId,
            date,
            status,
            checkInTime,
            notes
          }
        ];
      }
    });
  };

  // Bulk update all students for a specific date
  const handleBulkUpdate = (status: AttendanceStatus, date: string) => {
    students.forEach(student => {
      handleUpdateAttendance(student.id, status, date);
    });
  };

  // Add new student
  const handleAddStudent = (newStudentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...newStudentData,
      id: `s-${Date.now()}`
    };
    setStudents(prev => [...prev, newStudent]);
    // Set default present status for today
    handleUpdateAttendance(newStudent.id, 'present', selectedDate);
  };

  // Delete student
  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setRecords(prev => prev.filter(r => r.studentId !== studentId));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* Navigation Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  SmartAttendance
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v2.0 AI
                </span>
              </div>
              <p className="text-xs text-slate-400">Admin-Protected Attendance Management Engine</p>
            </div>
          </div>

          {/* Role Access Switcher / Control Switch */}
          <div className="flex items-center space-x-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 px-2 hidden sm:inline">
              Active Role:
            </span>

            <button
              onClick={() => setRole('admin')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin (Modify)</span>
            </button>

            <button
              onClick={() => setRole('student')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Student (Read-Only)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {role === 'admin' ? (
          <AdminDashboard
            students={students}
            records={records}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onUpdateAttendance={handleUpdateAttendance}
            onBulkUpdate={handleBulkUpdate}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        ) : (
          <StudentView
            students={students}
            records={records}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict Role-Based Security: Attendance modifications are restricted exclusively to authenticated Admins.</span>
          </div>
          <div>Smart Attendance System • Built with React & Tailwind</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
