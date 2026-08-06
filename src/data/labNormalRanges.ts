/**
 * MEDITRACK AI — Medical Lab Values Knowledge Base
 * Phase 3: Structured database of 50+ biomarkers with normal ranges,
 * plain-English explanations, and clinical recommendations.
 * Sources: WHO guidelines, AACC, Indian ICMR reference ranges.
 */

export type ReportCategory =
  | 'CBC' | 'Blood Sugar' | 'Thyroid' | 'Liver' | 'Kidney'
  | 'Lipid' | 'Iron' | 'Vitamin' | 'Urine' | 'Cardiac'
  | 'Inflammatory' | 'Hormone' | 'General';

export type ReportType =
  | 'CBC' | 'Blood Test' | 'Thyroid' | 'LFT' | 'KFT' | 'Urine'
  | 'Lipid Panel' | 'HbA1c' | 'X-Ray' | 'CT' | 'MRI' | 'ECG'
  | 'Discharge' | 'Prescription' | 'Health Check' | 'General';

export interface LabRange {
  key: string;
  name: string;
  aliases: string[];            // alternate names the AI might use
  unit: string;
  category: ReportCategory;
  male?: { min: number; max: number };
  female?: { min: number; max: number };
  universal?: { min: number; max: number };   // gender-independent
  critical_low?: number;
  critical_high?: number;
  description: string;
  meaning_low: string;
  meaning_high: string;
  recommendation: string;
  emoji: string;
}

export interface NormalRangeResult {
  status: 'Normal' | 'Low' | 'High' | 'Borderline Low' | 'Borderline High' | 'Critical Low' | 'Critical High' | 'Unknown';
  severity: 'optimal' | 'warning' | 'attention' | 'critical';
  explanation: string;
  recommendation: string;
  range: { min: number; max: number } | null;
  percentPosition: number | null;   // 0–100, position within range
}

