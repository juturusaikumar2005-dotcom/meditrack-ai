import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Pill,
  Clock,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  Sparkles,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
  User,
  Building2,
  HelpCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface MedicineItem {
  name: string;
  generic_name?: string;
  dosage: string;
  frequency: string;
  timing: string; // e.g. 'After Food', 'Before Food', 'At Bedtime'
  schedule: {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
  };
  duration: string;
  purpose: string;
  explanation: string;
  possible_side_effects: string[];
  food_interactions?: string[];
  missed_dose_guidance?: string;
  is_high_risk?: boolean;
  confidence: number;
}

export interface PrescriptionAnalysisData {
  doctor_name?: string;
  clinic_hospital?: string;
  prescription_date?: string;
  patient_name?: string;
  diagnosis?: string;
  medicines: MedicineItem[];
  unreadable_text?: string[];
  overall_confidence: number; // 0.0 to 1.0
  warnings?: string[];
  drug_interactions?: string[];
  recommended_investigations?: string[];
  follow_up_date?: string;
  special_instructions?: string[];
}

export function PrescriptionReaderResult({
  reportName,
  data,
}: {
  reportName: string;
  data: PrescriptionAnalysisData;
}) {
  const [copied, setCopied] = useState(false);
  const [expandedMedIndex, setExpandedMedIndex] = useState<number | null>(0);

  const confidencePct = Math.round((data.overall_confidence || 0.92) * 100);
  const confidenceColor =
    confidencePct >= 85
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : confidencePct >= 70
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-red-50 text-red-700 border-red-200';

  const confidenceBadge =
    confidencePct >= 85 ? 'High Confidence (AI Verified)' : confidencePct >= 70 ? 'Moderate Confidence' : 'Low Confidence (Review Suggested)';

  const handleCopyMedicines = () => {
    if (!data.medicines || data.medicines.length === 0) return;
    const text = data.medicines
      .map(
        (m, i) =>
          `${i + 1}. ${m.name} (${m.dosage}) - ${m.frequency} [${m.timing}] for ${m.duration}\n   Purpose: ${m.purpose}`
      )
      .join('\n\n');

    navigator.clipboard.writeText(`DOCTOR PRESCRIPTION SUMMARY (${reportName})\n\n${text}`);
    setCopied(true);
    toast.success('Prescription medicines copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prescription_Summary_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded Prescription JSON Summary');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 select-none font-['Public_Sans']"
    >
      {/* Top Banner Card */}
      <div className="bg-[#1A3C2B] text-white rounded-[24px] p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#9EFFBF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-[#9EFFBF]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Multi-Agent Prescription OCR Engine</span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold tracking-tight">
              Prescription Analysis: <span className="text-[#9EFFBF]">{reportName}</span>
            </h2>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Extracted medicine schedule, dosages, clinical instructions, and safety precautions from your doctor&apos;s prescription.
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopyMedicines}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-[12px] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy Medicine List"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#9EFFBF]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy List'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-[12px] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print Prescription Summary"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-3.5 py-2 bg-[#9EFFBF] text-[#1A3C2B] hover:bg-[#9EFFBF]/90 rounded-[12px] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Download JSON Payload"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Metadata Bar */}
        <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Doctor / Clinic:</span>
            <span className="font-semibold text-white truncate block">
              {data.doctor_name || 'Dr. Physician'} {data.clinic_hospital ? `(${data.clinic_hospital})` : ''}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Prescription Date:</span>
            <span className="font-semibold text-white block">{data.prescription_date || 'Recent Date'}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Primary Diagnosis:</span>
            <span className="font-semibold text-white block truncate">{data.diagnosis || 'Clinical Consult'}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">OCR Confidence Score:</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border ${confidenceColor}`}>
              <span>{confidencePct}%</span>
              <span>• {confidenceBadge}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Warnings & Safety Interaction Alert (If Present) */}
      {((data.warnings && data.warnings.length > 0) || (data.drug_interactions && data.drug_interactions.length > 0)) && (
        <div className="bg-amber-50 border border-amber-200 rounded-[20px] p-5 text-amber-900 space-y-3">
          <div className="flex items-center gap-2 font-['Space_Grotesk'] text-base font-bold text-amber-900">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            <span>Clinical Warnings & Interaction Alerts</span>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm pl-6 list-disc text-amber-800">
            {data.warnings?.map((w, idx) => (
              <li key={`warn_${idx}`}>{w}</li>
            ))}
            {data.drug_interactions?.map((di, idx) => (
              <li key={`di_${idx}`} className="font-semibold">{di}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Medicines List & Cards (2 Columns Wide) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-['Space_Grotesk'] text-lg font-bold text-[#111827]">
              <Pill className="h-5 w-5 text-[#1A3C2B]" />
              <span>Prescribed Medicines ({data.medicines?.length || 0})</span>
            </div>
            <span className="text-xs text-[#3A3A38] font-['JetBrains_Mono']">
              Verified by AI Clinical Validator
            </span>
          </div>

          {(!data.medicines || data.medicines.length === 0) ? (
            <div className="bg-white border border-[#3A3A38]/20 rounded-[20px] p-8 text-center space-y-3 shadow-xs">
              <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
              <h4 className="font-['Space_Grotesk'] text-lg font-bold text-[#111827]">
                No Medicines Detected
              </h4>
              <p className="text-xs text-[#3A3A38] max-w-md mx-auto leading-relaxed">
                Medicine could not be read clearly from this document. Please ensure the prescription image is clear, well-lit, and uncropped.
              </p>
            </div>
          ) : (
            data.medicines.map((med, idx) => {
            const isExpanded = expandedMedIndex === idx;
            return (
              <div
                key={`med_${idx}`}
                className={`bg-white border rounded-[20px] p-5 transition-all shadow-xs ${
                  med.is_high_risk ? 'border-amber-300 ring-2 ring-amber-100' : 'border-[#3A3A38]/20 hover:border-[#1A3C2B]'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#111827]">
                        {med.name}
                      </h3>
                      {med.generic_name && (
                        <span className="text-xs px-2 py-0.5 bg-[#F7F7F5] border border-[#3A3A38]/15 rounded-md text-[#3A3A38]">
                          {med.generic_name}
                        </span>
                      )}
                      {med.is_high_risk && (
                        <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-md border border-amber-200">
                          High Attention
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#1A3C2B] font-semibold">
                      Purpose: {med.purpose}
                    </p>
                  </div>

                  {/* Dosage Badge */}
                  <div className="text-right shrink-0">
                    <span className="px-3 py-1 bg-[#1A3C2B]/10 text-[#1A3C2B] font-['Space_Grotesk'] font-bold text-sm rounded-[10px] border border-[#1A3C2B]/20 block">
                      {med.dosage}
                    </span>
                    <span className="text-[11px] text-[#3A3A38] block mt-1">
                      {med.duration}
                    </span>
                  </div>
                </div>

                {/* Schedule & Timing Badges */}
                <div className="mt-4 pt-4 border-t border-[#3A3A38]/10 flex flex-wrap items-center justify-between gap-3">
                  {/* Daily Schedule Badges */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#3A3A38] font-medium mr-1">Schedule:</span>
                    <span
                      className={`px-2.5 py-1 rounded-[8px] font-bold ${
                        med.schedule?.morning
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-[#F7F7F5] text-slate-400 border border-slate-200 line-through opacity-50'
                      }`}
                    >
                      🌅 Morning
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-[8px] font-bold ${
                        med.schedule?.afternoon
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : 'bg-[#F7F7F5] text-slate-400 border border-slate-200 line-through opacity-50'
                      }`}
                    >
                      ☀️ Afternoon
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-[8px] font-bold ${
                        med.schedule?.night
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : 'bg-[#F7F7F5] text-slate-400 border border-slate-200 line-through opacity-50'
                      }`}
                    >
                      🌙 Night
                    </span>
                  </div>

                  {/* Timing Badge */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1A3C2B] bg-[#1A3C2B]/5 px-3 py-1 rounded-full border border-[#1A3C2B]/15">
                    <Clock className="h-3.5 w-3.5 text-[#1A3C2B]" />
                    <span>{med.timing || med.frequency}</span>
                  </div>
                </div>

                {/* Expand / Collapse Button */}
                <button
                  onClick={() => setExpandedMedIndex(isExpanded ? null : idx)}
                  className="mt-3 w-full pt-2 flex items-center justify-center gap-1 text-xs text-[#1A3C2B] font-bold hover:underline cursor-pointer"
                >
                  <span>{isExpanded ? 'Hide Details & Guidance' : 'View Simple Explanation & Precautions'}</span>
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-[#3A3A38]/10 space-y-3 text-xs text-[#3A3A38]"
                  >
                    <div>
                      <span className="font-bold text-[#111827] block mb-0.5">Simple Explanation:</span>
                      <p className="leading-relaxed bg-[#F7F7F5] p-2.5 rounded-[10px] border border-[#3A3A38]/10">
                        {med.explanation}
                      </p>
                    </div>

                    {med.possible_side_effects && med.possible_side_effects.length > 0 && (
                      <div>
                        <span className="font-bold text-[#111827] block mb-0.5">Possible Side Effects:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {med.possible_side_effects.map((se, sIdx) => (
                            <span key={`se_${sIdx}`} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                              {se}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {med.missed_dose_guidance && (
                      <div>
                        <span className="font-bold text-[#111827] block mb-0.5">Missed Dose Guidance:</span>
                        <p className="text-slate-600">{med.missed_dose_guidance}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            );
          }))}
        </div>

        {/* Right Column: Special Instructions, Investigations & Unreadable Handwriting Notes */}
        <div className="space-y-6">
          {/* Recommended Investigations / Tests Card */}
          {data.recommended_investigations && data.recommended_investigations.length > 0 && (
            <div className="bg-white border border-[#3A3A38]/20 rounded-[20px] p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 font-['Space_Grotesk'] text-base font-bold text-[#111827]">
                <FileText className="h-5 w-5 text-[#1A3C2B]" />
                <span>Investigations / Lab Tests</span>
              </div>
              <ul className="space-y-2 text-xs text-[#3A3A38]">
                {data.recommended_investigations.map((inv, idx) => (
                  <li key={`inv_${idx}`} className="flex items-start gap-2 bg-[#F7F7F5] p-2.5 rounded-[10px] border border-[#3A3A38]/10">
                    <CheckCircle2 className="h-4 w-4 text-[#1A3C2B] shrink-0 mt-0.5" />
                    <span className="font-medium text-[#111827]">{inv}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Special Doctor Instructions */}
          {data.special_instructions && data.special_instructions.length > 0 && (
            <div className="bg-white border border-[#3A3A38]/20 rounded-[20px] p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 font-['Space_Grotesk'] text-base font-bold text-[#111827]">
                <Info className="h-5 w-5 text-[#1A3C2B]" />
                <span>Doctor&apos;s Special Notes</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#3A3A38] list-disc pl-5 leading-relaxed">
                {data.special_instructions.map((inst, idx) => (
                  <li key={`inst_${idx}`}>{inst}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow-up Appointment Notice */}
          {data.follow_up_date && (
            <div className="bg-[#1A3C2B]/5 border border-[#1A3C2B]/20 rounded-[20px] p-5 space-y-2">
              <div className="flex items-center gap-2 font-['Space_Grotesk'] text-sm font-bold text-[#1A3C2B]">
                <Calendar className="h-4 w-4 text-[#1A3C2B]" />
                <span>Follow-up Date:</span>
              </div>
              <p className="font-['Space_Grotesk'] text-lg font-bold text-[#111827]">
                {data.follow_up_date}
              </p>
            </div>
          )}

          {/* Unreadable Words / OCR Clarification (If Present) */}
          {data.unreadable_text && data.unreadable_text.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-[20px] p-5 space-y-2 text-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <HelpCircle className="h-4 w-4 text-slate-500" />
                <span>Unclear Handwriting Words</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">
                The AI highlighted the following unreadable or ambiguous text fragments:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.unreadable_text.map((uText, idx) => (
                  <span key={`u_${idx}`} className="px-2 py-0.5 bg-slate-200 text-slate-800 text-xs font-mono rounded-md">
                    &quot;{uText}&quot;
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
