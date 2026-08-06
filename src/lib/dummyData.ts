import type { Patient, Report, Agent, Notification, Appointment } from './types';

export const patients: Patient[] = [
  {
    id: 'p1',
    name: 'Sarah Chen',
    age: 34,
    gender: 'Female',
    bloodGroup: 'O+',
    riskScore: 28,
    status: 'Stable',
    lastVisit: '2026-07-28',
    avatar: 'SC',
    conditions: ['Hypertension', 'Migraine'],
    vitals: { heartRate: 72, bloodPressure: '120/78', temperature: 98.6, oxygen: 98 },
  },
  {
    id: 'p2',
    name: 'Marcus Reid',
    age: 58,
    gender: 'Male',
    bloodGroup: 'A+',
    riskScore: 76,
    status: 'Critical',
    lastVisit: '2026-08-02',
    avatar: 'MR',
    conditions: ['Type 2 Diabetes', 'Cardiac Arrhythmia'],
    vitals: { heartRate: 94, bloodPressure: '148/96', temperature: 99.2, oxygen: 94 },
  },
  {
    id: 'p3',
    name: 'Aisha Patel',
    age: 27,
    gender: 'Female',
    bloodGroup: 'B+',
    riskScore: 12,
    status: 'Recovering',
    lastVisit: '2026-07-30',
    avatar: 'AP',
    conditions: ['Post-surgery recovery'],
    vitals: { heartRate: 68, bloodPressure: '115/75', temperature: 98.4, oxygen: 99 },
  },
  {
    id: 'p4',
    name: 'James Okonkwo',
    age: 45,
    gender: 'Male',
    bloodGroup: 'AB-',
    riskScore: 54,
    status: 'Observation',
    lastVisit: '2026-08-04',
    avatar: 'JO',
    conditions: ['Asthma', 'Sleep Apnea'],
    vitals: { heartRate: 82, bloodPressure: '132/88', temperature: 98.8, oxygen: 95 },
  },
  {
    id: 'p5',
    name: 'Elena Volkov',
    age: 62,
    gender: 'Female',
    bloodGroup: 'O-',
    riskScore: 89,
    status: 'Critical',
    lastVisit: '2026-08-05',
    avatar: 'EV',
    conditions: ['Chronic Kidney Disease', 'Anemia'],
    vitals: { heartRate: 88, bloodPressure: '156/98', temperature: 100.1, oxygen: 92 },
  },
  {
    id: 'p6',
    name: 'David Kim',
    age: 19,
    gender: 'Male',
    bloodGroup: 'A-',
    riskScore: 8,
    status: 'Stable',
    lastVisit: '2026-07-25',
    avatar: 'DK',
    conditions: ['Seasonal Allergies'],
    vitals: { heartRate: 70, bloodPressure: '118/76', temperature: 98.2, oxygen: 99 },
  },
];

export const reports: Report[] = [
  {
    id: 'r1', patientId: 'p2', patientName: 'Marcus Reid', type: 'MRI',
    date: '2026-08-02', status: 'Analyzed', confidence: 94.2,
    prediction: 'Ischemic stroke — left MCA territory', severity: 'Critical', fileSize: '12.4 MB',
  },
  {
    id: 'r2', patientId: 'p1', patientName: 'Sarah Chen', type: 'Blood Report',
    date: '2026-07-28', status: 'Analyzed', confidence: 88.7,
    prediction: 'Mild iron deficiency anemia', severity: 'Low', fileSize: '480 KB',
  },
  {
    id: 'r3', patientId: 'p5', patientName: 'Elena Volkov', type: 'CT Scan',
    date: '2026-08-05', status: 'Processing', confidence: 0,
    prediction: 'Analyzing renal morphology…', severity: 'High', fileSize: '28.1 MB',
  },
  {
    id: 'r4', patientId: 'p4', patientName: 'James Okonkwo', type: 'X-Ray',
    date: '2026-08-04', status: 'Analyzed', confidence: 91.5,
    prediction: 'Mild hyperinflation — asthma exacerbation', severity: 'Moderate', fileSize: '3.2 MB',
  },
  {
    id: 'r5', patientId: 'p3', patientName: 'Aisha Patel', type: 'Prescription',
    date: '2026-07-30', status: 'Pending', confidence: 0,
    prediction: 'Awaiting review', severity: 'Low', fileSize: '120 KB',
  },
];

