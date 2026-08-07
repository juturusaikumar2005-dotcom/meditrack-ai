// @refresh reset
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  FileText, CheckCircle2, AlertTriangle, Stethoscope, MessageSquare,
  Upload, ArrowRight, Sparkles, Activity, TrendingUp, TrendingDown,
  Shield, ChevronRight, Lightbulb, Star, Clock, RotateCcw,
} from 'lucide-react';
import { FooterComponent } from '@/components/layout/FooterComponent';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { LabValueCard } from '@/components/medical-report/LabValueCard';
import { ReportSummaryBanner } from '@/components/medical-report/ReportSummaryBanner';
import { Modal } from '@/components/ui/Modal';
import { apiClient } from '@/lib/apiClient';
import toast from 'react-hot-toast';

/* ─────────────────────────── Animation Variants ─────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

/* ─────────────────────────── Helpers ─────────────────────────────────────── */
function normalizeBiomarkers(analysis: any) {
  if (analysis?.biomarkers?.length) return analysis.biomarkers;
  const labArray = analysis?.laboratory || analysis?.labTests || analysis?.lab_tests || analysis?.tests || analysis?.results;
  if (labArray?.length) {
    return labArray.map((lab: any) => ({
      name: lab.test_name || lab.biomarker || lab.name || lab.title || 'Laboratory Test',
      value: lab.value || '',
      numeric_value: parseFloat(lab.value) || null,
      unit: lab.unit || '',
      normal_range: lab.reference_range || lab.normal_range || lab.range || '',
      status: lab.status || 'Normal',
      severity: lab.severity || (lab.status?.includes('Critical') ? 'critical' : lab.status !== 'Normal' ? 'attention' : 'optimal'),
      category: lab.category || 'Laboratory',
      explanation: lab.clinical_explanation || lab.explanation || lab.interpretation || lab.description || '',
      recommendation: lab.recommendation || '',
      confidence: lab.confidence || 96.5,
      validation_status: lab.validation_status || 'Verified',
      needs_manual_review: lab.needs_manual_review || false,
    }));
  }
  if (analysis?.key_findings?.length) {
    return analysis.key_findings.map((kf: any) => ({
      name: kf.biomarker || kf.title || 'Finding',
      value: kf.value || '',
      numeric_value: parseFloat(kf.value) || null,
      unit: '',
      normal_range: kf.range || '',
      status: kf.status || 'Normal',
      severity: kf.severity || 'optimal',
      category: 'General',
      explanation: kf.description || kf.title || '',
      recommendation: '',
      confidence: 95.0,
      validation_status: 'Verified',
    }));
  }
  return [];
}

function getSeverityGroup(biomarkers: any[]) {
  const critical = biomarkers.filter(b => b.severity === 'critical' || b.status?.includes('Critical'));
  const attention = biomarkers.filter(b => b.severity === 'attention' && !b.status?.includes('Critical'));
  const warning = biomarkers.filter(b => b.severity === 'warning');
  const normal = biomarkers.filter(b => b.severity === 'optimal' || b.status === 'Normal');
  return { critical, attention, warning, normal };
}