// ── Complete Lab Ranges Database ───────────────────────────────────────────
export const LAB_RANGES: LabRange[] = [

  // ── CBC (Complete Blood Count) ─────────────────────────────────────────
  {
    key: 'hemoglobin', name: 'Hemoglobin', aliases: ['hb', 'hgb', 'haemoglobin'],
    unit: 'g/dL', category: 'CBC', emoji: '🩸',
    male: { min: 13.5, max: 17.5 }, female: { min: 12.0, max: 15.5 },
    critical_low: 7.0, critical_high: 20.0,
    description: 'Oxygen-carrying protein in red blood cells.',
    meaning_low: 'Low hemoglobin may indicate anemia, iron deficiency, blood loss, or nutritional deficiency.',
    meaning_high: 'High hemoglobin may indicate dehydration, polycythemia, or living at high altitude.',
    recommendation: 'Discuss with your doctor. Iron supplementation or further blood tests may be recommended.',
  },
  {
    key: 'rbc', name: 'RBC Count', aliases: ['red blood cells', 'red cell count', 'erythrocytes'],
    unit: 'million/µL', category: 'CBC', emoji: '🔴',
    male: { min: 4.5, max: 5.9 }, female: { min: 4.0, max: 5.2 },
    description: 'Total number of red blood cells carrying oxygen.',
    meaning_low: 'Low RBC count may indicate anemia, bone marrow problems, or nutritional deficiency.',
    meaning_high: 'High RBC count may indicate dehydration or polycythemia vera.',
    recommendation: 'Consult your doctor for further evaluation.',
  },
  {
    key: 'wbc', name: 'WBC Count', aliases: ['white blood cells', 'leucocytes', 'leukocytes', 'tlc'],
    unit: '×10³/µL', category: 'CBC', emoji: '⚪',
    universal: { min: 4.0, max: 11.0 },
    critical_low: 2.0, critical_high: 30.0,
    description: 'Total white blood cell count — measures immune system activity.',
    meaning_low: 'Low WBC (leukopenia) may indicate viral infection, autoimmune disease, or bone marrow suppression.',
    meaning_high: 'High WBC (leukocytosis) may indicate infection, inflammation, stress, or rarely leukemia.',
    recommendation: 'Abnormal WBC requires medical review. Notify your doctor promptly.',
  },
  {
    key: 'platelets', name: 'Platelet Count', aliases: ['plt', 'thrombocytes', 'thrombocyte count'],
    unit: '×10³/µL', category: 'CBC', emoji: '🟣',
    universal: { min: 150, max: 400 },
    critical_low: 50, critical_high: 1000,
    description: 'Platelets help stop bleeding by forming clots.',
    meaning_low: 'Low platelets (thrombocytopenia) increase bleeding risk. May be due to viral infections, dengue, or bone marrow issues.',
    meaning_high: 'High platelets (thrombocytosis) may increase clotting risk. Usually reactive to infection or inflammation.',
    recommendation: 'Discuss with your doctor. Very low platelets require urgent medical attention.',
  },
  {
    key: 'hematocrit', name: 'Hematocrit', aliases: ['hct', 'pcv', 'packed cell volume'],
    unit: '%', category: 'CBC', emoji: '🩸',
    male: { min: 40.7, max: 50.3 }, female: { min: 36.1, max: 44.3 },
    description: 'Percentage of blood volume occupied by red blood cells.',
    meaning_low: 'Low hematocrit suggests anemia or blood loss.',
    meaning_high: 'High hematocrit suggests dehydration or polycythemia.',
    recommendation: 'Correlate with hemoglobin and clinical symptoms. Consult your doctor.',
  },
  {
    key: 'mcv', name: 'MCV', aliases: ['mean corpuscular volume'],
    unit: 'fL', category: 'CBC', emoji: '📏',
    universal: { min: 80, max: 100 },
    description: 'Average size of red blood cells.',
    meaning_low: 'Small RBCs (microcytic) — often iron deficiency or thalassemia.',
    meaning_high: 'Large RBCs (macrocytic) — often B12/folate deficiency or liver disease.',
    recommendation: 'Your doctor may check iron, B12, and folate levels based on this result.',
  },
  {
    key: 'mch', name: 'MCH', aliases: ['mean corpuscular hemoglobin'],
    unit: 'pg', category: 'CBC', emoji: '📊',
    universal: { min: 27, max: 33 },
    description: 'Average amount of hemoglobin per red blood cell.',
    meaning_low: 'Hypochromic — cells have less hemoglobin, often iron deficiency.',
    meaning_high: 'May indicate macrocytic anemia (B12/folate deficiency).',
    recommendation: 'Review with CBC full picture. Consult your doctor.',
  },
  {
    key: 'neutrophils', name: 'Neutrophils', aliases: ['neutrophil count', 'polymorphs', 'pmns'],
    unit: '%', category: 'CBC', emoji: '🛡️',
    universal: { min: 40, max: 70 },
    description: 'Primary immune cells that fight bacterial infections.',
    meaning_low: 'Low neutrophils (neutropenia) increase infection risk.',
    meaning_high: 'High neutrophils suggest bacterial infection, inflammation, or stress.',
    recommendation: 'Correlate with WBC count and symptoms. Discuss with your doctor.',
  },
  {
    key: 'lymphocytes', name: 'Lymphocytes', aliases: ['lymphocyte count'],
    unit: '%', category: 'CBC', emoji: '🔵',
    universal: { min: 20, max: 45 },
    description: 'Immune cells that fight viral infections and produce antibodies.',
    meaning_low: 'Low lymphocytes may indicate HIV, immunodeficiency, or steroid use.',
    meaning_high: 'High lymphocytes may indicate viral infection, mono, or chronic lymphocytic leukemia.',
    recommendation: 'Correlate with clinical symptoms. Consult your doctor.',
  },
  {
    key: 'eosinophils', name: 'Eosinophils', aliases: ['eosinophil count'],
    unit: '%', category: 'CBC', emoji: '🟠',
    universal: { min: 1, max: 6 },
    description: 'White blood cells involved in allergic reactions and parasite defense.',
    meaning_low: 'Rarely significant.',
    meaning_high: 'High eosinophils may indicate allergies, asthma, parasitic infection, or autoimmune disease.',
    recommendation: 'If consistently elevated, discuss with your doctor for allergy or parasitic workup.',
  },

  // ── Blood Sugar ────────────────────────────────────────────────────────
  {
    key: 'fasting_glucose', name: 'Fasting Blood Glucose', aliases: ['fbg', 'fbs', 'fasting sugar', 'fasting blood sugar', 'glucose fasting'],
    unit: 'mg/dL', category: 'Blood Sugar', emoji: '🍬',
    universal: { min: 70, max: 99 },
    critical_low: 50, critical_high: 500,
    description: 'Blood sugar level after 8-12 hours of fasting.',
    meaning_low: 'Low blood sugar (hypoglycemia) — may cause dizziness, sweating. Common in diabetics on medication.',
    meaning_high: 'High fasting sugar (100–125 = prediabetes, ≥126 = possible diabetes).',
    recommendation: 'Consult your doctor. Lifestyle changes (diet, exercise) are recommended for elevated values.',
  },
  {
    key: 'pp_glucose', name: 'Postprandial Blood Glucose', aliases: ['ppbs', 'pp sugar', 'post prandial', 'post meal sugar', '2hr ppbs'],
    unit: 'mg/dL', category: 'Blood Sugar', emoji: '🍽️',
    universal: { min: 70, max: 140 },
    critical_high: 400,
    description: 'Blood sugar measured 2 hours after a meal.',
    meaning_low: 'May indicate reactive hypoglycemia.',
    meaning_high: 'Elevated post-meal sugar (≥200 suggests diabetes) indicates impaired glucose tolerance.',
    recommendation: 'Regular exercise, reduced carbohydrate intake, and medical consultation recommended.',
  },
  {
    key: 'hba1c', name: 'HbA1c', aliases: ['glycated hemoglobin', 'hemoglobin a1c', 'glycosylated hemoglobin', 'a1c'],
    unit: '%', category: 'Blood Sugar', emoji: '📊',
    universal: { min: 4.0, max: 5.6 },
    critical_high: 10.0,
    description: 'Average blood sugar level over the past 2-3 months.',
    meaning_low: 'May indicate hypoglycemia or hemolytic anemia.',
    meaning_high: '5.7–6.4% = Prediabetes, ≥6.5% = Diabetes. Higher values = higher complication risk.',
    recommendation: 'Target HbA1c < 7.0% for diabetics. Lifestyle modification and medical management essential.',
  },
  {
    key: 'random_glucose', name: 'Random Blood Glucose', aliases: ['rbs', 'random blood sugar', 'blood glucose random'],
    unit: 'mg/dL', category: 'Blood Sugar', emoji: '🩸',
    universal: { min: 70, max: 140 },
    critical_high: 500,
    description: 'Blood sugar measured at any time regardless of meals.',
    meaning_low: 'Hypoglycemia — needs immediate attention if below 50.',
    meaning_high: '≥200 with symptoms may indicate diabetes.',
    recommendation: 'Discuss with your doctor, especially if you have symptoms of diabetes.',
  },

  // ── Thyroid Function ───────────────────────────────────────────────────
  {
    key: 'tsh', name: 'TSH', aliases: ['thyroid stimulating hormone', 'thyrotropin'],
    unit: 'mIU/L', category: 'Thyroid', emoji: '🦋',
    universal: { min: 0.4, max: 4.0 },
    critical_low: 0.01, critical_high: 10.0,
    description: 'Hormone that regulates thyroid gland activity.',
    meaning_low: 'Low TSH = overactive thyroid (hyperthyroidism) — may cause weight loss, tremors, palpitations.',
    meaning_high: 'High TSH = underactive thyroid (hypothyroidism) — may cause fatigue, weight gain, cold intolerance.',
    recommendation: 'Abnormal TSH requires thyroid function evaluation. Consult your doctor.',
  },
  {
    key: 't3', name: 'T3 Total', aliases: ['triiodothyronine', 'total t3'],
    unit: 'ng/dL', category: 'Thyroid', emoji: '🦋',
    universal: { min: 80, max: 200 },
    description: 'Active thyroid hormone that regulates metabolism.',
    meaning_low: 'Low T3 may indicate hypothyroidism or severe illness.',
    meaning_high: 'High T3 suggests hyperthyroidism.',
    recommendation: 'Correlate with TSH and T4 for complete thyroid assessment. Consult your doctor.',
  },
  {
    key: 't4', name: 'T4 Total', aliases: ['thyroxine', 'total t4'],
    unit: 'µg/dL', category: 'Thyroid', emoji: '🦋',
    universal: { min: 4.5, max: 12.0 },
    description: 'Thyroid hormone produced by the thyroid gland.',
    meaning_low: 'Low T4 indicates hypothyroidism.',
    meaning_high: 'High T4 indicates hyperthyroidism.',
    recommendation: 'Consult your doctor for thyroid management.',
  },
  {
    key: 'free_t3', name: 'Free T3', aliases: ['ft3', 'free triiodothyronine'],
    unit: 'pg/mL', category: 'Thyroid', emoji: '🦋',
    universal: { min: 2.3, max: 4.2 },
    description: 'Unbound active form of T3 thyroid hormone.',
    meaning_low: 'Low Free T3 may indicate hypothyroidism.',
    meaning_high: 'High Free T3 indicates hyperthyroidism.',
    recommendation: 'Discuss with your doctor for thyroid management.',
  },
  {
    key: 'free_t4', name: 'Free T4', aliases: ['ft4', 'free thyroxine'],
    unit: 'ng/dL', category: 'Thyroid', emoji: '🦋',
    universal: { min: 0.8, max: 1.8 },
    description: 'Unbound active form of T4 thyroid hormone.',
    meaning_low: 'Low Free T4 indicates hypothyroidism.',
    meaning_high: 'High Free T4 indicates hyperthyroidism.',
    recommendation: 'Consult your doctor for appropriate thyroid treatment.',
  },

  // ── Liver Function Tests ───────────────────────────────────────────────
  {
    key: 'sgpt', name: 'SGPT (ALT)', aliases: ['alt', 'alanine aminotransferase', 'alanine transaminase', 'sgpt'],
    unit: 'U/L', category: 'Liver', emoji: '🫀',
    male: { min: 7, max: 40 }, female: { min: 7, max: 35 },
    critical_high: 1000,
    description: 'Liver enzyme — elevated levels indicate liver cell damage.',
    meaning_low: 'Usually not clinically significant.',
    meaning_high: 'High SGPT suggests liver inflammation, fatty liver, viral hepatitis, or alcohol damage.',
    recommendation: 'Avoid alcohol. Consult your doctor. Ultrasound of abdomen may be recommended.',
  },
  {
    key: 'sgot', name: 'SGOT (AST)', aliases: ['ast', 'aspartate aminotransferase', 'sgot'],
    unit: 'U/L', category: 'Liver', emoji: '🫀',
    male: { min: 8, max: 40 }, female: { min: 8, max: 35 },
    critical_high: 1000,
    description: 'Enzyme found in liver and heart muscle.',
    meaning_low: 'Not clinically significant.',
    meaning_high: 'High SGOT suggests liver disease, heart muscle damage, or intense exercise.',
    recommendation: 'Correlate with SGPT and clinical history. Consult your doctor.',
  },
  {
    key: 'alp', name: 'Alkaline Phosphatase (ALP)', aliases: ['alkaline phosphatase', 'alp'],
    unit: 'U/L', category: 'Liver', emoji: '🫀',
    universal: { min: 44, max: 147 },
    description: 'Enzyme related to liver and bone function.',
    meaning_low: 'Low ALP is rarely significant.',
    meaning_high: 'High ALP may indicate liver disease, bile duct obstruction, bone disease, or Paget\'s disease.',
    recommendation: 'Discuss with your doctor for further evaluation.',
  },
  {
    key: 'bilirubin_total', name: 'Total Bilirubin', aliases: ['bilirubin total', 'total bili', 'serum bilirubin'],
    unit: 'mg/dL', category: 'Liver', emoji: '🟡',
    universal: { min: 0.1, max: 1.2 },
    critical_high: 15.0,
    description: 'Breakdown product of red blood cells processed by the liver.',
    meaning_low: 'Not significant.',
    meaning_high: 'High bilirubin (jaundice) may indicate liver disease, bile duct blockage, or hemolytic anemia.',
    recommendation: 'If skin or eyes appear yellow, seek medical attention promptly.',
  },
  {
    key: 'albumin', name: 'Serum Albumin', aliases: ['albumin', 's albumin'],
    unit: 'g/dL', category: 'Liver', emoji: '🫀',
    universal: { min: 3.4, max: 5.4 },
    description: 'Main protein made by the liver — reflects liver and nutritional status.',
    meaning_low: 'Low albumin indicates malnutrition, liver disease, kidney disease, or chronic illness.',
    meaning_high: 'High albumin usually indicates dehydration.',
    recommendation: 'Consult your doctor for nutritional assessment and liver evaluation.',
  },
  {
    key: 'ggt', name: 'GGT', aliases: ['gamma glutamyltransferase', 'gamma gt', 'ggt'],
    unit: 'U/L', category: 'Liver', emoji: '🫀',
    male: { min: 8, max: 61 }, female: { min: 5, max: 36 },
    description: 'Liver enzyme sensitive to alcohol and bile duct disease.',
    meaning_low: 'Not clinically significant.',
    meaning_high: 'High GGT strongly associated with alcohol use, fatty liver, or bile duct disease.',
    recommendation: 'Avoid alcohol. Consult your doctor for liver evaluation.',
  },

  // ── Kidney Function Tests ──────────────────────────────────────────────
  {
    key: 'creatinine', name: 'Serum Creatinine', aliases: ['creatinine', 's creatinine', 'serum creatinine'],
    unit: 'mg/dL', category: 'Kidney', emoji: '🫘',
    male: { min: 0.74, max: 1.35 }, female: { min: 0.59, max: 1.04 },
    critical_high: 10.0,
    description: 'Waste product filtered by kidneys — reflects kidney function.',
    meaning_low: 'Low creatinine may indicate low muscle mass.',
    meaning_high: 'High creatinine indicates impaired kidney function, dehydration, or kidney disease.',
    recommendation: 'Stay well hydrated. Consult your doctor for kidney function evaluation.',
  },
  {
    key: 'bun', name: 'Blood Urea Nitrogen (BUN)', aliases: ['bun', 'urea', 'blood urea', 'serum urea'],
    unit: 'mg/dL', category: 'Kidney', emoji: '🫘',
    universal: { min: 7, max: 20 },
    critical_high: 100,
    description: 'Waste product from protein breakdown filtered by kidneys.',
    meaning_low: 'Low BUN may indicate malnutrition or liver disease.',
    meaning_high: 'High BUN suggests kidney disease, dehydration, or high protein diet.',
    recommendation: 'Adequate hydration is important. Consult your doctor.',
  },
  {
    key: 'uric_acid', name: 'Uric Acid', aliases: ['uric acid', 's uric acid', 'serum uric acid'],
    unit: 'mg/dL', category: 'Kidney', emoji: '🫘',
    male: { min: 3.4, max: 7.0 }, female: { min: 2.4, max: 6.0 },
    description: 'Breakdown product of purines. High levels cause gout.',
    meaning_low: 'Rarely significant.',
    meaning_high: 'High uric acid may cause gout (joint pain/swelling) or kidney stones.',
    recommendation: 'Reduce red meat, organ meats, shellfish, and alcohol. Consult your doctor.',
  },
  {
    key: 'sodium', name: 'Serum Sodium', aliases: ['sodium', 'na+', 'serum sodium', 's sodium'],
    unit: 'mEq/L', category: 'Kidney', emoji: '⚡',
    universal: { min: 136, max: 145 },
    critical_low: 120, critical_high: 160,
    description: 'Electrolyte that regulates fluid balance and nerve function.',
    meaning_low: 'Hyponatremia — may cause confusion, nausea, seizures in severe cases.',
    meaning_high: 'Hypernatremia — usually dehydration.',
    recommendation: 'Maintain adequate fluid intake. Severe abnormalities require urgent medical care.',
  },
  {
    key: 'potassium', name: 'Serum Potassium', aliases: ['potassium', 'k+', 'serum potassium', 's potassium'],
    unit: 'mEq/L', category: 'Kidney', emoji: '⚡',
    universal: { min: 3.5, max: 5.0 },
    critical_low: 2.5, critical_high: 6.5,
    description: 'Electrolyte critical for heart and muscle function.',
    meaning_low: 'Hypokalemia — may cause muscle weakness, cramps, or heart rhythm problems.',
    meaning_high: 'Hyperkalemia — may cause dangerous heart rhythm abnormalities.',
    recommendation: 'Abnormal potassium requires prompt medical attention, especially for heart health.',
  },
  {
    key: 'egfr', name: 'eGFR', aliases: ['egfr', 'estimated gfr', 'glomerular filtration rate'],
    unit: 'mL/min/1.73m²', category: 'Kidney', emoji: '🫘',
    universal: { min: 60, max: 120 },
    critical_low: 15,
    description: 'Estimated kidney filtration rate — measures kidney efficiency.',
    meaning_low: 'Low eGFR indicates kidney disease (< 60 = chronic kidney disease, < 15 = kidney failure).',
    meaning_high: 'Not clinically significant on its own.',
    recommendation: 'Low eGFR requires specialist (Nephrologist) consultation. Protect kidneys with proper hydration and blood pressure control.',
  },

  // ── Lipid Panel ────────────────────────────────────────────────────────
  {
    key: 'total_cholesterol', name: 'Total Cholesterol', aliases: ['total cholesterol', 'cholesterol total', 'serum cholesterol'],
    unit: 'mg/dL', category: 'Lipid', emoji: '💛',
    universal: { min: 0, max: 200 },
    critical_high: 300,
    description: 'Total amount of cholesterol in the blood.',
    meaning_low: 'Very low cholesterol is uncommon but may indicate malnutrition.',
    meaning_high: '200–239 = Borderline high. ≥240 = High. Increases cardiovascular risk.',
    recommendation: 'Reduce saturated fats, trans fats. Increase physical activity. Consult your doctor.',
  },
  {
    key: 'ldl', name: 'LDL Cholesterol', aliases: ['ldl', 'ldl-c', 'low density lipoprotein'],
    unit: 'mg/dL', category: 'Lipid', emoji: '💛',
    universal: { min: 0, max: 100 },
    critical_high: 190,
    description: '"Bad" cholesterol — high levels increase heart disease risk.',
    meaning_low: 'Very low LDL is generally beneficial.',
    meaning_high: '100–129 = Near optimal. 130–159 = Borderline high. ≥160 = High cardiovascular risk.',
    recommendation: 'Diet changes and exercise first. Statins may be prescribed by your doctor if very high.',
  },
  {
    key: 'hdl', name: 'HDL Cholesterol', aliases: ['hdl', 'hdl-c', 'high density lipoprotein'],
    unit: 'mg/dL', category: 'Lipid', emoji: '💚',
    male: { min: 40, max: 60 }, female: { min: 50, max: 60 },
    description: '"Good" cholesterol — higher levels protect against heart disease.',
    meaning_low: 'Low HDL is a cardiovascular risk factor.',
    meaning_high: 'High HDL (>60) is protective against heart disease.',
    recommendation: 'Exercise, omega-3 rich foods, and avoiding smoking can raise HDL.',
  },
  {
    key: 'triglycerides', name: 'Triglycerides', aliases: ['triglycerides', 'tg', 'trigs', 'serum triglycerides'],
    unit: 'mg/dL', category: 'Lipid', emoji: '🟡',
    universal: { min: 0, max: 150 },
    critical_high: 500,
    description: 'Type of fat in the blood. High levels increase heart disease risk.',
    meaning_low: 'Not clinically significant.',
    meaning_high: '150–199 = Borderline high. 200–499 = High. ≥500 = Very high (pancreatitis risk).',
    recommendation: 'Reduce sugar, refined carbs, and alcohol. Exercise regularly. Consult your doctor.',
  },

  // ── Iron Studies ───────────────────────────────────────────────────────
  {
    key: 'ferritin', name: 'Serum Ferritin', aliases: ['ferritin', 's ferritin', 'serum ferritin'],
    unit: 'ng/mL', category: 'Iron', emoji: '🔩',
    male: { min: 24, max: 336 }, female: { min: 11, max: 307 },
    description: 'Protein that stores iron — best indicator of iron body stores.',
    meaning_low: 'Low ferritin = iron deficiency. May cause fatigue, hair loss, poor concentration.',
    meaning_high: 'High ferritin may indicate inflammation, infection, liver disease, or hemochromatosis.',
    recommendation: 'Discuss iron supplementation or further investigation with your doctor.',
  },
  {
    key: 'serum_iron', name: 'Serum Iron', aliases: ['serum iron', 's iron', 'iron'],
    unit: 'µg/dL', category: 'Iron', emoji: '🔩',
    male: { min: 65, max: 175 }, female: { min: 50, max: 170 },
    description: 'Amount of iron circulating in the blood.',
    meaning_low: 'Iron deficiency anemia.',
    meaning_high: 'Iron overload (hemochromatosis) — can damage organs.',
    recommendation: 'Iron supplementation or restriction as directed by your doctor.',
  },

  // ── Vitamins ───────────────────────────────────────────────────────────
  {
    key: 'vitamin_d', name: 'Vitamin D', aliases: ['vitamin d', 'vit d', '25-oh vitamin d', '25-hydroxyvitamin d', 'calcidiol'],
    unit: 'ng/mL', category: 'Vitamin', emoji: '☀️',
    universal: { min: 30, max: 100 },
    critical_low: 10,
    description: 'Fat-soluble vitamin essential for bone health, immunity, and mood.',
    meaning_low: 'Deficiency is extremely common. Can cause bone pain, fatigue, frequent infections, depression.',
    meaning_high: 'Toxicity is rare but can cause hypercalcemia.',
    recommendation: 'Sun exposure (15-20 min/day) and Vitamin D3 supplements as recommended by your doctor.',
  },
  {
    key: 'vitamin_b12', name: 'Vitamin B12', aliases: ['vitamin b12', 'vit b12', 'cobalamin', 'cyanocobalamin', 'b12'],
    unit: 'pg/mL', category: 'Vitamin', emoji: '🟢',
    universal: { min: 200, max: 900 },
    critical_low: 100,
    description: 'Vitamin essential for nerve function, DNA synthesis, and red blood cell formation.',
    meaning_low: 'B12 deficiency causes fatigue, nerve tingling/numbness, memory problems, anemia.',
    meaning_high: 'Very high B12 may indicate liver disease or blood disorders.',
    recommendation: 'B12 supplementation (oral or injection) as prescribed. Common in vegetarians/vegans.',
  },
  {
    key: 'folate', name: 'Folic Acid (Folate)', aliases: ['folate', 'folic acid', 'vitamin b9'],
    unit: 'ng/mL', category: 'Vitamin', emoji: '🌿',
    universal: { min: 2.7, max: 17.0 },
    description: 'Vitamin B9 — essential for DNA synthesis and red blood cell production.',
    meaning_low: 'Low folate causes anemia, fatigue. Critical in pregnancy (neural tube defects).',
    meaning_high: 'Not clinically significant.',
    recommendation: 'Eat leafy greens, legumes, fortified foods. Folate supplements essential in pregnancy.',
  },

  // ── Inflammatory Markers ───────────────────────────────────────────────
  {
    key: 'crp', name: 'C-Reactive Protein (CRP)', aliases: ['crp', 'c reactive protein', 'c-reactive protein'],
    unit: 'mg/L', category: 'Inflammatory', emoji: '🔥',
    universal: { min: 0, max: 5 },
    critical_high: 100,
    description: 'Protein that rises with inflammation or infection.',
    meaning_low: 'Normal — no significant inflammation.',
    meaning_high: 'High CRP indicates infection, autoimmune disease, or tissue injury.',
    recommendation: 'Consult your doctor to determine the cause of inflammation.',
  },
  {
    key: 'esr', name: 'ESR', aliases: ['esr', 'erythrocyte sedimentation rate', 'sedimentation rate'],
    unit: 'mm/hr', category: 'Inflammatory', emoji: '🔥',
    male: { min: 0, max: 15 }, female: { min: 0, max: 20 },
    description: 'Rate at which red blood cells settle — non-specific marker of inflammation.',
    meaning_low: 'Normal.',
    meaning_high: 'High ESR indicates infection, inflammation, autoimmune disease, or malignancy.',
    recommendation: 'ESR alone is non-specific. Discuss with your doctor for further investigation.',
  },

  // ── Cardiac Markers ───────────────────────────────────────────────────
  {
    key: 'troponin', name: 'Troponin I', aliases: ['troponin', 'troponin i', 'troponin t', 'cardiac troponin'],
    unit: 'ng/mL', category: 'Cardiac', emoji: '❤️',
    universal: { min: 0, max: 0.04 },
    critical_high: 0.4,
    description: 'Protein released when heart muscle is damaged.',
    meaning_low: 'Normal — no cardiac damage.',
    meaning_high: 'Elevated troponin indicates heart muscle injury, heart attack, or myocarditis.',
    recommendation: 'URGENT: If elevated, seek immediate medical attention. This may indicate a heart attack.',
  },
];

