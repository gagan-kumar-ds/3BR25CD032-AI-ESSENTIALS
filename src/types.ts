// Types for Smart Attendance Tracker

export type Role = 'admin' | 'student';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  department: string;
  avatar: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkInTime?: string;
  notes?: string;
}

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Alex Johnson',
    email: 'alex.j@university.edu',
    rollNo: 'CS-2024-001',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 's2',
    name: 'Sarah Chen',
    email: 'sarah.c@university.edu',
    rollNo: 'CS-2024-002',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 's3',
    name: 'Michael Brown',
    email: 'michael.b@university.edu',
    rollNo: 'EC-2024-015',
    department: 'Electronics',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 's4',
    name: 'Emily Davis',
    email: 'emily.d@university.edu',
    rollNo: 'ME-2024-008',
    department: 'Mechanical',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 's5',
    name: 'David Kim',
    email: 'david.k@university.edu',
    rollNo: 'CS-2024-009',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 's6',
    name: 'Jessica Taylor',
    email: 'jessica.t@university.edu',
    rollNo: 'EC-2024-022',
    department: 'Electronics',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  }
];

// Helper to generate initial mock attendance records for past dates
export const getInitialAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  const statuses: AttendanceStatus[] = ['present', 'present', 'present', 'absent', 'late', 'excused'];

  dates.forEach((date, dateIdx) => {
    INITIAL_STUDENTS.forEach((student, studentIdx) => {
      const statusIdx = (dateIdx + studentIdx) % statuses.length;
      const status = statuses[statusIdx];
      let checkInTime = undefined;
      if (status === 'present') checkInTime = '08:55 AM';
      else if (status === 'late') checkInTime = '09:25 AM';

      records.push({
        id: `att-${student.id}-${date}`,
        studentId: student.id,
        date,
        status,
        checkInTime,
        notes: status === 'excused' ? 'Medical leave' : undefined
      });
    });
  });

  return records;
};