export const agents: Agent[] = [
  {
    id: 'a1', name: 'Diagnosis Agent', type: 'Diagnostic', icon: 'Stethoscope',
    description: 'Analyzes symptoms, vitals & lab results to propose differential diagnoses.',
    status: 'Completed', progress: 100,
    reasoning: ['Parsed 14 symptoms from intake', 'Cross-referenced 3,200 disease vectors', 'Ranked by likelihood × severity'],
    logs: [
      { time: '09:14:02', message: 'Intake vector parsed', level: 'info' },
      { time: '09:14:08', message: 'Knowledge graph query complete', level: 'success' },
      { time: '09:14:15', message: 'Top-3 diagnoses committed', level: 'success' },
    ],
  },
  {
    id: 'a2', name: 'Prescription Agent', type: 'Pharmacology', icon: 'Pill',
    description: 'Drafts evidence-based prescriptions adjusted to patient history & allergies.',
    status: 'Executing', progress: 64,
    reasoning: ['Loaded 5 active medications', 'Checked 12 known allergies', 'Calculating weight-based dosing'],
    logs: [
      { time: '09:15:01', message: 'Active meds loaded', level: 'info' },
      { time: '09:15:10', message: 'Allergy cross-check in progress', level: 'warn' },
    ],
  },
  {
    id: 'a3', name: 'Drug Interaction Agent', type: 'Safety', icon: 'ShieldAlert',
    description: 'Flags contraindications and major interactions across the full regimen.',
    status: 'Thinking', progress: 22,
    reasoning: ['Enumerating regimen pairs', 'Querying FDA interaction dataset'],
    logs: [{ time: '09:15:30', message: 'Pairwise enumeration started', level: 'info' }],
  },
  {
    id: 'a4', name: 'Medical Agent', type: 'Intake', icon: 'HeartPulse',
    description: 'Normalizes intake data, vitals & patient timeline into a structured graph.',
    status: 'Idle', progress: 0,
    reasoning: [], logs: [],
  },
  {
    id: 'a5', name: 'Appointment Agent', type: 'Scheduling', icon: 'CalendarClock',
    description: 'Optimizes scheduling across doctor availability, urgency & room capacity.',
    status: 'Idle', progress: 0,
    reasoning: [], logs: [],
  },
  {
    id: 'a6', name: 'Emergency Agent', type: 'Triage', icon: 'Siren',
    description: 'Monitors real-time vitals and triggers SOS escalation on threshold breach.',
    status: 'Idle', progress: 0,
    reasoning: [], logs: [],
  },
  {
    id: 'a7', name: 'Insurance Agent', type: 'Claims', icon: 'FileText',
    description: 'Pre-authorizes procedures and validates coverage codes against payer rules.',
    status: 'Idle', progress: 0,
    reasoning: [], logs: [],
  },
  {
    id: 'a8', name: 'Research Agent', type: 'Evidence', icon: 'FlaskConical',
    description: 'Surfaces latest peer-reviewed evidence relevant to active cases.',
    status: 'Idle', progress: 0,
    reasoning: [], logs: [],
  },
  {
    id: 'a9', name: 'Hospital Workflow Agent', type: 'Operations', icon: 'Building2',
    description: 'Balances bed allocation, staff rotation & resource dashboards.',
    status: 'Idle', progress: 0,
    reasoning: [], logs: [],
  },
];

export const notifications: Notification[] = [
  { id: 'n1', title: 'Critical Risk Alert', message: 'Elena Volkov — oxygen saturation dropped to 92%', type: 'alert', time: '2 min ago', read: false },
  { id: 'n2', title: 'Report Ready', message: 'MRI analysis for Marcus Reid completed (94.2% confidence)', type: 'success', time: '14 min ago', read: false },
  { id: 'n3', title: 'Drug Interaction', message: 'Warfarin + Aspirin flagged for Marcus Reid', type: 'warning', time: '1 hr ago', read: false },
  { id: 'n4', title: 'New Patient', message: 'David Kim registered and assigned to you', type: 'info', time: '3 hr ago', read: true },
  { id: 'n5', title: 'Appointment', message: 'Follow-up with Aisha Patel at 2:30 PM', type: 'info', time: '5 hr ago', read: true },
];

export const appointments: Appointment[] = [
  { id: 'ap1', patientName: 'Sarah Chen', doctorName: 'Dr. Reyes', time: '09:00', date: '2026-08-05', status: 'Upcoming', type: 'Consultation' },
  { id: 'ap2', patientName: 'Marcus Reid', doctorName: 'Dr. Tan', time: '10:30', date: '2026-08-05', status: 'Upcoming', type: 'Follow-up' },
  { id: 'ap3', patientName: 'Elena Volkov', doctorName: 'Dr. Reyes', time: '11:00', date: '2026-08-05', status: 'Upcoming', type: 'Emergency' },
  { id: 'ap4', patientName: 'James Okonkwo', doctorName: 'Dr. Patel', time: '14:00', date: '2026-08-05', status: 'Upcoming', type: 'Lab Test' },
  { id: 'ap5', patientName: 'Aisha Patel', doctorName: 'Dr. Tan', time: '14:30', date: '2026-08-05', status: 'Upcoming', type: 'Follow-up' },
];

export const analyticsData = {
  weeklyScans: [
    { day: 'Mon', scans: 42, critical: 4 },
    { day: 'Tue', scans: 56, critical: 7 },
    { day: 'Wed', scans: 38, critical: 2 },
    { day: 'Thu', scans: 64, critical: 9 },
    { day: 'Fri', scans: 71, critical: 5 },
    { day: 'Sat', scans: 29, critical: 3 },
    { day: 'Sun', scans: 18, critical: 1 },
  ],
  aiAccuracy: [
    { month: 'Feb', accuracy: 89 },
    { month: 'Mar', accuracy: 91 },
    { month: 'Apr', accuracy: 92 },
    { month: 'May', accuracy: 94 },
    { month: 'Jun', accuracy: 95 },
    { month: 'Jul', accuracy: 96 },
    { month: 'Aug', accuracy: 97 },
  ],
  departmentLoad: [
    { name: 'Cardiology', value: 32, color: '#2563eb' },
    { name: 'Neurology', value: 24, color: '#06b6d4' },
    { name: 'Radiology', value: 18, color: '#10b981' },
    { name: 'Oncology', value: 14, color: '#f59e0b' },
    { name: 'Other', value: 12, color: '#94a3b8' },
  ],
  vitalsTrend: [
    { time: '00:00', hr: 72, spo2: 98 },
    { time: '04:00', hr: 68, spo2: 97 },
    { time: '08:00', hr: 78, spo2: 96 },
    { time: '12:00', hr: 82, spo2: 95 },
    { time: '16:00', hr: 76, spo2: 97 },
    { time: '20:00', hr: 70, spo2: 98 },
  ],
};
