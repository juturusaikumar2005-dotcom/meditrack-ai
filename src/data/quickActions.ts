export interface QuickActionItem {
  id: string;
  label: string;
  prompt: string;
  iconName: string;
  category?: string;
}

export const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'explain-report',
    label: 'Explain My Report',
    prompt: 'I uploaded my blood work and lab report. Can you help me understand what the values mean?',
    iconName: 'FileText',
    category: 'Reports',
  },
  {
    id: 'chest-pain',
    label: 'Chest Pain',
    prompt: 'I am experiencing mild chest pain and discomfort. What should I do?',
    iconName: 'HeartPulse',
    category: 'Symptoms',
  },
  {
    id: 'headache',
    label: 'Headache',
    prompt: 'I have had a lingering headache for 2 days. What could be causing it and which specialist should I consult?',
    iconName: 'Activity',
    category: 'Symptoms',
  },
  {
    id: 'common-cold',
    label: 'Common Cold',
    prompt: 'What are the best precautions and self-care tips for a common cold and fever?',
    iconName: 'Thermometer',
    category: 'Care',
  },
  {
    id: 'fever',
    label: 'Fever',
    prompt: 'My body temperature is 101°F. When should I visit a doctor?',
    iconName: 'Flame',
    category: 'Symptoms',
  },
  {
    id: 'blood-pressure',
    label: 'Blood Pressure',
    prompt: 'My blood pressure reading came out high. What steps can I take to manage it safely?',
    iconName: 'Stethoscope',
    category: 'Vitals',
  },
  {
    id: 'medicine-info',
    label: 'Medicine Information',
    prompt: 'What medicine is typically prescribed for diabetes management and what precautions should I follow?',
    iconName: 'Pill',
    category: 'Medication',
  },
  {
    id: 'find-specialist',
    label: 'Find the Right Specialist',
    prompt: 'Which doctor should I visit for sudden skin rashes and joint stiffness?',
    iconName: 'UserCheck',
    category: 'Guidance',
  },
  {
    id: 'health-tips',
    label: 'Health Tips',
    prompt: 'What daily habits and preventive care routines do you recommend for cardiovascular health?',
    iconName: 'Sparkles',
    category: 'Wellness',
  },
  {
    id: 'healthy-diet',
    label: 'Healthy Diet',
    prompt: 'Can you suggest dietary guidelines for managing sugar levels and cholesterol?',
    iconName: 'Apple',
    category: 'Wellness',
  },
];
