import type { ChatMessageItem } from '@/data/sampleConversations';

export interface EmergencyMatch {
  isEmergency: boolean;
  matchedTrigger?: string;
}

export interface SpecialistInfo {
  specialty: string;
  description: string;
  recommendedReason: string;
}

const EMERGENCY_KEYWORDS = [
  'chest pain',
  'pain in my chest',
  'heart attack',
  'difficulty breathing',
  'shortness of breath',
  'cannot breathe',
  'cant breathe',
  'stroke',
  'face drooping',
  'heavy bleeding',
  'bleeding profusely',
  'loss of consciousness',
  'passed out',
  'fainted',
  'unconscious',
  'severe allergic reaction',
  'anaphylaxis',
  'sudden paralysis',
  'slurred speech',
];

const SPECIALIST_MAPPINGS: Array<{
  keywords: string[];
  specialty: string;
  description: string;
  recommendedReason: string;
}> = [
  {
    keywords: ['chest pain', 'heart', 'palpitations', 'cardiac', 'blood pressure', 'high bp', 'hypertension', 'angina'],
    specialty: 'Cardiologist',
    description: 'Specialist in heart health, cardiovascular systems, and blood pressure management.',
    recommendedReason: 'Recommended for cardiovascular evaluation and blood pressure care.',
  },
  {
    keywords: ['skin', 'rash', 'acne', 'itching', 'eczema', 'psoriasis', 'dermatitis', 'mole', 'hives'],
    specialty: 'Dermatologist',
    description: 'Specialist in skin conditions, allergies, rashes, and cutaneous health.',
    recommendedReason: 'Recommended for skin evaluation and specialized topical therapy.',
  },
  {
    keywords: ['bone', 'joint', 'fracture', 'sprain', 'knee pain', 'back pain', 'arthritis', 'spine'],
    specialty: 'Orthopedic Specialist',
    description: 'Specialist in bones, joints, ligaments, tendons, and musculoskeletal structure.',
    recommendedReason: 'Recommended for skeletal, joint, or mobility pain diagnosis.',
  },
  {
    keywords: ['eye', 'vision', 'blurred vision', 'cataract', 'glaucoma', 'cornea', 'eye pain', 'redness in eye'],
    specialty: 'Ophthalmologist',
    description: 'Medical eye physician specializing in vision care, ocular diseases, and eye exams.',
    recommendedReason: 'Recommended for visual acuity tests and ocular health inspection.',
  },
  {
    keywords: ['ear', 'nose', 'throat', 'sinus', 'hearing', 'tinnitus', 'sore throat', 'tonsils', 'nasal'],
    specialty: 'ENT Specialist (Otolaryngologist)',
    description: 'Specialist treating ear, nose, throat, sinus, and upper respiratory structures.',
    recommendedReason: 'Recommended for ear, sinus, balance, or upper throat conditions.',
  },
  {
    keywords: ['women', 'pregnancy', 'menstrual', 'period', 'ovary', 'uterus', 'gynecology', 'breast', 'pcos'],
    specialty: 'Gynecologist',
    description: 'Specialist in female reproductive health, hormonal balance, and prenatal wellness.',
    recommendedReason: 'Recommended for female reproductive wellness and hormonal care.',
  },
  {
    keywords: ['child', 'children', 'infant', 'baby', 'toddler', 'pediatric', 'kid'],
    specialty: 'Pediatrician',
    description: 'Medical doctor dedicated to infant, child, and adolescent healthcare.',
    recommendedReason: 'Recommended for pediatric growth, vaccines, and child development.',
  },
  {
    keywords: ['mental health', 'anxiety', 'depression', 'stress', 'panic', 'insomnia', 'sleep disorder', 'mood'],
    specialty: 'Psychiatrist / Psychologist',
    description: 'Specialist in emotional, cognitive, and mental health therapy and psychiatric care.',
    recommendedReason: 'Recommended for psychological support, stress reduction, and therapy.',
  },
  {
    keywords: ['diabetes', 'sugar', 'glucose', 'thyroid', 'hormone', 'endocrinology', 'insulin', 'metabolism'],
    specialty: 'Endocrinologist',
    description: 'Specialist in metabolic disorders, thyroid conditions, and diabetes care.',
    recommendedReason: 'Recommended for endocrine testing and blood glucose optimization.',
  },
  {
    keywords: ['stomach', 'digestive', 'acid reflux', 'gerd', 'nausea', 'vomiting', 'diarrhea', 'ulcer', 'gut'],
    specialty: 'Gastroenterologist',
    description: 'Specialist in gastrointestinal tract, liver, stomach, and digestive digestive health.',
    recommendedReason: 'Recommended for GI tract symptoms and digestive evaluation.',
  },
  {
    keywords: ['brain', 'dizziness', 'seizure', 'migraine', 'numbness', 'nerve', 'neurology', 'memory'],
    specialty: 'Neurologist',
    description: 'Specialist in the nervous system, brain functions, migraines, and nerve disorders.',
    recommendedReason: 'Recommended for neurological baseline checks and nerve symptoms.',
  },
];

