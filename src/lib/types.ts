export type Role = 'patient' | 'doctor' | 'admin' | 'lab';

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  avatar_url?: string | null;
  specialization?: string | null;
  phone?: string | null;
  created_at?: string;
};

export type AuthSession = {
  token: string;
  user: Profile;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  bloodType?: string;
  riskScore: number;
  status: 'Stable' | 'Critical' | 'Recovering' | 'Observation' | 'Attention Needed';
  lastVisit: string;
  lastReportDate?: string;
  primaryDoctor?: string;
  avatar: string;
  conditions: string[];
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygen: number;
  };
};

export type Report = {
  id: string;
  patientId: string;
  patientName: string;
  type: 'X-Ray' | 'MRI' | 'CT Scan' | 'Blood Report' | 'Prescription';
  date: string;
  status: 'Analyzed' | 'Processing' | 'Pending';
  confidence: number;
  prediction: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  fileSize: string;
};

export type Agent = {
  id: string;
  name: string;
  type: string;
  description: string;
  status: 'Thinking' | 'Executing' | 'Completed' | 'Idle';
  progress: number;
  logs: { time: string; message: string; level: 'info' | 'warn' | 'success' }[];
  reasoning: string[];
  icon: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  time: string;
  read: boolean;
};

export type Appointment = {
  id: string;
  patientName: string;
  doctorName: string;
  time: string;
  date: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Lab Test';
};
