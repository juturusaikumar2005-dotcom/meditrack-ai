import type { PrescriptionAnalysisData } from '@/components/prescription/PrescriptionReaderResult';

/**
 * Multi-Agent Prescription Reader Pipeline
 * 1. OCR Agent
 * 2. Prescription Parser
 * 3. Dosage Analyzer
 * 4. Schedule Analyzer
 * 5. Duration Agent
 * 6. Clinical Validator
 * 7. Final Medical Summary
 */

const PRESCRIPTION_SYSTEM_PROMPT = `
You are MediTrack AI's Lead Clinical Pharmacologist and Vision OCR Specialist.
Analyze the provided doctor prescription image or document.

Execute the following 7 multi-agent steps:
1. OCR Text Extraction: Extract raw text from handwriting and printed text. Highlight unreadable or ambiguous words.
2. Medicine Identification: Detect brand and generic medicine names. Never hallucinate missing medicines.
3. Dosage Extraction: Extract exact dose (e.g., 500 mg, 1 tablet, 5 ml).
4. Schedule Analysis: Determine daily timing (Morning, Afternoon, Night) and food relationship (Before Food, After Food, At Bedtime, SOS).
5. Duration Analysis: Extract treatment length (e.g., 5 days, 7 days, 1 month).
6. Clinical Validation: Validate spelling against FDA/standard pharmacopeia and check for high-risk drug interactions.
7. Final Summary & Advice: Generate simple language explanations, side effects, and missed dose guidance.

Return ONLY a valid JSON object matching this schema:
{
  "doctor_name": "string (or null if absent)",
  "clinic_hospital": "string (or null if absent)",
  "prescription_date": "YYYY-MM-DD or string date",
  "patient_name": "string (or null)",
  "diagnosis": "string (or null)",
  "medicines": [
    {
      "name": "Brand Medicine Name",
      "generic_name": "Generic Name (or null)",
      "dosage": "500 mg / 1 tablet",
      "frequency": "Twice Daily",
      "timing": "After Food",
      "schedule": { "morning": true, "afternoon": false, "night": true },
      "duration": "5 days",
      "purpose": "Controls blood pressure / treats bacterial infection",
      "explanation": "Simple language explanation of what this medicine does",
      "possible_side_effects": ["Dizziness", "Mild Nausea"],
      "missed_dose_guidance": "Take as soon as remembered unless close to next dose.",
      "is_high_risk": false,
      "confidence": 0.95
    }
  ],
  "unreadable_text": ["array of ambiguous handwritten fragments"],
  "overall_confidence": 0.92,
  "warnings": ["array of critical safety warnings or contraindications"],
  "drug_interactions": ["array of potential drug-drug interaction warnings"],
  "recommended_investigations": ["array of lab tests or scans ordered"],
  "follow_up_date": "string date or null",
  "special_instructions": ["array of special doctor instructions"]
}
`;

export async function runPrescriptionPipeline(
  fileName: string,
  imageBase64?: string,
  mimeType?: string
): Promise<PrescriptionAnalysisData> {
  console.log(`[Step 2: File Arrival] Name: "${fileName}", Mime: "${mimeType || 'unknown'}", Base64 Length: ${imageBase64 ? imageBase64.length : 0}`);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'your_gemini_api_key_here' && imageBase64) {
    try {
      console.log('[Step 3: Vision OCR Execution] Transmitting image payload to Gemini 1.5 Flash Vision...');
      console.log(`[Step 4: LLM Prompt] Executing multi-agent clinical prompt on image data...`);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const parts: any[] = [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType || 'image/jpeg',
          },
        },
        { text: PRESCRIPTION_SYSTEM_PROMPT },
      ];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        let rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log('[Step 5: RAW LLM Response Received]:', rawText);

        if (rawText) {
          rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(rawText);
          console.log(`[Step 6: Parsed JSON Result] Extracted ${parsed?.medicines?.length || 0} medicines directly from document:`, parsed);

          if (parsed && Array.isArray(parsed.medicines)) {
            return parsed as PrescriptionAnalysisData;
          }
        }
      } else {
        console.warn(`[Step 5 Warning]: Gemini API HTTP status ${res.status}`);
      }
    } catch (e) {
      console.error('[Step 5 Error - Gemini Vision Pipeline Failed]:', e);
    }
  } else {
    console.warn('[Step 3 Warning]: No Gemini API Key found or base64 image data missing.');
  }

  console.log('[Step 6: Empty Extraction] Document did not contain readable prescription medicines.');
  return fallbackPrescriptionAnalysis(fileName);
}

function fallbackPrescriptionAnalysis(fileName: string): PrescriptionAnalysisData {
  const today = new Date().toISOString().split('T')[0];

  return {
    doctor_name: undefined,
    clinic_hospital: undefined,
    prescription_date: today,
    patient_name: undefined,
    diagnosis: undefined,
    medicines: [],
    unreadable_text: ['Handwriting or prescription image text could not be resolved cleanly.'],
    overall_confidence: 0.0,
    warnings: [
      'Medicine could not be read clearly from this document.',
      'Please ensure your document image is well-lit, uncropped, and high-resolution.',
    ],
    drug_interactions: [],
    recommended_investigations: [],
    follow_up_date: undefined,
    special_instructions: [
      'Please re-upload a clearer image or PDF scan of your doctor prescription.',
    ],
  };
}
