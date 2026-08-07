/**
 * Specialized Multi-Pipeline Medical Document Classifier & Specialized AI Analyzers
 * 
 * Pipelines:
 * - CBC (Complete Blood Count) Analyzer
 * - LFT (Liver Function Test) Analyzer
 * - KFT (Kidney Function Test) Analyzer
 * - Lipid Profile Analyzer
 * - Radiology (MRI / CT / X-Ray / PET) Analyzer
 * - Discharge Summary & General Lab Analyzer
 */

export type DocumentCategory =
  | 'CBC'
  | 'LFT'
  | 'KFT'
  | 'Lipid Profile'
  | 'Thyroid'
  | 'HbA1c'
  | 'Vitamin Panel'
  | 'Radiology'
  | 'Prescription'
  | 'Discharge Summary'
  | 'General Lab';

export function classifyDocumentType(fileName: string = '', reportType: string = ''): DocumentCategory {
  const name = (fileName + ' ' + reportType).toLowerCase();

  if (name.includes('cbc') || name.includes('blood count') || name.includes('hemogram') || name.includes('wbc') || name.includes('platelet')) {
    return 'CBC';
  }
  if (name.includes('lft') || name.includes('liver') || name.includes('sgpt') || name.includes('sgot') || name.includes('bilirubin')) {
    return 'LFT';
  }
  if (name.includes('kft') || name.includes('kidney') || name.includes('creatinine') || name.includes('bun') || name.includes('egfr') || name.includes('renal')) {
    return 'KFT';
  }
  if (name.includes('lipid') || name.includes('cholesterol') || name.includes('triglyceride') || name.includes('hdl') || name.includes('ldl')) {
    return 'Lipid Profile';
  }
  if (name.includes('thyroid') || name.includes('tsh') || name.includes('t3') || name.includes('t4')) {
    return 'Thyroid';
  }
  if (name.includes('hba1c') || name.includes('glycated') || name.includes('sugar') || name.includes('glucose')) {
    return 'HbA1c';
  }
  if (name.includes('mri') || name.includes('ct') || name.includes('x-ray') || name.includes('xray') || name.includes('pet') || name.includes('scan') || name.includes('imaging')) {
    return 'Radiology';
  }
  if (name.includes('prescription') || name.includes('rx') || name.includes('doctor note')) {
    return 'Prescription';
  }
  if (name.includes('discharge') || name.includes('summary') || name.includes('admission')) {
    return 'Discharge Summary';
  }

  return 'General Lab';
}

