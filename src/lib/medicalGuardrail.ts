import { MEDICINE_DATABASE } from '@/data/medicineDatabase';

export interface IntentResult {
  isMedical: boolean;
  isSelfHarm?: boolean;
  reply?: string;
  category?: 'medical' | 'self_harm' | 'non_medical';
}

export const REJECTION_MESSAGE = `I'm MediTrack AI.

I only answer healthcare-related questions including diseases, medicines, prescriptions, laboratory reports, medical imaging, nutrition, fitness, and general health.

Please ask a healthcare-related question.`;

export const MENTAL_HEALTH_CRISIS_RESPONSE = `I hear that you're going through a very difficult time, and your life is valuable. Please reach out for immediate support — you don't have to carry this alone:

🆘 **National Suicide & Crisis Lifeline**: Call or text **988** (Available 24/7, Free & Confidential)
🆘 **Emergency Services**: Call **911** (US) / **112** (International) or visit the nearest Emergency Room.
🆘 **Crisis Text Line**: Text **HOME** to **741741**

Please connect with a healthcare provider, counselor, family member, or crisis helpline immediately. Help is available right now.`;

// ────────────────────────────────────────────────────────────────
// EXPLICIT BLACKLIST PATTERNS (NON-MEDICAL TOPICS)
// ────────────────────────────────────────────────────────────────
const BLACKLIST_PATTERNS = [
  // Programming, Coding & Software Engineering
  /\b(react|javascript|js|typescript|ts|python|java|c\+\+|c#|html|css|node\.?js|vue|angular|sql|git|linux|docker|aws|api|code|coding|script|debug|function|variable|compiler|algorithm|array|object|syntax|npm|pip|github|bug|developer|framework|class|import|export|useeffect|usestate|prompt|llm|openai|chatgpt)\b/i,

  // Sports, Games & Athletes
  /\b(virat|kohli|sachin|dhoni|rohit|sharma|ipl|cricket|football|soccer|messi|ronaldo|nba|tennis|federer|nadal|djokovic|olympic|stadium|match|score|wicket|goal|world cup|premier league|tournament)\b/i,

  // Movies, Music, Humor & Entertainment
  /\b(joke|jokes|tell me a joke|funny|poem|poetry|story|movie|film|actor|actress|hollywood|bollywood|netflix|cinema|album|song|sing|music|game|gaming|playstation|xbox|fortnite)\b/i,

  // Politics, History & Government
  /\b(president|prime minister|election|parliament|democrat|republican|political|war|revolution|century|empire|dynasty|king|queen|geography|capital city|history)\b/i,

  // Finance, Crypto & Business
  /\b(bitcoin|crypto|cryptocurrency|stock market|stocks|trading|forex|investment|bank loan|mortgage|interest rate|wall street|shares|dividend)\b/i,

  // Mathematics & School Homework
  /\b(calculus|algebra|solve for x|geometry|trigonometry|equation|derivative|integral|homework|essay writing|thesis)\b/i,

  // Travel & Weather
  /\b(weather|temperature today|rain forecast|flight ticket|hotel booking|car repair|automobile)\b/i,
];

// ────────────────────────────────────────────────────────────────
// EXPLICIT MEDICAL WHITELIST PATTERNS
// ────────────────────────────────────────────────────────────────
const MEDICAL_WHITELIST_PATTERNS = [
  // Medical Conditions & Diseases
  /\b(disease|symptom|symptoms|illness|infection|condition|disorder|syndrome|fever|cough|cold|flu|dengue|malaria|covid|cancer|tumor|diabetes|hypertension|bp|blood pressure|asthma|bronchitis|allergy|allergies|arthritis|stroke|seizure|epilepsy|anemia|thyroid|jaundice|hepatitis|pneumonia|tuberculosis|tb|hiv|aids|migraine|headache|pain|chest pain|stomach ache|cramps|diarrhea|constipation|vomiting|nausea|rash|swelling|inflammation|eczema|psoriasis|insomnia|depression|anxiety|stress|panic|bipolar|schizophrenia|dementia|alzheimer)\b/i,

  // Medicines, Pharmacology & Prescriptions
  /\b(medicine|medicines|medication|drug|drugs|pill|pills|tablet|tablets|capsule|capsules|injection|syrup|ointment|cream|drop|dosage|dose|side effect|side effects|drug interaction|prescription|otc|antibiotic|antibiotics|painkiller|antacid|antihistamine|statin|steroid|insulin|paracetamol|dolo|crocin|calpol|metformin|glycomet|azithromycin|azathioprine|azax|azee|amoxicillin|ciprofloxacin|ciplox|ibuprofen|brufen|advil|combiflam|diclofenac|voveran|pantoprazole|pan|pantop|omeprazole|omez|telmisartan|telma|amlodipine|stamlo|atorvastatin|atorva|rosuvastatin|levothyroxine|eltroxin|thyrox|cetirizine|cetzine|okacet|montelukast|montair|aspirin|disprin|ecosprin|clopidogrel|deplatt|plavix|alprazolam|alprax|xanax|vitamin|supplements|iron|calcium|multivitamin)\b/i,

  // Medical Reports, Labs & Diagnostics
  /\b(report|reports|lab|laboratory|test|tests|cbc|hemoglobin|hb|wbc|rbc|platelets|dlc|mri|ct scan|x-ray|ultrasound|ecg|ekg|eeg|blood test|urine test|lipid profile|cholesterol|triglycerides|lft|liver function|kft|kidney function|creatinine|urea|hba1c|blood sugar|glucose|tsh|thyroid test|biopsy|pathology|diagnostic|vital|vitals|spo2|oxygen|pulse|heart rate|bpm|organ health|scan|xray)\b/i,

  // Wellness, Nutrition, Reproductive & Clinical Care
  /\b(health|healthcare|nutrition|diet|dietary|protein|calories|carbs|vitamins|minerals|hydration|water intake|exercise|workout|fitness|bmi|weight loss|weight gain|sleep|pregnancy|pregnant|trimester|fetal|baby|pediatric|child health|infant|women's health|men's health|menstrual|period|ovulation|pcos|doctor|physician|clinician|specialist|hospital|clinic|first aid|cpr|vaccine|vaccines|vaccination|booster|dose|treatment|cure|therapy|physiotherapy|rehab|recovery|surgery|operation)\b/i,

  // Natural Language Medical Query Intent Patterns
  /\b(can i take|how to take|side effects|uses of|what is|is it safe|should i see a doctor|how to cure|how to treat|interpret my|my report|health status|medical guidance|doctor advice)\b/i,
];

// ────────────────────────────────────────────────────────────────
// SELF-HARM & CRISIS PATTERNS
// ────────────────────────────────────────────────────────────────
const SELF_HARM_PATTERNS = [
  /\b(i want to die|kill myself|want to kill myself|suicide|end my life|don't want to live|dont want to live|take my own life|commit suicide|self harm|hang myself|cut my wrists|overdose to die)\b/i,
];

// ────────────────────────────────────────────────────────────────
// MEDICINE DATABASE LOOKUP
// ────────────────────────────────────────────────────────────────
function matchesMedicineDatabase(text: string): boolean {
  const lower = text.toLowerCase();
  for (const [key, info] of Object.entries(MEDICINE_DATABASE)) {
    if (lower.includes(key)) return true;
    if (info.generic_name && lower.includes(info.generic_name.toLowerCase())) return true;
    if (info.brand_names && info.brand_names.some((b) => lower.includes(b.toLowerCase()))) return true;
  }
  return false;
}

// ────────────────────────────────────────────────────────────────
// MAIN MEDICAL INTENT CLASSIFIER & PRE-LLM GUARDRAIL
// ────────────────────────────────────────────────────────────────
export function classifyMedicalIntent(userMessage: string): IntentResult {
  const trimmed = userMessage.trim();
  if (!trimmed) {
    return { isMedical: false, reply: REJECTION_MESSAGE, category: 'non_medical' };
  }

  // 1. Self-Harm & Mental Health Crisis Check (ALWAYS OVERRIDES & TRIGGERS HELP)
  for (const pattern of SELF_HARM_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isMedical: true,
        isSelfHarm: true,
        reply: MENTAL_HEALTH_CRISIS_RESPONSE,
        category: 'self_harm',
      };
    }
  }

  // 2. Rule-Based Blacklist Check (Reject Programming, Sports, Entertainment, Politics, Math, Jokes, etc.)
  for (const pattern of BLACKLIST_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isMedical: false,
        reply: REJECTION_MESSAGE,
        category: 'non_medical',
      };
    }
  }

  // 3. Medicine Database Lookup
  if (matchesMedicineDatabase(trimmed)) {
    return { isMedical: true, category: 'medical' };
  }

  // 4. Medical Whitelist Pattern Check
  for (const pattern of MEDICAL_WHITELIST_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { isMedical: true, category: 'medical' };
    }
  }

  // 5. Initial Health Greetings (e.g., "hello doctor", "hi", "help")
  if (/^(hi|hello|hey|greetings|good morning|good evening|help|doc|doctor)\b/i.test(trimmed)) {
    return { isMedical: true, category: 'medical' };
  }

  // 6. Default Non-Medical Fallback: REJECT BEFORE REACHING LLM!
  return {
    isMedical: false,
    reply: REJECTION_MESSAGE,
    category: 'non_medical',
  };
}

/**
 * Primary Guardrail Function: returns true ONLY if query is genuinely healthcare related.
 */
export function isMedicalQuery(message: string): boolean {
  const intent = classifyMedicalIntent(message);
  return intent.isMedical;
}
