import React, { useState } from 'react';
import {
  Lock, AlertTriangle, Calendar, UserCheck, UserX, Clock,
  CheckCircle2, XCircle, AlertCircle, Award, BarChart3, Info
} from 'lucide-react';
import { Student, AttendanceRecord, AttendanceStatus } from './types';

interface StudentViewProps {
  students: Student[];
  records: AttendanceRecord[];
}

export const StudentView: React.FC<StudentViewProps> = ({
  students,
  records
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 's1');

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Get student attendance logs
  const studentRecords = records
    .filter(r => r.studentId === selectedStudentId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalClasses = studentRecords.length;
  const presentClasses = studentRecords.filter(r => r.status === 'present').length;
  const lateClasses = studentRecords.filter(r => r.status === 'late').length;
  const absentClasses = studentRecords.filter(r => r.status === 'absent').length;
  const excusedClasses = studentRecords.filter(r => r.status === 'excused').length;

  const attendanceRate = totalClasses > 0
    ? Math.round(((presentClasses + lateClasses) / totalClasses) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Read-Only Notice / Restriction Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-600/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-amber-200 text-sm sm:text-base">Student View (Read-Only Mode)</h3>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full border border-amber-500/30 font-semibold">
                Only Admins Can Modify Records
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Attendance data can only be modified or marked by verified System Administrators.
            </p>
          </div>
        </div>

        {/* Student Switcher for testing/demoing student view */}
        <div className="hidden md:flex items-center space-x-2">
          <span className="text-xs text-slate-400">View profile as:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Profile & Overview Header */}
      {currentStudent && (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/50 shadow-md"
            />
            <div>
              <h2 className="text-xl font-bold text-white">{currentStudent.name}</h2>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                <span className="font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                  {currentStudent.rollNo}
                </span>
                <span>•</span>
                <span>{currentStudent.department}</span>
                <span>•</span>
                <span className="text-slate-300">{currentStudent.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 w-full md:w-auto justify-around">
            <div className="text-center px-2">
              <div className="text-xs text-slate-400 uppercase font-semibold">Attendance Rate</div>
              <div className={`text-2xl font-bold mt-0.5 ${attendanceRate >= 80 ? 'text-emerald-400' : attendanceRate >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
                {attendanceRate}%
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="text-center px-2">
              <div className="text-xs text-slate-400 uppercase font-semibold">Status</div>
              <div className="text-sm font-semibold mt-1">
                {attendanceRate >= 75 ? (
                  <span className="text-emerald-400 flex items-center justify-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>Good Standing</span>
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center justify-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Low Attendance</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Classes Attended</div>
            <div className="text-xl font-bold text-white mt-0.5">{presentClasses}</div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-center space-x-3">
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Absences</div>
            <div className="text-xl font-bold text-white mt-0.5">{absentClasses}</div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Late Arrivals</div>
            <div className="text-xl font-bold text-white mt-0.5">{lateClasses}</div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-center space-x-3">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Excused Leaves</div>
            <div className="text-xl font-bold text-white mt-0.5">{excusedClasses}</div>
          </div>
        </div>
      </div>

      {/* Attendance History Timeline / Table */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700/60 bg-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-slate-200">Personal Attendance History</h3>
          </div>
          <span className="text-xs text-slate-400 bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg">
            {studentRecords.length} Sessions Recorded
          </span>
        </div>

        <div className="divide-y divide-slate-700/40">
          {studentRecords.map((record) => {
            let statusBadge = null;
            if (record.status === 'present') {
              statusBadge = (
                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Present</span>
                </span>
              );
            } else if (record.status === 'absent') {
              statusBadge = (
                <span className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs px-3 py-1 rounded-full font-semibold flex items-center space-x-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Absent</span>
                </span>
              );
            } else if (record.status === 'late') {
              statusBadge = (
                <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-3 py-1 rounded-full font-semibold flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Late</span>
                </span>
              );
            } else {
              statusBadge = (
                <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs px-3 py-1 rounded-full font-semibold flex items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Excused</span>
                </span>
              );
            }

            return (
              <div key={record.id} className="p-4 flex items-center justify-between hover:bg-slate-800/90 transition">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-400">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{record.date}</div>
                    <div className="text-xs text-slate-400">
                      {record.checkInTime ? `Check-in: ${record.checkInTime}` : 'No check-in timestamp'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {record.notes && (
                    <div className="text-xs text-indigo-300 bg-indigo-950/40 border border-indigo-800/40 px-2.5 py-1 rounded-lg">
                      Note: {record.notes}
                    </div>
                  )}
                  <div>{statusBadge}</div>
                  <div className="p-1.5 text-slate-500 cursor-not-allowed" title="Only admins can modify attendance records">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
