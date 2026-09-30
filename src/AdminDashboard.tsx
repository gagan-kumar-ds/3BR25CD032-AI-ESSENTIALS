import React, { useState } from 'react';
import {
  Users, UserCheck, UserX, Clock, Calendar, Search,
  Plus, Edit2, Trash2, Filter, ShieldCheck, Lock, CheckCircle2, XCircle, AlertCircle, RefreshCw, BarChart2, CheckSquare
} from 'lucide-react';
import { Student, AttendanceRecord, AttendanceStatus, Role } from './types';

interface AdminDashboardProps {
  students: Student[];
  records: AttendanceRecord[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onUpdateAttendance: (studentId: string, status: AttendanceStatus, date: string, notes?: string) => void;
  onBulkUpdate: (status: AttendanceStatus, date: string) => void;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onDeleteStudent: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  records,
  selectedDate,
  setSelectedDate,
  onUpdateAttendance,
  onBulkUpdate,
  onAddStudent,
  onDeleteStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    rollNo: '',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  });

  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});

  // Filter students based on search and department
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || student.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  // Calculate statistics for selected date
  const selectedDateRecords = records.filter(r => r.date === selectedDate);
  const totalStudents = students.length;

  const getStatusCount = (status: AttendanceStatus) => {
    return selectedDateRecords.filter(r => r.status === status).length;
  };

  const presentCount = getStatusCount('present');
  const absentCount = getStatusCount('absent');
  const lateCount = getStatusCount('late');
  const excusedCount = getStatusCount('excused');
  const attendancePercentage = totalStudents > 0
    ? Math.round(((presentCount + lateCount) / totalStudents) * 100)
    : 0;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.rollNo || !newStudent.email) return;
    onAddStudent(newStudent);
    setNewStudent({
      name: '',
      email: '',
      rollNo: '',
      department: 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    });
    setShowAddModal(false);
  };

  const getRecordForStudent = (studentId: string) => {
    return selectedDateRecords.find(r => r.studentId === studentId);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Admin Badge */}
      <div className="bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 border border-emerald-500/30 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Admin Management Portal</h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                Full Modify Access
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-0.5">
              You are authorized to edit student records, update daily attendance, and trigger bulk operations.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Date & Bulk Action Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Selector */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-medium text-slate-300">Target Date:</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Quick Bulk Marking */}
        <div className="md:col-span-2 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300 flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            <span>Mark All Filtered as:</span>
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onBulkUpdate('present', selectedDate)}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition cursor-pointer"
            >
              All Present
            </button>
            <button
              onClick={() => onBulkUpdate('absent', selectedDate)}
              className="px-3 py-1.5 text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg hover:bg-rose-500/30 transition cursor-pointer"
            >
              All Absent
            </button>
            <button
              onClick={() => onBulkUpdate('late', selectedDate)}
              className="px-3 py-1.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition cursor-pointer"
            >
              All Late
            </button>
          </div>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Students</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white mt-1">{totalStudents}</div>
          <div className="text-xs text-indigo-400 mt-1 font-medium">Registered Active</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
          <div className="flex items-center justify-between text-emerald-400 text-xs">
            <span>Present</span>
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white mt-1">{presentCount}</div>
          <div className="text-xs text-emerald-400 mt-1 font-medium">{totalStudents ? Math.round((presentCount/totalStudents)*100) : 0}% of total</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
          <div className="flex items-center justify-between text-rose-400 text-xs">
            <span>Absent</span>
            <UserX className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white mt-1">{absentCount}</div>
          <div className="text-xs text-rose-400 mt-1 font-medium">{totalStudents ? Math.round((absentCount/totalStudents)*100) : 0}% of total</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
          <div className="flex items-center justify-between text-amber-400 text-xs">
            <span>Late</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white mt-1">{lateCount}</div>
          <div className="text-xs text-amber-400 mt-1 font-medium">{totalStudents ? Math.round((lateCount/totalStudents)*100) : 0}% of total</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-purple-400 text-xs">
            <span>Daily Attendance %</span>
            <BarChart2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white mt-1">{attendancePercentage}%</div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full" style={{ width: `${attendancePercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/40 p-3 rounded-2xl border border-slate-700/40">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name or roll no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
          </select>
        </div>
      </div>

      {/* Attendance Interactive Management Table */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700/60 flex items-center justify-between bg-slate-800">
          <h3 className="font-semibold text-slate-200 text-base">
            Attendance Log for {selectedDate}
          </h3>
          <span className="text-xs text-slate-400 bg-slate-900/60 border border-slate-700 px-3 py-1 rounded-lg">
            Showing {filteredStudents.length} of {students.length} Members
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/60">
                <th className="py-3.5 px-4 font-semibold">Student / Roll No</th>
                <th className="py-3.5 px-4 font-semibold">Department</th>
                <th className="py-3.5 px-4 font-semibold">Status Action (Admin Only)</th>
                <th className="py-3.5 px-4 font-semibold">Check-in / Note</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {filteredStudents.map((student) => {
                const rec = getRecordForStudent(student.id);
                const currentStatus = rec?.status || 'absent';

                return (
                  <tr key={student.id} className="hover:bg-slate-800/90 transition group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-semibold text-slate-100">{student.name}</div>
                          <div className="text-xs text-indigo-400 font-mono">{student.rollNo}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-md text-xs">
                        {student.department}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="inline-flex rounded-xl bg-slate-900/90 p-1 border border-slate-700/80">
                        <button
                          onClick={() => onUpdateAttendance(student.id, 'present', selectedDate)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center space-x-1 ${
                            currentStatus === 'present'
                              ? 'bg-emerald-500 text-slate-950 shadow-md'
                              : 'text-slate-400 hover:text-emerald-400'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>

                        <button
                          onClick={() => onUpdateAttendance(student.id, 'absent', selectedDate)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center space-x-1 ${
                            currentStatus === 'absent'
                              ? 'bg-rose-500 text-slate-950 shadow-md'
                              : 'text-slate-400 hover:text-rose-400'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>

                        <button
                          onClick={() => onUpdateAttendance(student.id, 'late', selectedDate)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center space-x-1 ${
                            currentStatus === 'late'
                              ? 'bg-amber-500 text-slate-950 shadow-md'
                              : 'text-slate-400 hover:text-amber-400'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Late</span>
                        </button>

                        <button
                          onClick={() => onUpdateAttendance(student.id, 'excused', selectedDate)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center space-x-1 ${
                            currentStatus === 'excused'
                              ? 'bg-purple-500 text-slate-950 shadow-md'
                              : 'text-slate-400 hover:text-purple-400'
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Excused</span>
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-300">
                      <div className="space-y-1">
                        <div>
                          {rec?.checkInTime ? (
                            <span className="text-emerald-400 font-mono">🕒 {rec.checkInTime}</span>
                          ) : (
                            <span className="text-slate-500 font-mono">--:--</span>
                          )}
                        </div>
                        {rec?.notes && (
                          <div className="text-indigo-300 bg-indigo-950/40 border border-indigo-800/40 rounded px-2 py-0.5 text-[11px] max-w-[180px] truncate">
                            {rec.notes}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onDeleteStudent(student.id)}
                        className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition cursor-pointer"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              <span>Add New Member / Student</span>
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-400 text-xs mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  placeholder="e.g. jane.d@university.edu"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1 font-medium">Roll Number</label>
                <input
                  type="text"
                  required
                  value={newStudent.rollNo}
                  onChange={(e) => setNewStudent({...newStudent, rollNo: e.target.value})}
                  placeholder="e.g. CS-2024-030"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1 font-medium">Department</label>
                <select
                  value={newStudent.department}
                  onChange={(e) => setNewStudent({...newStudent, department: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition cursor-pointer"
                >
                  Create Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