// ── Report Type Keywords (for auto-detection) ──────────────────────────────
export const REPORT_TYPE_KEYWORDS: Record<ReportType, string[]> = {
  'CBC': ['cbc', 'complete blood count', 'hemoglobin', 'rbc', 'wbc', 'platelets', 'blood count'],
  'Blood Test': ['blood test', 'blood panel', 'serology', 'blood chemistry'],
  'Thyroid': ['thyroid', 'tsh', 'thyroxine', 't3', 't4', 'thyroid function'],
  'LFT': ['liver', 'lft', 'liver function', 'sgpt', 'sgot', 'bilirubin', 'hepatic'],
  'KFT': ['kidney', 'kft', 'renal function', 'creatinine', 'urea', 'uric acid', 'egfr', 'rfts'],
  'Urine': ['urine', 'urinalysis', 'urine culture', 'urine routine', 'ua'],
  'Lipid Panel': ['lipid', 'cholesterol', 'ldl', 'hdl', 'triglycerides', 'lipid profile'],
  'HbA1c': ['hba1c', 'a1c', 'glycated hemoglobin', 'hemoglobin a1c'],
  'X-Ray': ['x-ray', 'xray', 'chest x-ray', 'radiograph', 'radiology'],
  'CT': ['ct scan', 'computed tomography', 'cat scan'],
  'MRI': ['mri', 'magnetic resonance', 'mr imaging'],
  'ECG': ['ecg', 'ekg', 'electrocardiogram', 'heart rhythm'],
  'Discharge': ['discharge', 'discharge summary', 'hospital discharge', 'discharge report'],
  'Prescription': ['prescription', 'rx', 'medicine', 'tablet', 'dosage'],
  'Health Check': ['health check', 'master health', 'comprehensive health', 'annual check'],
  'General': [],
};

