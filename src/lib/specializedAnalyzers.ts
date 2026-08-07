/**
 * Specialized Multi-Pipeline Medical Document Classifier & Specialized AI Vision Prompts
 * (Google Health / Microsoft Nuance Clinical Precision Standard)
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
  if (name.includes('hba1c') || name.includes('glycated') || name.includes('sugar') || name.includes('glucose') || name.includes('diabetes')) {
    return 'HbA1c';
  }
  if (name.includes('vitamin') || name.includes('b12') || name.includes('vit d') || name.includes('ferritin') || name.includes('iron')) {
    return 'Vitamin Panel';
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
  const BASE_SCHEMA = `
Return ONLY valid JSON matching this schema:
{
  "document_type": "string (e.g. CBC, LFT, Lipid Profile, Radiology)",
  "patient_name": "string (or null)",
  "lab_hospital_name": "string (or null)",
  "report_date": "YYYY-MM-DD (or string)",
  "summary": "Full clinical summary based ONLY on extracted values. 2-4 sentences explaining patient condition.",
  "confidence_score": 98.0,
  "risk_level": "Optimal | Mild | Moderate | High Risk",
  "recommended_specialist": "Physician Specialty (e.g., Hematologist, Cardiologist, Endocrinologist)",
  "recommended_specialist_reason": "Clinical justification for this specialist",
  "biomarkers": [
    {
      "name": "Exact Biomarker Test Name",
      "value": "13.5",
      "numeric_value": 13.5,
      "unit": "g/dL",
      "normal_range": "12.0 - 15.5",
      "status": "Normal | High | Low | Critical",
      "severity": "optimal | attention | critical",
      "category": "${category}",
      "explanation": "Simple language explanation of what this test measures and what this value means.",
      "recommendation": "Specific clinical or lifestyle recommendation"
    }
  ],
  "key_findings": ["Array of critical extracted clinical observations"],
  "recommendations": ["Array of specific medical follow-up actions"],
  "lifestyle_recommendations": ["Array of dietary, exercise, or lifestyle habits"]
}
`;

  switch (category) {
    case 'CBC':
      return `You are MediTrack AI's Lead Clinical Hematologist. Analyze the provided CBC (Complete Blood Count) report.
Extract EVERY visible biomarker: Hemoglobin, RBC, WBC, Platelets, Hematocrit (HCT), MCV, MCH, MCHC, RDW, Neutrophils, Lymphocytes, Monocytes, Eosinophils, Basophils, Absolute Neutrophil Count (ANC).
Extract exact test values, units, reference ranges, and evaluate if values indicate anemia, infection, inflammation, or clotting abnormalities.
${BASE_SCHEMA}`;

    case 'LFT':
      return `You are MediTrack AI's Lead Hepatologist. Analyze the provided LFT (Liver Function Test) report.
Extract EVERY visible biomarker: SGPT (ALT), SGOT (AST), Total Bilirubin, Direct Bilirubin, Indirect Bilirubin, Alkaline Phosphatase (ALP), Total Protein, Serum Albumin, Serum Globulin, A/G Ratio, GGT.
Evaluate liver enzyme elevation, biliary flow, and synthetic liver capacity.
${BASE_SCHEMA}`;

    case 'KFT':
      return `You are MediTrack AI's Lead Nephrologist. Analyze the provided KFT (Kidney Function Test / Renal Panel) report.
Extract EVERY visible biomarker: Serum Creatinine, Blood Urea Nitrogen (BUN), eGFR (Estimated Glomerular Filtration Rate), Serum Uric Acid, Sodium, Potassium, Chloride, Calcium, Phosphorus.
Evaluate renal clearance, electrolyte balance, and filtration capacity.
${BASE_SCHEMA}`;

    case 'Lipid Profile':
      return `You are MediTrack AI's Lead Preventive Cardiologist. Analyze the provided Lipid Profile report.
Extract EVERY lipid parameter: Total Cholesterol, Triglycerides, HDL Cholesterol, LDL Cholesterol, VLDL Cholesterol, Non-HDL Cholesterol, Total/HDL Ratio, Triglyceride/HDL Ratio.
Assess cardiovascular risk stratification and atherogenic lipoprotein burden.
${BASE_SCHEMA}`;

    case 'Thyroid':
      return `You are MediTrack AI's Lead Endocrinologist. Analyze the provided Thyroid Panel report.
Extract EVERY thyroid biomarker: TSH (Thyroid Stimulating Hormone), Total T3, Total T4, Free T3, Free T4, Anti-TPO Antibodies, Anti-Thyroglobulin Antibodies.
Evaluate for hypothyroidism, hyperthyroidism, or autoimmune thyroid disease.
${BASE_SCHEMA}`;

    case 'HbA1c':
      return `You are MediTrack AI's Lead Diabetologist & Metabolic Specialist. Analyze the provided Diabetes / Glycemic report.
Extract EVERY biomarker: HbA1c (Glycated Hemoglobin), Fasting Blood Glucose (FBS), Postprandial Blood Glucose (PPBS), Estimated Average Glucose (eAG), Fasting Insulin.
Classify glycemic status: Normal (<5.7%), Prediabetes (5.7%-6.4%), Diabetes (>=6.5%).
${BASE_SCHEMA}`;

    case 'Radiology':
      return `You are MediTrack AI's Lead Consultant Radiologist. Analyze the provided MRI / CT / X-Ray / PET Scan report.
Extract study type, anatomical region, technical protocol, detailed structural findings, and radiologist impression.
Map each structural finding into the "biomarkers" array (e.g. Name: Anatomical Region, Value: Normal / Degenerative / Focal Lesion, Status: Normal/High/Critical).
${BASE_SCHEMA}`;

    default:
      return `You are MediTrack AI's Lead Medical Diagnostic Specialist (Google Health & Nuance Standard). Analyze the provided medical report.
Extract EVERY visible biomarker, laboratory measurement, unit, reference range, patient detail, doctor note, and impression.
Do NOT omit any biomarker. If 15 biomarkers are present, return 15. If 5 are present, return 5.
${BASE_SCHEMA}`;
  }
}