export function getSpecializedPrompt(category: DocumentCategory): string {
  switch (category) {
    case 'CBC':
      return `You are a Specialist Hematologist AI. Analyze the provided CBC (Complete Blood Count) report image/PDF.
Extract EVERY visible hematological biomarker (Hemoglobin, RBC, WBC, Platelets, Hematocrit, MCV, MCH, MCHC, RDW, Neutrophils, Lymphocytes, Monocytes, Eosinophils, Basophils).
For every biomarker: extract exact numeric value, unit, reference range, status (normal, high, low, critical), and clinical meaning.
Return ONLY structured JSON:
{
  "document_type": "CBC (Complete Blood Count)",
  "summary": "Specific hematological summary based ONLY on extracted CBC values.",
  "biomarkers": [
    {
      "name": "Biomarker Name",
      "value": "13.5",
      "unit": "g/dL",
      "reference": "12.0 - 15.5",
      "status": "normal",
      "meaning": "Clinical implication of this specific CBC parameter",
      "recommendation": "Specific advice"
    }
  ],
  "organ_scores": [
    { "organ": "Blood & Oxygen Capacity", "score": 95, "status": "Optimal", "detail": "Hemoglobin & Hematocrit levels" },
    { "organ": "Immune Response System", "score": 92, "status": "Optimal", "detail": "WBC differential count" },
    { "organ": "Coagulation & Platelet Status", "score": 90, "status": "Optimal", "detail": "Platelet count" }
  ],
  "overall_score": 93,
  "recommendations": ["Array of specific hematology recommendations based on findings"]
}`;

    case 'LFT':
      return `You are a Specialist Hepatologist AI. Analyze the provided LFT (Liver Function Test) report image/PDF.
Extract EVERY visible liver enzyme and protein (SGPT/ALT, SGOT/AST, Total Bilirubin, Direct Bilirubin, Alkaline Phosphatase ALP, Serum Albumin, Serum Globulin, A/G Ratio, GGT).
For every biomarker: extract exact value, unit, reference range, status, and clinical meaning.
Return ONLY structured JSON:
{
  "document_type": "LFT (Liver Function Test)",
  "summary": "Hepatic function summary based ONLY on extracted liver enzymes and proteins.",
  "biomarkers": [ ... ],
  "organ_scores": [
    { "organ": "Hepatic Enzyme Activity", "score": 90, "status": "Optimal", "detail": "SGPT & SGOT levels" },
    { "organ": "Bilirubin & Excretory Function", "score": 94, "status": "Optimal", "detail": "Total & Direct Bilirubin" },
    { "organ": "Protein Synthesis", "score": 92, "status": "Optimal", "detail": "Serum Albumin & Globulin" }
  ],
  "overall_score": 92,
  "recommendations": ["Array of hepatic health recommendations"]
}`;

    case 'KFT':
      return `You are a Specialist Nephrologist AI. Analyze the provided KFT (Kidney Function Test) report image/PDF.
Extract EVERY renal biomarker (Serum Creatinine, Blood Urea Nitrogen BUN, eGFR, Uric Acid, Serum Sodium, Potassium, Chloride, Calcium).
Return ONLY structured JSON with exact values, units, reference ranges, organ scores for Renal Filtration & Electrolytes, overall score, and recommendations.`;

    case 'Lipid Profile':
      return `You are a Specialist Preventive Cardiologist AI. Analyze the provided Lipid Profile report image/PDF.
Extract EVERY lipid parameter (Total Cholesterol, Triglycerides, HDL Cholesterol, LDL Cholesterol, VLDL Cholesterol, Total/HDL Ratio).
Return ONLY structured JSON with exact values, units, reference ranges, organ scores for Cardiovascular & Lipid Status, overall score, and recommendations.`;

    case 'Radiology':
      return `You are a Specialist Radiologist AI. Analyze the provided MRI / CT / X-Ray imaging scan report.
Extract patient info, study type, anatomical region, technique, detailed findings, and final radiologist impression.
Return ONLY structured JSON:
{
  "document_type": "Radiology Imaging Scan",
  "summary": "Detailed radiologist summary of structural findings.",
  "biomarkers": [
    {
      "name": "Anatomical Structure",
      "value": "Normal / Abnormal Finding",
      "unit": "Interpretation",
      "reference": "Unremarkable",
      "status": "normal",
      "meaning": "Detailed radiologist description of finding",
      "recommendation": "Follow-up clinical correlation"
    }
  ],
  "organ_scores": [
    { "organ": "Structural Integrity", "score": 95, "status": "Optimal", "detail": "No focal lesions or cortical break" }
  ],
  "overall_score": 95,
  "recommendations": ["Specific clinical or orthopedic follow-up recommendations"]
}`;

    default:
      return `You are MediTrack AI's Lead Diagnostic Intelligence Specialist. Analyze the provided medical report.
Extract EVERY visible laboratory test, measurement, reference range, unit, patient data, and doctor notes.
Do NOT invent test results. If 10 biomarkers are present, return 10. If 4 are present, return 4.
Return ONLY structured JSON:
{
  "document_type": "Diagnostic Report",
  "summary": "Clinical summary of extracted diagnostic findings.",
  "biomarkers": [
    {
      "name": "Biomarker Name",
      "value": "Value",
      "unit": "Unit",
      "reference": "Range",
      "status": "normal|high|low|critical",
      "meaning": "Clinical implication",
      "recommendation": "Guidance"
    }
  ],
  "organ_scores": [],
  "overall_score": 90,
  "recommendations": []
}`;
  }
}
