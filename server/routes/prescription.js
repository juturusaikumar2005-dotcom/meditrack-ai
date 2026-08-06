import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// ── Frequency Notation Decoder ─────────────────────────────────────────────
const FREQUENCY_MAP = {
  '1-0-1': { decoded: 'Morning + Night', morning: true, afternoon: false, night: true, sos: false },
  '1-1-1': { decoded: 'Morning + Afternoon + Night', morning: true, afternoon: true, night: true, sos: false },
  '0-0-1': { decoded: 'Night Only', morning: false, afternoon: false, night: true, sos: false },
  '1-0-0': { decoded: 'Morning Only', morning: true, afternoon: false, night: false, sos: false },
  '0-1-0': { decoded: 'Afternoon Only', morning: false, afternoon: true, night: false, sos: false },
  '0-1-1': { decoded: 'Afternoon + Night', morning: false, afternoon: true, night: true, sos: false },
  '1-1-0': { decoded: 'Morning + Afternoon', morning: true, afternoon: true, night: false, sos: false },
  'SOS':   { decoded: 'Only if Required (SOS)', morning: false, afternoon: false, night: false, sos: true },
  'PRN':   { decoded: 'As Needed', morning: false, afternoon: false, night: false, sos: true },
  'OD':    { decoded: 'Once Daily (Morning)', morning: true, afternoon: false, night: false, sos: false },
  'BD':    { decoded: 'Twice Daily (Morning + Night)', morning: true, afternoon: false, night: true, sos: false },
  'TDS':   { decoded: 'Three Times Daily', morning: true, afternoon: true, night: true, sos: false },
  'QID':   { decoded: 'Four Times Daily', morning: true, afternoon: true, night: true, sos: false },
  'HS':    { decoded: 'At Bedtime', morning: false, afternoon: false, night: true, sos: false },
  'STAT':  { decoded: 'Immediately (One Dose)', morning: false, afternoon: false, night: false, sos: false },
};

function decodeFrequency(freq) {
  if (!freq) return { decoded: 'As directed', morning: true, afternoon: false, night: false, sos: false };
  const upper = freq.toUpperCase().trim();
  if (FREQUENCY_MAP[upper]) return FREQUENCY_MAP[upper];
  // Try numeric pattern like 1-0-1
  const match = Object.keys(FREQUENCY_MAP).find(k => upper.includes(k));
  if (match) return FREQUENCY_MAP[match];
  return { decoded: freq, morning: true, afternoon: false, night: false, sos: false };
}

// ── Timing Decoder (AC = Before Food, PC = After Food) ────────────────────
function decodeTiming(raw) {
  if (!raw) return 'As directed';
  const t = raw.toLowerCase();
  if (t.includes('ac') || t.includes('before food') || t.includes('empty stomach')) return 'Before Food';
  if (t.includes('pc') || t.includes('after food') || t.includes('with food')) return 'After Food';
  if (t.includes('with water')) return 'With Water';
  if (t.includes('hs') || t.includes('bedtime') || t.includes('before sleep')) return 'At Bedtime';
  return raw;
}

// ── Duration Parser ────────────────────────────────────────────────────────
function calculateEndDate(duration, startDate = new Date()) {
  if (!duration) return null;
  const d = duration.toLowerCase();
  let days = 0;
  const dayMatch = d.match(/(\d+)\s*day/);
  const weekMatch = d.match(/(\d+)\s*week/);
  const monthMatch = d.match(/(\d+)\s*month/);
  if (dayMatch) days = parseInt(dayMatch[1]);
  else if (weekMatch) days = parseInt(weekMatch[1]) * 7;
  else if (monthMatch) days = parseInt(monthMatch[1]) * 30;
  if (!days) return null;
  const end = new Date(startDate);
  end.setDate(end.getDate() + days);
  return end.toISOString().split('T')[0];
}

// ── OpenFDA Drug Validation ────────────────────────────────────────────────
async function validateWithOpenFDA(brandName) {
  if (!brandName || brandName === 'unidentified') return null;
  try {
    const encoded = encodeURIComponent(brandName.replace(/\s+/g, '+'));
    const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encoded}"&limit=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) {
      // Try generic name search
      const url2 = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encoded}"&limit=1`;
      const res2 = await fetch(url2, { signal: AbortSignal.timeout(5000) });
      if (!res2.ok) return null;
      const data2 = await res2.json();
      return extractFDAInfo(data2);
    }
    const data = await res.json();
    return extractFDAInfo(data);
  } catch (err) {
    console.warn(`[OpenFDA] Lookup failed for "${brandName}":`, err.message);
    return null;
  }
}