// ── Helper: Find lab range by name/alias ───────────────────────────────────
export function findLabRange(biomarkerName: string): LabRange | null {
  const lowerName = biomarkerName.toLowerCase().trim();
  return LAB_RANGES.find(
    r => r.key === lowerName ||
         r.name.toLowerCase() === lowerName ||
         r.aliases.some(a => lowerName.includes(a) || a.includes(lowerName))
  ) || null;
}

// ── Helper: Evaluate value against normal range ────────────────────────────
export function evaluateLabValue(
  value: number,
  range: LabRange,
  gender: 'male' | 'female' | 'unknown' = 'unknown'
): NormalRangeResult {
  const normalRange = range.universal
    ? range.universal
    : gender === 'male' && range.male ? range.male
    : gender === 'female' && range.female ? range.female
    : range.female || range.male || range.universal;

  if (!normalRange) {
    return {
      status: 'Unknown', severity: 'warning',
      explanation: range.description,
      recommendation: range.recommendation,
      range: null, percentPosition: null,
    };
  }

  // Check critical thresholds first
  if (range.critical_low !== undefined && value <= range.critical_low) {
    return {
      status: 'Critical Low', severity: 'critical',
      explanation: range.meaning_low,
      recommendation: '⚠️ URGENT: This is critically low. Seek immediate medical attention.',
      range: normalRange, percentPosition: 0,
    };
  }
  if (range.critical_high !== undefined && value >= range.critical_high) {
    return {
      status: 'Critical High', severity: 'critical',
      explanation: range.meaning_high,
      recommendation: '⚠️ URGENT: This is critically high. Seek immediate medical attention.',
      range: normalRange, percentPosition: 100,
    };
  }

  const span = normalRange.max - normalRange.min;
  const borderlineBuffer = span * 0.1; // 10% buffer for borderline

  if (value >= normalRange.min && value <= normalRange.max) {
    const pct = span > 0 ? ((value - normalRange.min) / span) * 100 : 50;
    return {
      status: 'Normal', severity: 'optimal',
      explanation: range.description,
      recommendation: range.recommendation,
      range: normalRange, percentPosition: Math.min(100, Math.max(0, pct)),
    };
  }

  if (value < normalRange.min) {
    const isClose = (normalRange.min - value) <= borderlineBuffer;
    return {
      status: isClose ? 'Borderline Low' : 'Low',
      severity: isClose ? 'warning' : 'attention',
      explanation: range.meaning_low,
      recommendation: range.recommendation,
      range: normalRange, percentPosition: 0,
    };
  }

  // value > normalRange.max
  const isClose = (value - normalRange.max) <= borderlineBuffer;
  return {
    status: isClose ? 'Borderline High' : 'High',
    severity: isClose ? 'warning' : 'attention',
    explanation: range.meaning_high,
    recommendation: range.recommendation,
    range: normalRange, percentPosition: 100,
  };
}

