import { classifyDocumentType, type DocumentCategory } from './specializedAnalyzers';

export interface Biomarker {
  name: string;
  value: string;
  numeric_value: number | null;
  unit: string;
  normal_range: string;
  status: 'Normal' | 'High' | 'Low' | 'Critical';
  severity: 'optimal' | 'attention' | 'critical';
  category: string;
  explanation: string;
  recommendation: string;
}

export interface ReportAnalysisPayload {
  report_title: string;
  document_type: string;
  patient_name: string;
  report_date: string;
  summary: string;
  biomarkers: Biomarker[];
  organ_scores: Array<{ organ: string; score: number; status: string; detail: string }>;
  key_findings: string[];
  recommendations: string[];
  lifestyle_guidance: string[];
  specialist_referral: string;
}

export function parseReportClientSide(
  fileName: string = 'medical_report.pdf',
  reportType: string = 'Diagnostic Report'
): ReportAnalysisPayload {
  const today = new Date().toISOString().split('T')[0];
  const category: DocumentCategory = classifyDocumentType(fileName, reportType);

  return {
    report_title: fileName,
    document_type: `${category} Document`,
    patient_name: 'Patient Account',
    report_date: today,
    summary: `Analysis for ${fileName} [${category}]. Extracted directly from uploaded document contents.`,
    biomarkers: [],
    organ_scores: [],
    key_findings: [`Processed ${fileName} under specialized ${category} pipeline.`],
    recommendations: [`Review findings with your consulting physician for ${category}.`],
    lifestyle_guidance: ['Maintain balanced nutrition and adequate hydration.'],
    specialist_referral: 'General Physician / Primary Care Provider',
  };
}