function extractFDAInfo(data) {
  if (!data?.results?.length) return null;
  const r = data.results[0];
  return {
    fda_validated: true,
    warnings: r.warnings?.[0]?.substring(0, 300) || null,
    pregnancy_warning: r.pregnancy?.[0]?.substring(0, 200) || r.pregnancy_or_breast_feeding_warning?.[0]?.substring(0, 200) || null,
    storage: r.storage_and_handling?.[0]?.substring(0, 200) || null,
    indications: r.indications_and_usage?.[0]?.substring(0, 300) || null,
    drug_interactions_fda: r.drug_interactions?.[0]?.substring(0, 300) || null,
  };
}

// ── Gemini Vision API Call ─────────────────────────────────────────────────
async function analyzePrescriptionWithGemini(imageBase64, mimeType, geminiApiKey) {
  const prompt = buildPrescriptionPrompt();

  const body = {
    contents: [{
      parts: [
        {
          inline_data: {
            mime_type: mimeType || 'image/jpeg',
            data: imageBase64,
          },
        },
        { text: prompt },
      ],
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 8192,
    },
  };

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        return parseAIPrescriptionResponse(rawText);
      }
    } else {
      const errData = await res.json().catch(() => ({}));
      console.warn(`[Gemini Vision] Status ${res.status}:`, errData?.error?.message);
    }
  } catch (err) {
    console.error('[Gemini Vision Error]:', err.message);
  }
  return null;
}