// ── Helper: Detect report type from name ───────────────────────────────────
export function detectReportType(reportName: string, reportType?: string): ReportType {
  const text = `${reportName} ${reportType || ''}`.toLowerCase();
  for (const [type, keywords] of Object.entries(REPORT_TYPE_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) {
      return type as ReportType;
    }
  }
  return 'General';
}

// ── Report Category Icons & Colors ─────────────────────────────────────────
export const REPORT_TYPE_META: Record<ReportType, { icon: string; color: string; bg: string; label: string }> = {
  'CBC': { icon: '🩸', color: 'text-red-700', bg: 'bg-red-50', label: 'Complete Blood Count' },
  'Blood Test': { icon: '🧪', color: 'text-blue-700', bg: 'bg-blue-50', label: 'Blood Test' },
  'Thyroid': { icon: '🦋', color: 'text-purple-700', bg: 'bg-purple-50', label: 'Thyroid Function' },
  'LFT': { icon: '🫀', color: 'text-orange-700', bg: 'bg-orange-50', label: 'Liver Function Test' },
  'KFT': { icon: '🫘', color: 'text-cyan-700', bg: 'bg-cyan-50', label: 'Kidney Function Test' },
  'Urine': { icon: '💧', color: 'text-yellow-700', bg: 'bg-yellow-50', label: 'Urine Analysis' },
  'Lipid Panel': { icon: '💛', color: 'text-yellow-700', bg: 'bg-yellow-50', label: 'Lipid Panel' },
  'HbA1c': { icon: '📊', color: 'text-pink-700', bg: 'bg-pink-50', label: 'HbA1c (Diabetes)' },
  'X-Ray': { icon: '🩻', color: 'text-slate-700', bg: 'bg-slate-50', label: 'X-Ray Report' },
  'CT': { icon: '🧠', color: 'text-indigo-700', bg: 'bg-indigo-50', label: 'CT Scan' },
  'MRI': { icon: '🧲', color: 'text-violet-700', bg: 'bg-violet-50', label: 'MRI Scan' },
  'ECG': { icon: '❤️', color: 'text-red-700', bg: 'bg-red-50', label: 'ECG / EKG' },
  'Discharge': { icon: '🏥', color: 'text-teal-700', bg: 'bg-teal-50', label: 'Discharge Summary' },
  'Prescription': { icon: '💊', color: 'text-green-700', bg: 'bg-green-50', label: 'Prescription' },
  'Health Check': { icon: '✅', color: 'text-emerald-700', bg: 'bg-emerald-50', label: 'Health Check' },
  'General': { icon: '📋', color: 'text-gray-700', bg: 'bg-gray-50', label: 'Medical Report' },
};