export function detectEmergency(userInput: string): EmergencyMatch {
  const lower = userInput.toLowerCase();
  for (const kw of EMERGENCY_KEYWORDS) {
    if (lower.includes(kw)) {
      return { isEmergency: true, matchedTrigger: kw };
    }
  }
  return { isEmergency: false };
}

export function findSpecialist(userInput: string): SpecialistInfo | null {
  const lower = userInput.toLowerCase();
  for (const item of SPECIALIST_MAPPINGS) {
    for (const kw of item.keywords) {
      if (lower.includes(kw)) {
        return {
          specialty: item.specialty,
          description: item.description,
          recommendedReason: item.recommendedReason,
        };
      }
    }
  }
  return null;
}

export function generateAIHealthResponse(userInput: string): ChatMessageItem {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const emergencyInfo = detectEmergency(userInput);
  const specialist = findSpecialist(userInput);
  const lower = userInput.toLowerCase();

  if (emergencyInfo.isEmergency) {
    let emergencyText = `### ⚠️ Immediate Clinical Attention Recommended\n\n`;
    emergencyText += `You mentioned symptoms related to **${emergencyInfo.matchedTrigger?.toUpperCase()}**.\n\n`;
    emergencyText += `Acute chest pain, breathing difficulties, or sudden neurological signs require **urgent emergency evaluation**.\n\n`;
    emergencyText += `**Immediate Precautions:**\n`;
    emergencyText += `1. **Stay calm** and rest in a comfortable position.\n`;
    emergencyText += `2. **Do not drive yourself** to the hospital if experiencing chest pain or dizziness.\n`;
    emergencyText += `3. Inform someone nearby immediately.\n\n`;
    if (specialist) {
      emergencyText += `**Relevant Specialist:** ${specialist.specialty} (${specialist.recommendedReason})\n\n`;
    }
    emergencyText += `*Please use emergency response services or proceed to the nearest emergency department right away.*`;

    return {
      id: `msg-ai-${Date.now()}`,
      role: 'ai',
      text: emergencyText,
      timestamp,
      isEmergency: true,
      specialistSuggestion: specialist
        ? { specialty: specialist.specialty, description: specialist.description }
        : { specialty: 'Emergency Physician / Cardiologist', description: 'Urgent medical care specialist' },
      suggestedFollowUps: ['Find Emergency Services', 'Common Cold', 'Health Tips'],
    };
  }

  // Handle report upload query
  if (lower.includes('report') || lower.includes('uploaded') || lower.includes('blood work') || lower.includes('mri') || lower.includes('ct scan') || lower.includes('x-ray')) {
    const text = `### 📊 Report Analysis & Guidance\n\n` +
      `I can help break down your uploaded health report in clear, non-technical terms:\n\n` +
      `• **Key Biomarkers:** Normal reference ranges are evaluated against standard clinical thresholds.\n` +
      `• **Common Flags:** Variations in WBC, Hemoglobin, Blood Glucose, or Cholesterol are highlighted for your doctor's review.\n` +
      `• **Next Steps:** Keep your uploaded report accessible when consulting your primary physician.\n\n` +
      `**Recommended Specialist:**\n` +
      `*General Physician / Internal Medicine* — best suited to evaluate complete lab panels and integrate your health history.\n\n` +
      `*Reminder: AI analysis assists understanding but does not replace formal pathologist or physician diagnosis.*`;

    return {
      id: `msg-ai-${Date.now()}`,
      role: 'ai',
      text,
      timestamp,
      specialistSuggestion: {
        specialty: 'Internal Medicine / General Physician',
        description: 'Comprehensive evaluation of lab values and routine diagnostic reports.',
      },
      suggestedFollowUps: ['What does high BP mean?', 'Common Cold', 'Find the Right Specialist'],
    };
  }

  // Handle Medicine information query
  if (lower.includes('medicine') || lower.includes('pill') || lower.includes('drug') || lower.includes('dosage') || lower.includes('prescription')) {
    const text = `### 💊 Medication & Pharmacology Guidance\n\n` +
      `When reviewing medications, it's essential to keep the following guidelines in mind:\n\n` +
      `• **Adherence:** Take prescribed medications consistently as instructed by your healthcare provider.\n` +
      `• **Drug Interactions:** Avoid combining OTC pain relievers or supplements without verifying with a pharmacist.\n` +
      `• **Side Effects:** Common mild side effects include light nausea or dry mouth; report any severe rash or swelling immediately.\n\n` +
      `**Which Specialist to Visit:**\n` +
      `Consult your **Prescribing Physician** or a **Pharmacist** for exact dose adjustments and safety checks.`;

    return {
      id: `msg-ai-${Date.now()}`,
      role: 'ai',
      text,
      timestamp,
      specialistSuggestion: {
        specialty: 'Clinical Pharmacist / Prescribing Physician',
        description: 'Medication management, dosage safety, and drug interaction reviews.',
      },
      suggestedFollowUps: ['Explain My Report', 'Diabetes', 'Health Tips'],
    };
  }

  // General symptom & guidance builder
  let responseBody = `### 🩺 Healthcare Assessment & Guidance\n\n`;

  if (specialist) {
    responseBody += `Thank you for sharing your concern. Based on your symptoms regarding **${userInput.trim()}**, here is an overview of potential causes and recommended precautions:\n\n`;
    responseBody += `**Possible Causes:**\n`;
    responseBody += `• Mild inflammatory response, muscle fatigue, or localized irritation.\n`;
    responseBody += `• Stress, dehydration, or routine metabolic variations.\n\n`;
    responseBody += `**Recommended Precautions:**\n`;
    responseBody += `1. **Rest & Hydration:** Maintain consistent electrolyte and water intake.\n`;
    responseBody += `2. **Symptom Tracking:** Note the duration, intensity, and any triggering factors.\n`;
    responseBody += `3. **Avoid Self-Medication:** Avoid high-dose OTC remedies before clinical consultation.\n\n`;
    responseBody += `**Recommended Specialist:**\n`;
    responseBody += `➡️ **${specialist.specialty}**: ${specialist.description}\n\n`;
  } else {
    responseBody += `Thank you for reaching out. Here is general medical information regarding your inquiry (**"${userInput.trim()}"**):\n\n`;
    responseBody += `**Health Guidance & Best Practices:**\n`;
    responseBody += `• Maintain steady sleep schedules (7–8 hours) to support immune recovery.\n`;
    responseBody += `• Ensure balanced nutrition rich in fresh vegetables, whole grains, and lean proteins.\n`;
    responseBody += `• Stay adequately hydrated throughout the day.\n\n`;
    responseBody += `**Recommended Specialist:**\n`;
    responseBody += `➡️ **General Physician / Primary Care Provider**: A great starting point to assess general symptoms and coordinate further diagnostics if needed.\n\n`;
  }

  responseBody += `*Important Disclaimer: This AI assistant provides general healthcare information for educational purposes and is not a substitute for professional clinical diagnosis.*`;

  return {
    id: `msg-ai-${Date.now()}`,
    role: 'ai',
    text: responseBody,
    timestamp,
    specialistSuggestion: specialist
      ? { specialty: specialist.specialty, description: specialist.description }
      : { specialty: 'General Physician', description: 'Primary healthcare assessment and diagnostic triage.' },
    suggestedFollowUps: [
      'Explain My Report',
      'Common Cold',
      'Find the Right Specialist',
      'Health Tips',
    ],
  };
}