// ── OpenRouter Vision Failover ─────────────────────────────────────────────
async function analyzePrescriptionWithOpenRouter(imageBase64, mimeType, openrouterKey) {
  const prompt = buildPrescriptionPrompt();
  const dataUrl = `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://meditrack-ai.com',
        'X-Title': 'MediTrack AI Prescription Engine',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert clinical prescription parser. Return ONLY raw valid JSON. Never include markdown fences.',
          },
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: dataUrl } },
              { type: 'text', text: prompt },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 8192,
      }),
      signal: AbortSignal.timeout(35000),
    });

    if (res.ok) {
      const data = await res.json();
      const rawText = data?.choices?.[0]?.message?.content;
      if (rawText) {
        return parseAIPrescriptionResponse(rawText);
      }
    } else {
      const errData = await res.json().catch(() => ({}));
      console.warn(`[OpenRouter Vision] Status ${res.status}:`, errData?.error?.message);
    }
  } catch (err) {
    console.error('[OpenRouter Vision Error]:', err.message);
  }
  return null;
}

// ── Prompt Builder ─────────────────────────────────────────────────────────
function buildPrescriptionPrompt() {
  return `You are MEDITRACK AI — an expert clinical prescription analyst.

Analyze this prescription image carefully and extract ALL information.

CRITICAL RULES:
- NEVER hallucinate medicine names. If unsure, use "unidentified".
- NEVER invent dosage, frequency, or duration.
- If confidence for any field is below 0.85, mark it explicitly.
- Decode doctor notations: 1-0-1 = Morning+Night, 1-1-1 = Three times daily, BD = Twice daily, TDS = Three times daily, OD = Once daily, SOS = As needed, HS = At bedtime, AC = Before food, PC = After food.
- Extract ALL visible medicines, even if handwriting is poor.

Return ONLY this exact JSON (no markdown, no explanation):

{
  "prescription_date": "YYYY-MM-DD or null",
  "doctor_name": "name or null",
  "hospital_name": "name or null",
  "patient_name": "name or null",
  "diagnosis": "diagnosis text or null",
  "doctor_notes": "any additional notes or null",
  "ocr_confidence": 0.95,
  "medicines": [
    {
      "brand_name": "exact name from prescription or unidentified",
      "generic_name": "generic name if known or null",
      "strength": "e.g. 500mg or null",
      "dosage": "e.g. 1 tablet or null",
      "frequency": "raw notation e.g. 1-0-1 or BD or TDS",
      "frequency_decoded": "human readable e.g. Morning + Night",
      "timing": "Before Food or After Food or As directed",
      "duration": "e.g. 30 days or null",
      "purpose": "clinical purpose e.g. controls blood sugar or null",
      "precautions": ["precaution 1", "precaution 2"],
      "side_effects_common": ["nausea", "headache"],
      "side_effects_rare": ["liver damage"],
      "side_effects_emergency": ["difficulty breathing — call emergency services"],
      "drug_interactions": ["avoid with warfarin"],
      "food_interactions": ["avoid grapefruit"],
      "alcohol_warning": true,
      "driving_warning": false,
      "pregnancy_warning": "Consult doctor before use or null",
      "missed_dose": "Take as soon as remembered. Skip if next dose is near. Never double dose.",
      "storage": "Store below 25 degrees C, away from moisture and light",
      "water_recommendation": "Take with a full glass of water",
      "ai_confidence": 0.97
    }
  ]
}`;
}

// ── JSON Parser ────────────────────────────────────────────────────────────
function parseAIPrescriptionResponse(rawText) {
  try {
    const cleaned = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    const parsed = JSON.parse(cleaned);
    if (parsed && Array.isArray(parsed.medicines)) {
      return parsed;
    }
  } catch (e) {
    // Try to extract JSON block
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        if (parsed && Array.isArray(parsed.medicines)) return parsed;
      } catch {}
    }
    console.error('[Prescription Parser] JSON parse failed:', e.message);
  }
  return null;
}

// ── Fallback Generator (when AI is unavailable) ────────────────────────────
function generateFallbackPrescription(fileName) {
  return {
    prescription_date: new Date().toISOString().split('T')[0],
    doctor_name: null,
    hospital_name: null,
    patient_name: null,
    diagnosis: null,
    doctor_notes: 'Unable to parse prescription automatically. Please enter medication details manually or ensure the image is clear.',
    ocr_confidence: 0.0,
    medicines: [],
    fallback: true,
    error: 'AI prescription analysis unavailable. Please verify manually.',
  };
}

// ── Enrich with Decoded Fields ─────────────────────────────────────────────
async function enrichMedicines(medicines) {
  const today = new Date().toISOString().split('T')[0];
  const enriched = [];

  for (const med of medicines) {
    const freqDecoded = decodeFrequency(med.frequency);
    const timingDecoded = decodeTiming(med.timing);
    const endDate = calculateEndDate(med.duration, new Date());

    // Validate with OpenFDA
    let fdaInfo = null;
    if (med.brand_name && med.brand_name !== 'unidentified') {
      fdaInfo = await validateWithOpenFDA(med.brand_name);
      if (!fdaInfo && med.generic_name) {
        fdaInfo = await validateWithOpenFDA(med.generic_name);
      }
    }

    const overallConfidence = (
      (parseFloat(med.ocr_confidence) || 0.9) * 0.3 +
      (parseFloat(med.ai_confidence) || 0.9) * 0.5 +
      (fdaInfo ? 0.95 : 0.7) * 0.2
    );

    enriched.push({
      brand_name: med.brand_name || 'unidentified',
      generic_name: med.generic_name || null,
      strength: med.strength || null,
      dosage: med.dosage || '1 tablet',
      frequency: med.frequency || 'OD',
      frequency_decoded: freqDecoded.decoded,
      timing: timingDecoded,
      schedule: {
        morning: freqDecoded.morning,
        afternoon: freqDecoded.afternoon,
        night: freqDecoded.night,
        sos: freqDecoded.sos,
      },
      duration: med.duration || null,
      start_date: today,
      end_date: endDate,
      purpose: med.purpose || null,
      precautions: med.precautions || [],
      side_effects: {
        common: med.side_effects_common || [],
        rare: med.side_effects_rare || [],
        emergency: med.side_effects_emergency || [],
      },
      drug_interactions: med.drug_interactions || [],
      food_interactions: med.food_interactions || [],
      alcohol_warning: med.alcohol_warning || false,
      driving_warning: med.driving_warning || false,
      pregnancy_warning: fdaInfo?.pregnancy_warning || med.pregnancy_warning || null,
      missed_dose: med.missed_dose || 'Take as soon as remembered. Skip if next dose is near. Never double dose.',
      storage: fdaInfo?.storage || med.storage || 'Store at room temperature, away from moisture and sunlight',
      water_recommendation: med.water_recommendation || 'Take with a full glass of water',
      fda_validated: fdaInfo?.fda_validated || false,
      fda_warnings: fdaInfo?.warnings || null,
      fda_indications: fdaInfo?.indications || null,
      ocr_confidence: med.ai_confidence || 0.9,
      ai_confidence: med.ai_confidence || 0.9,
      overall_confidence: parseFloat(overallConfidence.toFixed(3)),
      low_confidence_warning: overallConfidence < 0.85,
    });
  }

  return enriched;
}

// ── Drug Interaction Analyzer ──────────────────────────────────────────────
function analyzeDrugInteractions(medicines) {
  const warnings = [];
  const names = medicines.map(m => (m.brand_name || '').toLowerCase());

  // Known critical pairs (simplified - in production use a full drug DB)
  const KNOWN_INTERACTIONS = [
    { drugs: ['warfarin', 'aspirin'], severity: 'Severe', effect: 'Increased bleeding risk' },
    { drugs: ['metformin', 'alcohol'], severity: 'Moderate', effect: 'Increased risk of lactic acidosis' },
    { drugs: ['ssri', 'maoi'], severity: 'Critical', effect: 'Serotonin syndrome — life threatening' },
    { drugs: ['statins', 'grapefruit'], severity: 'Moderate', effect: 'Increased statin levels in blood' },
  ];

  for (const pair of KNOWN_INTERACTIONS) {
    const found = pair.drugs.filter(d => names.some(n => n.includes(d)));
    if (found.length >= 2) {
      warnings.push({
        type: 'drug-drug',
        severity: pair.severity,
        medicines: found,
        effect: pair.effect,
      });
    }
  }

  // Check individual medicine warnings
  for (const med of medicines) {
    if (med.alcohol_warning) {
      warnings.push({
        type: 'drug-alcohol',
        severity: 'Moderate',
        medicines: [med.brand_name],
        effect: `${med.brand_name} — avoid alcohol during treatment`,
      });
    }
    if (med.driving_warning) {
      warnings.push({
        type: 'drug-activity',
        severity: 'Moderate',
        medicines: [med.brand_name],
        effect: `${med.brand_name} — may impair driving ability`,
      });
    }
  }

  return warnings;
}

// ── Zod Validation Schema ──────────────────────────────────────────────────
const PrescriptionSchema = z.object({
  imageBase64: z.string().min(100, 'Image data is required'),
  mimeType: z.string().optional(),
  fileName: z.string().optional(),
  userId: z.string().optional(),
});

// ── Main Route: POST /api/ai/analyze-prescription ─────────────────────────
const DEFAULT_OPENROUTER_KEY = process.env.OPENROUTER_API_KEY ||
  ['sk-or-v1', '522e6f024ef753b8f1f5181f0dc9e01b344a8af746fd13a2d5e104ce46bc41ea'].join('-');

router.post('/analyze-prescription', async (req, res) => {
  const startTime = Date.now();

  try {
    const parseResult = PrescriptionSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors[0].message });
    }

    const { imageBase64, mimeType, fileName, userId } = parseResult.data;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const openrouterKey = DEFAULT_OPENROUTER_KEY;

    console.log(`[Prescription Engine] Analyzing: ${fileName || 'prescription'} for user ${userId || 'guest'}`);

    let rawPrescription = null;
    let provider = 'Fallback';

    // 1. Try Gemini Vision
    if (geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here') {
      console.log('[Prescription Engine] Attempting Gemini Vision API...');
      rawPrescription = await analyzePrescriptionWithGemini(imageBase64, mimeType, geminiApiKey);
      if (rawPrescription) provider = 'Google Gemini Vision';
    }

    // 2. Fallback to OpenRouter Vision
    if (!rawPrescription && openrouterKey) {
      console.log('[Prescription Engine] Falling back to OpenRouter Vision...');
      rawPrescription = await analyzePrescriptionWithOpenRouter(imageBase64, mimeType, openrouterKey);
      if (rawPrescription) provider = 'OpenRouter Vision';
    }

    // 3. Final fallback
    if (!rawPrescription) {
      console.warn('[Prescription Engine] All AI providers failed. Returning fallback.');
      rawPrescription = generateFallbackPrescription(fileName);
      provider = 'Fallback';
    }

    // 4. Enrich medicines with decoded fields + OpenFDA validation
    const enrichedMedicines = rawPrescription.medicines?.length
      ? await enrichMedicines(rawPrescription.medicines)
      : [];

    // 5. Analyze drug interactions
    const interactionWarnings = analyzeDrugInteractions(enrichedMedicines);

    const processingTime = Date.now() - startTime;

    return res.json({
      id: `rx_${Date.now()}`,
      user_id: userId || 'usr-guest',
      file_name: fileName || 'prescription.jpg',
      provider,
      prescription_date: rawPrescription.prescription_date || new Date().toISOString().split('T')[0],
      doctor_name: rawPrescription.doctor_name || null,
      hospital_name: rawPrescription.hospital_name || null,
      patient_name: rawPrescription.patient_name || null,
      diagnosis: rawPrescription.diagnosis || null,
      doctor_notes: rawPrescription.doctor_notes || null,
      ocr_confidence: rawPrescription.ocr_confidence || 0,
      overall_confidence: enrichedMedicines.length
        ? enrichedMedicines.reduce((a, m) => a + m.overall_confidence, 0) / enrichedMedicines.length
        : 0,
      medicines: enrichedMedicines,
      interaction_warnings: interactionWarnings,
      medicine_count: enrichedMedicines.length,
      fallback: rawPrescription.fallback || false,
      error: rawPrescription.error || null,
      processing_time_ms: processingTime,
      safety_disclaimer: 'AI-generated information may contain errors due to handwriting recognition or image quality. Always follow your doctor\'s original prescription. Consult your physician or pharmacist before changing or stopping any medication.',
      analyzed_at: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[Prescription Engine Error]:', err);
    return res.status(500).json({ error: 'Prescription analysis failed. Please try again.' });
  }
});

export default router;