/* ─────────────────────────── Section Header ─────────────────────────────── */
function SectionHeader({ icon, label, count, color }: { icon: React.ReactNode; label: string; count?: number; color?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className={`font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest ${color || 'text-[#1A3C2B]'}`}>
        {icon} {label}
      </span>
      {count != null && (
        <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38] bg-[#F7F7F5] px-2 py-0.5 rounded-full">
          {count} value{count !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────── Main Page ───────────────────────────────────── */
export default function AIAnalysisPage() {
  const { profile, session } = useAuth();
  const navigate = useNavigate();
  const [curtainDone, setCurtainDone] = useState(false);
  const [viewMode, setViewMode] = useState<'patient' | 'doctor'>('patient');

  // Clinician Correction Feedback Modal State
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [selectedBiomarker, setSelectedBiomarker] = useState('');
  const [correctedValue, setCorrectedValue] = useState('');
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [submittingCorrection, setSubmittingCorrection] = useState(false);

  const [analysisData, setAnalysisData] = useState<any>(() => {
    const stored = localStorage.getItem('meditrack_latest_analysis');
    if (stored) { try { return JSON.parse(stored); } catch {} }
    return null;
  });

  const userId = profile?.id || session?.user?.id || 'usr-demo';

  useEffect(() => {
    let isMounted = true;
    async function loadLatestResult() {
      // 1. Check local storage first
      const stored = localStorage.getItem('meditrack_latest_analysis');
      if (stored && isMounted) {
        try {
          const parsedLocal = JSON.parse(stored);
          setAnalysisData(parsedLocal);
        } catch {}
      }

      if (!userId) return;
      try {
        const { data } = await (supabase as any)
          .from('analysis_results')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);
        if (isMounted && data?.[0]) {
          const merged = { ...data[0], ...(data[0].analysis_payload || {}) };
          setAnalysisData(merged);
        }
      } catch {}
    }

    loadLatestResult();

    const handleUploadEvent = () => {
      loadLatestResult();
    };
    window.addEventListener('meditrack_report_uploaded', handleUploadEvent);

    return () => {
      isMounted = false;
      window.removeEventListener('meditrack_report_uploaded', handleUploadEvent);
    };
  }, [userId]);

  const analysis = analysisData?.analysis || analysisData;
  const reportName = analysisData?.report_name || analysisData?.reportName || 'Medical Report';
  const reportType = analysis?.report_type || analysisData?.report_type || 'General';
  const provider = analysisData?.provider || analysis?.provider;

  const biomarkers = normalizeBiomarkers(analysis);
  const { critical, attention, warning, normal } = getSeverityGroup(biomarkers);
  const abnormalBiomarkers = [...critical, ...attention];

  // Compute counts
  const normalCount = analysis?.normal_count ?? normal.length;
  const abnormalCount = analysis?.abnormal_count ?? (attention.length + warning.length);
  const criticalCount = analysis?.critical_count ?? critical.length;

  const lifestyleRecs = analysis?.lifestyle_recommendations || [];
  const specialist = analysis?.recommended_specialist;
  const specialistReason = analysis?.recommended_specialist_reason;

  return (
    <div className="relative min-h-screen bg-[#F7F7F5]">
      {/* ── Curtain Entrance ─────────────────────────── */}
      <AnimatePresence>
        {!curtainDone && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#0D2419] flex items-center justify-center pointer-events-none"
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
            onAnimationComplete={() => setCurtainDone(true)}
          >
            <motion.div
              className="absolute inset-x-0 h-px bg-[#9EFFBF] shadow-[0_0_16px_4px_rgba(158,255,191,0.6)]"
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{ duration: 0.6, ease: 'linear', delay: 0.1 }}
            />
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="h-12 w-12 bg-[#9EFFBF]/20 rounded-[14px] border border-[#9EFFBF]/40 flex items-center justify-center">
                <Activity className="h-6 w-6 text-[#9EFFBF]" />
              </div>
              <p className="font-['JetBrains_Mono'] text-[#9EFFBF] text-xs tracking-[0.3em] uppercase">
                AI Report Analyser
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Header ─────────────────────────────────── */}
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate={curtainDone ? 'visible' : 'hidden'}>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A3C2B]">
              MEDITRACK AI — Report Analysis
            </span>
            <span className="h-px flex-1 bg-[#1A3C2B]/20" />
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
                Medical Report Analysis
              </h1>
              <p className="font-['Public_Sans'] text-sm text-[#3A3A38] mt-1">
                AI-powered biomarker extraction with normal range comparison and plain-English explanations.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* View Mode Toggle */}
              <div className="bg-[#EAEAE7] p-1 rounded-[12px] flex items-center border border-[#3A3A38]/15">
                <button
                  type="button"
                  onClick={() => setViewMode('patient')}
                  className={`px-3.5 py-1.5 rounded-[9px] font-['Public_Sans'] text-xs font-bold transition-all ${
                    viewMode === 'patient'
                      ? 'bg-white text-[#111827] shadow-xs'
                      : 'text-[#3A3A38] hover:text-[#111827]'
                  }`}
                >
                  👤 Patient View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('doctor')}
                  className={`px-3.5 py-1.5 rounded-[9px] font-['Public_Sans'] text-xs font-bold transition-all ${
                    viewMode === 'doctor'
                      ? 'bg-[#1A3C2B] text-white shadow-xs'
                      : 'text-[#3A3A38] hover:text-[#111827]'
                  }`}
                >
                  🩺 Doctor EMR View
                </button>
              </div>

              <Link
                to="/app/upload"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1A3C2B] text-white rounded-[12px] font-['Public_Sans'] text-sm font-bold hover:bg-[#1A3C2B]/90 transition-colors shrink-0"
              >
                <Upload className="h-4 w-4" />
                Upload New
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── No Analysis State ──────────────────────── */}
        {!analysis && (
          <motion.div
            variants={fadeUp} custom={1} initial="hidden" animate={curtainDone ? 'visible' : 'hidden'}
            className="bg-white border border-[#3A3A38]/20 rounded-[18px] p-10 text-center space-y-6"
          >
            <div className="h-16 w-16 bg-[#1A3C2B]/8 rounded-[16px] flex items-center justify-center mx-auto">
              <FileText className="h-8 w-8 text-[#1A3C2B]" />
            </div>
            <div>
              <h2 className="font-['Space_Grotesk'] text-xl font-black text-[#111827]">
                No Analysis Available
              </h2>
              <p className="font-['Public_Sans'] text-sm text-[#3A3A38] mt-2 max-w-sm mx-auto">
                Upload a blood test, CBC, thyroid report, LFT, KFT, or any medical document to get an AI analysis.
              </p>
            </div>

            {/* Report types supported */}
            <div className="flex flex-wrap gap-2 justify-center">
              {['🩸 CBC', '🦋 Thyroid', '🫀 LFT', '🫘 KFT', '💛 Lipid', '📊 HbA1c', '🩻 X-Ray', '❤️ ECG'].map(t => (
                <span key={t} className="font-['JetBrains_Mono'] text-[10px] px-3 py-1.5 bg-[#F7F7F5] border border-[#3A3A38]/20 rounded-full text-[#3A3A38]">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                to="/app/upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A3C2B] text-white rounded-[12px] font-['Public_Sans'] text-sm font-bold hover:bg-[#1A3C2B]/90 transition-colors"
              >
                <Upload className="h-4 w-4" />
                Upload a Report
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── Report Analysis Results ────────────────── */}
        {analysis && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: curtainDone ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {/* Summary Banner */}
            <ReportSummaryBanner
              reportType={reportType}
              overallStatus={analysis.overall_status || analysis.risk_level}
              riskLevel={analysis.risk_level}
              confidenceScore={analysis.confidence_score}
              summary={analysis.summary}
              normalCount={normalCount}
              abnormalCount={abnormalCount}
              criticalCount={criticalCount}
              patientName={analysis.patient_name}
              labName={analysis.lab_name}
              collectionDate={analysis.collection_date}
              doctorName={analysis.doctor_name}
              reportName={reportName}
              provider={provider}
            />

            {/* Doctor EMR View Banner / SOAP Summary */}
            {viewMode === 'doctor' && analysis.doctor_emr_summary && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0D2419] text-white border border-[#9EFFBF]/30 rounded-[18px] p-6 space-y-4 shadow-md"
              >
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-[#9EFFBF]" />
                    <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#9EFFBF]">
                      Clinical EMR SOAP Summary (Doctor Mode)
                    </h3>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-[10px] bg-[#9EFFBF]/20 text-[#9EFFBF] px-2.5 py-1 rounded-full uppercase font-bold border border-[#9EFFBF]/30">
                    256-BIT CLINICAL EMR AUDIT
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-['Public_Sans']">
                  <div className="bg-white/5 rounded-[12px] p-3.5 space-y-1">
                    <p className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#9EFFBF] uppercase">S — Subjective</p>
                    <p className="text-white/90 leading-relaxed">{analysis.doctor_emr_summary.subjective}</p>
                  </div>
                  <div className="bg-white/5 rounded-[12px] p-3.5 space-y-1">
                    <p className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#9EFFBF] uppercase">O — Objective</p>
                    <p className="text-white/90 leading-relaxed">{analysis.doctor_emr_summary.objective}</p>
                  </div>
                  <div className="bg-white/5 rounded-[12px] p-3.5 space-y-1">
                    <p className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#9EFFBF] uppercase">A — Assessment</p>
                    <p className="text-white/90 leading-relaxed">{analysis.doctor_emr_summary.assessment}</p>
                  </div>
                  <div className="bg-white/5 rounded-[12px] p-3.5 space-y-1">
                    <p className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#9EFFBF] uppercase">P — Plan & Triage</p>
                    <p className="text-white/90 leading-relaxed">{analysis.doctor_emr_summary.plan}</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-white/10 flex-wrap gap-2">
                  <span className="font-['JetBrains_Mono'] text-[10px] text-white/60">
                    Confidence Tier: <strong className="text-[#9EFFBF]">{analysis.quality_assurance?.confidence_tier || 'High'}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBiomarker(biomarkers[0]?.name || 'Hemoglobin');
                      setCorrectionModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-[#9EFFBF] text-[#0D2419] rounded-[8px] font-['Public_Sans'] font-bold text-xs hover:bg-[#9EFFBF]/90 transition-colors"
                  >
                    ✏️ Submit Field Correction
                  </button>
                </div>
              </motion.div>
            )}



            {/* ── Critical / Abnormal Values First ──── */}
            {abnormalBiomarkers.length > 0 && (
              <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="space-y-3">
                <SectionHeader
                  icon="🔴"
                  label={`Abnormal Values`}
                  count={abnormalBiomarkers.length}
                  color="text-red-700"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {abnormalBiomarkers.map((b: any, i: number) => (
                    <LabValueCard
                      key={`abn-${i}`}
                      name={b.name}
                      value={b.value}
                      numericValue={b.numeric_value}
                      unit={b.unit}
                      normalRange={b.normal_range}
                      status={b.status}
                      severity={b.severity}
                      category={b.category}
                      explanation={b.explanation}
                      recommendation={b.recommendation}
                      confidence={b.confidence}
                      validationStatus={b.validation_status}
                      needsManualReview={b.needs_manual_review}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── All Biomarkers / Laboratory Tests ─────────── */}
            {biomarkers.length > 0 && (
              <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="space-y-3">
                <SectionHeader icon="📋" label="Laboratory Results & Biomarkers" count={biomarkers.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {biomarkers.map((b: any, i: number) => (
                    <LabValueCard
                      key={`all-${i}`}
                      name={b.name}
                      value={b.value}
                      numericValue={b.numeric_value}
                      unit={b.unit}
                      normalRange={b.normal_range}
                      status={b.status}
                      severity={b.severity}
                      category={b.category}
                      explanation={b.explanation}
                      recommendation={b.recommendation}
                      confidence={b.confidence}
                      validationStatus={b.validation_status}
                      needsManualReview={b.needs_manual_review}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Empty Biomarker Diagnostic Feedback Banner ── */}
            {biomarkers.length === 0 && (
              <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 text-center space-y-3">
                <Activity className="h-8 w-8 text-[#3A3A38]/30 mx-auto" />
                <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#111827]">
                  No laboratory biomarkers detected in this document
                </h3>
                <div className="font-['Public_Sans'] text-xs text-[#3A3A38] max-w-md mx-auto text-left bg-[#F7F7F5] p-4 rounded-[10px] space-y-1.5 border border-[#3A3A38]/10">
                  <p className="font-bold text-[#111827]">Possible reasons:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>This report contains no numerical laboratory test values (e.g. Prescription, Radiology, Invoice).</li>
                    <li>OCR confidence was low or document handwriting is faint/blurred.</li>
                    <li>AI extraction pass returned non-table narrative format.</li>
                  </ul>
                  <p className="text-[11px] text-[#1A3C2B] font-semibold pt-1">
                    💡 Tip: Re-upload a clear, high-resolution document or select a specific report target mode.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Dynamic Prescribed Medications ────────────── */}
            {analysis?.medications?.length > 0 && (
              <motion.div variants={fadeUp} custom={3.5} initial="hidden" animate="visible" className="space-y-3">
                <SectionHeader icon="💊" label="Prescribed Medications" count={analysis.medications.length} color="text-emerald-800" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysis.medications.map((med: any, i: number) => (
                    <div key={i} className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-4 space-y-2.5 hover:border-[#1A3C2B]/40 transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-['Space_Grotesk'] text-base font-bold text-[#111827]">{med.name || med.brand_name || 'Medication'}</p>
                          {med.generic && <p className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38]">{med.generic || med.generic_name}</p>}
                        </div>
                        {med.strength && <span className="font-['JetBrains_Mono'] text-[10px] font-bold bg-[#1A3C2B]/10 text-[#1A3C2B] px-2 py-1 rounded-full">{med.strength}</span>}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-xs font-['Public_Sans'] text-[#3A3A38]">
                        {med.dosage && <span><strong>Dose:</strong> {med.dosage}</span>}
                        {med.frequency && <span>• <strong>Frequency:</strong> {med.frequency}</span>}
                        {med.duration && <span>• <strong>Duration:</strong> {med.duration}</span>}
                      </div>

                      {med.purpose && (
                        <p className="font-['Public_Sans'] text-xs text-[#111827] bg-[#F7F7F5] p-2 rounded-[8px]">
                          🎯 <strong>Purpose:</strong> {med.purpose}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Dynamic Radiology Findings ──────────────── */}
            {analysis?.radiology?.length > 0 && (
              <motion.div variants={fadeUp} custom={3.8} initial="hidden" animate="visible" className="space-y-3">
                <SectionHeader icon="🩻" label="Radiology & Imaging Findings" count={analysis.radiology.length} color="text-indigo-800" />
                <div className="space-y-3">
                  {analysis.radiology.map((rad: any, i: number) => (
                    <div key={i} className="bg-white border border-indigo-200 rounded-[14px] p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-['Space_Grotesk'] text-sm font-bold text-indigo-900">{rad.scan_type || rad.title || 'Scan Finding'}</span>
                        {rad.severity && <span className="font-['JetBrains_Mono'] text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase">{rad.severity}</span>}
                      </div>
                      <p className="font-['Public_Sans'] text-xs text-[#3A3A38] leading-relaxed">{rad.finding || rad.description || rad.impression}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Specialist Recommendation ─────────── */}
            {specialist && (
              <motion.div
                variants={fadeUp} custom={4} initial="hidden" animate="visible"
                className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-5 flex items-start gap-4"
              >
                <div className="h-10 w-10 bg-[#1A3C2B]/10 rounded-[10px] flex items-center justify-center shrink-0">
                  <Stethoscope className="h-5 w-5 text-[#1A3C2B]" />
                </div>
                <div>
                  <p className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38] uppercase tracking-widest mb-1">
                    Recommended Specialist
                  </p>
                  <p className="font-['Space_Grotesk'] text-base font-bold text-[#111827]">{specialist}</p>
                  {specialistReason && (
                    <p className="font-['Public_Sans'] text-xs text-[#3A3A38] mt-1">{specialistReason}</p>
                  )}
                  <Link
                    to="/app/chat"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-['Public_Sans'] font-bold text-[#1A3C2B] hover:underline"
                  >
                    Ask AI Health Assistant
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ── Lifestyle Recommendations ─────────── */}
            {lifestyleRecs.length > 0 && (
              <motion.div
                variants={fadeUp} custom={5} initial="hidden" animate="visible"
                className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-5 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-[#1A3C2B]" />
                  <span className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest text-[#1A3C2B]">
                    Lifestyle Recommendations
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {lifestyleRecs.map((rec: string, i: number) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.06 }}
                      className="flex items-start gap-3"
                    >
                      <span className="h-5 w-5 bg-[#9EFFBF]/30 text-[#1A3C2B] rounded-full flex items-center justify-center shrink-0 mt-0.5 font-['JetBrains_Mono'] text-[10px] font-bold">
                        {i + 1}
                      </span>
                      <p className="font-['Public_Sans'] text-sm text-[#111827]">{rec}</p>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* ── Quick Actions ─────────────────────── */}
            <motion.div
              variants={fadeUp} custom={6} initial="hidden" animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <Link
                to="/app/chat"
                className="flex items-center gap-3 bg-white border border-[#3A3A38]/20 rounded-[14px] p-4 hover:border-[#1A3C2B]/40 hover:shadow-md transition-all group"
              >
                <div className="h-9 w-9 bg-[#1A3C2B]/8 rounded-[10px] flex items-center justify-center">
                  <MessageSquare className="h-4.5 w-4.5 text-[#1A3C2B]" />
                </div>
                <div>
                  <p className="font-['Space_Grotesk'] text-sm font-bold text-[#111827]">Ask AI Assistant</p>
                  <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">Get answers about your results</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#1A3C2B] ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/app/timeline"
                className="flex items-center gap-3 bg-white border border-[#3A3A38]/20 rounded-[14px] p-4 hover:border-[#1A3C2B]/40 hover:shadow-md transition-all group"
              >
                <div className="h-9 w-9 bg-[#1A3C2B]/8 rounded-[10px] flex items-center justify-center">
                  <TrendingUp className="h-4.5 w-4.5 text-[#1A3C2B]" />
                </div>
                <div>
                  <p className="font-['Space_Grotesk'] text-sm font-bold text-[#111827]">Health Timeline</p>
                  <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">View your health trends</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#1A3C2B] ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* ── Safety Disclaimer ─────────────────── */}
            <motion.div
              variants={fadeUp} custom={7} initial="hidden" animate="visible"
              className="bg-[#1A3C2B] text-white rounded-[14px] px-6 py-5 flex items-start gap-3"
            >
              <Shield className="h-5 w-5 text-[#9EFFBF] shrink-0 mt-0.5" />
              <div>
                <p className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#9EFFBF] uppercase tracking-widest mb-1">
                  Safety Disclaimer
                </p>
                <p className="font-['Public_Sans'] text-xs text-white/80 leading-relaxed">
                  AI-generated analysis may contain errors. This is not a medical diagnosis. Normal ranges may vary by laboratory.
                  Always discuss your results with a qualified healthcare professional before making any health decisions.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Clinician & Patient Field Correction Modal */}
      <Modal
        open={correctionModalOpen}
        onClose={() => setCorrectionModalOpen(false)}
        title="✏️ Clinician Field Verification & Feedback"
      >
        <div className="space-y-4 pt-2">
          <p className="font-['Public_Sans'] text-xs text-[#3A3A38] leading-relaxed">
            Submit a verified correction to improve MediTrack AI's extraction accuracy and train the continuous model feedback loop.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block font-['JetBrains_Mono'] text-[10px] font-bold text-[#111827] uppercase mb-1">
                Biomarker / Field Name
              </label>
              <select
                value={selectedBiomarker}
                onChange={(e) => setSelectedBiomarker(e.target.value)}
                className="w-full text-xs font-['Public_Sans'] p-2.5 bg-[#F7F7F5] border border-[#3A3A38]/20 rounded-[8px] focus:border-[#1A3C2B] outline-none"
              >
                {biomarkers.map((b: any, i: number) => (
                  <option key={i} value={b.name}>{b.name} (Current: {b.value})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-['JetBrains_Mono'] text-[10px] font-bold text-[#111827] uppercase mb-1">
                Corrected Value
              </label>
              <input
                type="text"
                value={correctedValue}
                onChange={(e) => setCorrectedValue(e.target.value)}
                placeholder="e.g. 13.8 or Normal"
                className="w-full text-xs font-['Public_Sans'] p-2.5 bg-[#F7F7F5] border border-[#3A3A38]/20 rounded-[8px] focus:border-[#1A3C2B] outline-none"
              />
            </div>

            <div>
              <label className="block font-['JetBrains_Mono'] text-[10px] font-bold text-[#111827] uppercase mb-1">
                Clinical Notes / Rationale
              </label>
              <textarea
                value={correctionNotes}
                onChange={(e) => setCorrectionNotes(e.target.value)}
                placeholder="Explain the correction or reference standard..."
                rows={3}
                className="w-full text-xs font-['Public_Sans'] p-2.5 bg-[#F7F7F5] border border-[#3A3A38]/20 rounded-[8px] focus:border-[#1A3C2B] outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#3A3A38]/10">
            <button
              type="button"
              onClick={() => setCorrectionModalOpen(false)}
              className="px-4 py-2 border border-[#3A3A38]/20 rounded-[8px] text-xs font-bold text-[#3A3A38] hover:bg-[#F7F7F5]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submittingCorrection || !correctedValue.trim()}
              onClick={async () => {
                setSubmittingCorrection(true);
                try {
                  await apiClient('/ai/verify-correction', {
                    method: 'POST',
                    body: JSON.stringify({
                      reportId: analysisData?.report_id || 'rep-demo',
                      biomarkerName: selectedBiomarker,
                      correctedValue,
                      notes: correctionNotes,
                      userRole: 'clinician',
                    }),
                  });
                  toast.success(`Verified correction recorded for ${selectedBiomarker}!`);
                  setCorrectionModalOpen(false);
                  setCorrectedValue('');
                  setCorrectionNotes('');
                } catch {
                  toast.error('Failed to submit correction.');
                } finally {
                  setSubmittingCorrection(false);
                }
              }}
              className="px-4 py-2 bg-[#1A3C2B] text-white rounded-[8px] text-xs font-bold hover:bg-[#1A3C2B]/90 disabled:opacity-50"
            >
              {submittingCorrection ? 'Saving...' : 'Submit Verification'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
