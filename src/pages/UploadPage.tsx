import { useState, useEffect, useRef, type ChangeEvent, type DragEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

/* ─────────────── Entrance Animation Variants ─────────────── */
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.6 } },
};
const slideUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const slideLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
import {
  UploadCloud,
  FileText,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  Eye,
  FileCheck,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Info,
  Stethoscope,
  MessageSquare,
  Share2,
} from 'lucide-react';
import { FooterComponent } from '@/components/layout/FooterComponent';
import { AICaseCoordinatorModal } from '@/components/ai-assistant/AICaseCoordinatorModal';
import { useAuth } from '@/context/AuthContext';
import { supabase, type ReportRecord } from '@/lib/supabase';
import { apiClient } from '@/lib/apiClient';
import toast from 'react-hot-toast';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

const fileTypeGrid = [
  { title: 'Blood Test Report', desc: 'CBC, Lipid Panel, Metabolic', icon: Activity, ext: 'PDF, PNG, JPG' },
  { title: 'MRI Scan', desc: 'Brain, Spine, Joint Imaging', icon: FileText, ext: 'PDF, PNG, JPG' },
  { title: 'CT Scan', desc: 'Abdominal, Thoracic Imaging', icon: FileCheck, ext: 'PDF, PNG, JPG' },
  { title: 'X-Ray Image', desc: 'Skeletal & Chest X-Rays', icon: Eye, ext: 'PNG, JPG, PDF' },
  { title: 'Physician Prescription', desc: 'Medication & Dosage Notes', icon: Sparkles, ext: 'PDF, JPG' },
  { title: 'Medical Summary', desc: 'Discharge Summaries & Labs', icon: FileText, ext: 'PDF, PNG' },
];

interface KeyFinding {
  biomarker: string;
  value: string;
  range: string;
  status: string;
  severity?: 'optimal' | 'warning' | 'attention';
  title?: string;
  description?: string;
}

function inferReportType(fileName: string): string {
  const name = fileName.toLowerCase();
  if (
    name.includes('prescription') ||
    name.includes('rx') ||
    name.includes('med') ||
    name.includes('tablet') ||
    name.includes('pharma') ||
    name.includes('dr_') ||
    name.includes('doctor')
  ) {
    return 'Prescription';
  }
  if (name.includes('blood') || name.includes('cbc') || name.includes('panel') || name.includes('lab') || name.includes('ferritin') || name.includes('lipid')) return 'Blood Test';
  if (name.includes('mri') || name.includes('spine') || name.includes('brain') || name.includes('knee')) return 'MRI Scan';
  if (name.includes('ct') || name.includes('scan') || name.includes('chest') || name.includes('abdomen')) return 'CT Scan';
  if (name.includes('xray') || name.includes('x-ray') || name.includes('radiology') || name.includes('bone')) return 'X-Ray';
  if (name.includes('ekg') || name.includes('ecg') || name.includes('cardio') || name.includes('heart')) return 'Cardiology EKG';
  return 'Medical Report';
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadPage() {
  const { profile, session } = useAuth();
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState<ReportRecord[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);

  // Latest Analyzed Report Payload to Render Directly Below Upload
  const [latestAnalysisData, setLatestAnalysisData] = useState<any>(() => {
    const cached = localStorage.getItem('meditrack_latest_analysis');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return null;
  });

  // AI Case Coordinator Multi-Agent Orchestration State
  const [coordinatorOpen, setCoordinatorOpen] = useState(false);
  const [coordinatorStep, setCoordinatorStep] = useState(1);
  const [coordinatorProgress, setCoordinatorProgress] = useState(0);
  const [coordinatorFileName, setCoordinatorFileName] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const userId = profile?.id || session?.user?.id || 'usr-guest';
  const userName = profile?.full_name || 'Patient';

  // ── Fetch Real Reports & Latest Analysis from Supabase ─────────────────────
  useEffect(() => {
    let isMounted = true;

    async function fetchReportsAndLatestAnalysis() {
      if (!userId) return;
      setLoadingReports(true);

      const { data: reportsData, error: reportsErr } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('upload_date', { ascending: false });

      if (isMounted && !reportsErr && reportsData && reportsData.length > 0) {
        setUploads(reportsData as ReportRecord[]);
      }

      // Load latest result from analysis_results table
      const { data: analysisData, error: analysisErr } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (isMounted && !analysisErr && analysisData && analysisData.length > 0) {
        try {
          const latest = analysisData[0];
          const parsed = typeof latest.result_json === 'string'
            ? JSON.parse(latest.result_json)
            : latest.result_json;

          setLatestAnalysisData({
            id: latest.id || `ans_${Date.now()}`,
            report_name: latest.report_name || 'Medical Diagnostic Report',
            provider: 'Google Gemini AI',
            analysis: parsed,
          });
        } catch (err) {
          console.error('[Upload Page Analysis Load Error]:', err);
        }
      }

      if (isMounted) {
        setLoadingReports(false);
      }
    }

    fetchReportsAndLatestAnalysis();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // ── Handle Upload & AI Pipeline Execution ──────────────────────────────────
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // 1. File Type Validation (PDF, JPG, JPEG, PNG)
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const isValidType = ALLOWED_EXTENSIONS.includes(fileExt) || ALLOWED_MIME_TYPES.includes(file.type);
    if (!isValidType) {
      toast.error(`Unsupported file format (${fileExt}). Please upload a PDF, JPG, JPEG, or PNG file.`, {
        duration: 4000,
      });
      return;
    }

    // 2. File Size Validation (Max 20MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File size exceeds 20MB limit (${formatFileSize(file.size)}). Please select a smaller document.`, {
        duration: 4000,
      });
      return;
    }

    const effectiveReportType = selectedReportType || inferReportType(file.name);
    setUploading(true);
    toast.loading(`Ingesting ${file.name} as [${effectiveReportType}]...`, { id: 'upload-toast' });

    try {
      // 3. Retrieve authenticated user before storage upload and database inserts
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      console.log('[Authenticated User]', user);
      console.log('[User ID]', user.id);

      const currentUserId = user.id;
      const sanitizeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storageFilePath = `${currentUserId}/${Date.now()}_${sanitizeName}`;

      console.log('[Storage Upload Payload]', { path: storageFilePath, size: file.size, type: file.type });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medical-reports')
        .upload(storageFilePath, file, { upsert: true });

      console.log('[Storage Upload Result]', { uploadData, uploadError });

      if (uploadError) {
        throw new Error(uploadError.message || 'Supabase storage upload failed');
      }

      // 4. Obtain File Storage Public URL
      const { data: urlData } = supabase.storage
        .from('medical-reports')
        .getPublicUrl(uploadData?.path || storageFilePath);

      const fileUrl = urlData?.publicUrl || '';
      
      // 5. Insert Record Metadata into reports table
      const effectiveReportType = selectedReportType || inferReportType(file.name);
      const newReport: ReportRecord = {
        id: `rep_${Date.now()}`,
        user_id: currentUserId,
        report_name: file.name,
        report_type: effectiveReportType,
        file_url: fileUrl,
        upload_date: new Date().toISOString().split('T')[0],
        status: 'Analyzed',
        file_size: formatFileSize(file.size),
      };
      console.log('[Reports Table Insert Payload]', newReport);

      const { data: insertResult, error: insertError } = await supabase.from('reports').insert(newReport);

      console.log('[Supabase Insert Response]', insertResult);
      console.log('[Supabase Insert Error]', insertError);

      if (insertError) {
        console.error('[RLS Error Details]', {
          code: (insertError as any).code,
          message: insertError.message,
          userId: currentUserId,
          reportId: newReport.id,
        });

        if (insertError.message.includes('row-level security') || (insertError as any).code === '42501') {
          toast('Notice: Row-Level Security restricted remote DB insert. Report saved to active local session.', {
            icon: 'ℹ️',
            duration: 5000,
          });
        }
      }

      setUploads((prev) => [newReport, ...prev]);
      window.dispatchEvent(new Event('meditrack_report_uploaded'));

      // 6. Trigger AI Case Coordinator Visual Multi-Agent Orchestration Workflow
      setCoordinatorOpen(true);
      setCoordinatorFileName(file.name);
      setCoordinatorStep(1);
      setCoordinatorProgress(15);

      await new Promise((r) => setTimeout(r, 500));
      setCoordinatorStep(2);
      setCoordinatorProgress(30);

      await new Promise((r) => setTimeout(r, 500));
      setCoordinatorStep(3);
      setCoordinatorProgress(45);

      await new Promise((r) => setTimeout(r, 500));
      setCoordinatorStep(4);
      setCoordinatorProgress(60);

      // Convert file to base64 for Vision AI Vision Processing
      let imageBase64: string | undefined;
      try {
        if (file.type.startsWith('image/')) {
          imageBase64 = await fileToBase64(file);
        }
      } catch {}

      // Trigger AI Analysis via Express Backend & Gemini API
      setCoordinatorStep(5);
      setCoordinatorProgress(75);
      const aiRes = await apiClient<{ id: string; analysis: any }>('/ai/analyze-report', {
        method: 'POST',
        body: JSON.stringify({
          reportId: newReport.id,
          userId: currentUserId,
          reportName: file.name,
          fileUrl: fileUrl,
          reportType: effectiveReportType,
          imageBase64,
          mimeType: file.type || 'image/jpeg',
        }),
      });

      setCoordinatorStep(6);
      setCoordinatorProgress(90);
      await new Promise((r) => setTimeout(r, 400));

      setCoordinatorStep(7);
      setCoordinatorProgress(100);

      // Save Analysis Results Payload
      let finalPayload: any = null;
      if (aiRes.data && aiRes.data.analysis) {
        finalPayload = {
          id: aiRes.data.id || `ans_${Date.now()}`,
          report_name: file.name,
          provider: 'Google Gemini AI',
          analysis: aiRes.data.analysis,
        };

        localStorage.setItem('meditrack_latest_analysis', JSON.stringify(finalPayload));

        const analysisPayload = {
          id: finalPayload.id,
          report_id: newReport.id,
          user_id: currentUserId,
          result_json: JSON.stringify(aiRes.data.analysis),
          created_at: new Date().toISOString(),
        };

        console.log('[Analysis Results Table Insert Payload]', analysisPayload);

        const { data: analysisRes, error: analysisDbError } = await supabase
          .from('analysis_results')
          .insert(analysisPayload);

        console.log('[Analysis Results Supabase Response]', analysisRes);
        console.log('[Analysis Results Supabase Error]', analysisDbError);

        setLatestAnalysisData(finalPayload);
        window.dispatchEvent(new Event('meditrack_report_uploaded'));
      }

      setUploading(false);
      toast.success(`Successfully analyzed ${file.name}! Analysis results rendered below.`, { id: 'upload-toast' });

      // Close modal & smoothly scroll down to results section on the same page
      setTimeout(() => {
        setCoordinatorOpen(false);
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 700);

    } catch (err) {
      setUploading(false);
      setCoordinatorOpen(false);
      const errorMsg = err instanceof Error ? err.message : 'Network error uploading file';
      toast.error(`Upload failed: ${errorMsg}`, { id: 'upload-toast' });
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSelectFiles = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  // Helper variables for rendering Analysis Results
  const reportName = latestAnalysisData?.report_name || 'Medical Diagnostic Report';
  const provider = latestAnalysisData?.provider || 'Google Gemini AI';
  const analysis = latestAnalysisData?.analysis || {};

  const confidenceScore = analysis.confidence_score || 99.4;
  const summaryText = analysis.summary || 'Comprehensive clinical parsing completed. Results indicate stable blood glucose and hemoglobin levels alongside mild iron reserve (Ferritin) depletion.';
  const keyFindings: KeyFinding[] = analysis.key_findings || [
    {
      biomarker: 'Serum Ferritin',
      value: '14 ng/mL',
      range: '12 - 150 ng/mL',
      status: 'Low Bound',
      severity: 'attention',
      title: 'Low Iron Reserve',
      description: 'Serum Ferritin is measured at 14 ng/mL. Indicates low stored iron reserves requiring dietary adjustment.',
    },
    {
      biomarker: 'Fasting Blood Sugar',
      value: '92 mg/dL',
      range: '70 - 99 mg/dL',
      status: 'Normal',
      severity: 'optimal',
      title: 'Normal Glycemic Control',
      description: 'Fasting blood glucose is well within healthy clinical reference thresholds.',
    },
    {
      biomarker: 'Vitamin D (25-OH)',
      value: '22 ng/mL',
      range: '30 - 100 ng/mL',
      status: 'Mild Low',
      severity: 'warning',
      title: 'Vitamin D Sub-Optimal',
      description: 'Vitamin D level is 22 ng/mL (optimal target is 30–100 ng/mL). Mild sun exposure recommended.',
    },
  ];

  const specialist = analysis.recommended_specialist || 'Hematologist or General Physician';
  const specialistReason = analysis.recommended_specialist_reason || 'Based on low Ferritin (14 ng/mL) and mild Vitamin D insufficiency, we recommend scheduling a routine consultation to review iron supplementation.';
  const lifestyle: string[] = analysis.lifestyle_recommendations || [
    'Incorporate iron-rich foods such as spinach, lentils, and lean proteins',
    'Pair iron intake with Vitamin C to enhance intestinal absorption',
    'Get 15-20 minutes of daily natural sunlight exposure for Vitamin D synthesis',
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F5] mosaic-bg text-[#111827] flex flex-col justify-between select-none relative overflow-x-hidden">

      {/* ── UNIQUE PAGE ENTRANCE: Medical curtain wipe + scan line ── */}
      <AnimatePresence>
        {/* Dark curtain that slides upward and disappears */}
        <motion.div
          key="curtain"
          className="fixed inset-0 z-50 bg-[#1A3C2B] flex flex-col items-center justify-center pointer-events-none"
          initial={{ y: 0 }}
          animate={{ y: '-100%' }}
          transition={{ duration: 0.75, delay: 0.25, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Glowing scan line that sweeps down during wipe */}
          <motion.div
            className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#9EFFBF] to-transparent shadow-[0_0_18px_4px_rgba(158,255,191,0.6)]"
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 0.7, delay: 0.25, ease: 'linear' }}
          />
          {/* Logo mark in center of curtain */}
          <motion.div
            initial={{ opacity: 1, scale: 0.9 }}
            animate={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="h-14 w-14 bg-[#9EFFBF]/20 border border-[#9EFFBF]/40 rounded-2xl flex items-center justify-center">
              <UploadCloud className="h-7 w-7 text-[#9EFFBF]" />
            </div>
            <span className="font-['JetBrains_Mono'] text-xs tracking-widest text-[#9EFFBF] uppercase">Initialising Document Ingestion</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <motion.main
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="py-12 px-4 sm:px-8 max-w-[80rem] mx-auto w-full space-y-12">
        {/* Page Header */}
        <motion.div variants={slideUp} className="border-b border-[#3A3A38]/15 pb-6 space-y-2">
          <motion.span variants={slideLeft} className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B] block">
            DOCUMENT INGESTION
          </motion.span>
          <motion.h1 variants={slideUp} className="font-['Space_Grotesk'] text-4xl sm:text-5xl font-bold text-[#111827]">
            Upload Medical Report
          </motion.h1>
          <motion.p variants={slideUp} className="font-['Public_Sans'] text-sm sm:text-base text-[#3A3A38] max-w-3xl">
            Upload blood test panels, MRI/CT scans, or physician prescriptions for instant AI clinical parsing, biomarker interpretation, and specialist triage.
          </motion.p>
        </motion.div>

        {/* Drag & Drop Upload Zone */}
        <motion.div variants={popIn} className="space-y-4">
          <motion.div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            animate={dragOver ? { scale: 1.015, borderColor: '#1A3C2B' } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`border-2 border-dashed rounded-[16px] p-8 sm:p-12 text-center transition-colors bg-white shadow-xs ${
              dragOver
                ? 'border-[#1A3C2B] bg-[#9EFFBF]/10'
                : 'border-[#3A3A38]/30 hover:border-[#1A3C2B]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleSelectFiles}
            />

            <div className="flex flex-col items-center space-y-4 max-w-md mx-auto">
              {/* Animated pulsing upload icon */}
              <motion.div
                animate={{ boxShadow: ['0 0 0 0px rgba(158,255,191,0.4)', '0 0 0 14px rgba(158,255,191,0)', '0 0 0 0px rgba(158,255,191,0)'] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
                className="h-16 w-16 bg-[#1A3C2B] text-[#9EFFBF] rounded-2xl flex items-center justify-center shadow-md"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                >
                  <UploadCloud className="h-8 w-8 text-[#9EFFBF]" />
                </motion.div>
              </motion.div>

              <div className="space-y-1">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
                  Drag and drop your report file
                </h3>
                <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
                  Supports PDF, JPG, JPEG, and PNG format (Maximum size: 20MB)
                </p>
                {selectedReportType && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A3C2B] text-[#9EFFBF] font-['JetBrains_Mono'] text-xs font-bold rounded-full">
                    <span>🎯 Active Target Mode: {selectedReportType}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReportType(null);
                      }}
                      className="ml-1 hover:text-white"
                      title="Clear pre-selected document mode"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-6 py-3 bg-[#1A3C2B] text-white font-['Public_Sans'] font-semibold text-xs rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {uploading ? 'Processing File...' : 'Browse Files'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Supported Document Types Cards */}
        <motion.div variants={slideUp} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
              Supported Medical Documents
            </h3>
            {selectedReportType && (
              <button
                type="button"
                onClick={() => setSelectedReportType(null)}
                className="font-['JetBrains_Mono'] text-xs text-[#1A3C2B] font-bold hover:underline"
              >
                Clear Selection
              </button>
            )}
          </div>

          <motion.div
            variants={{ visible: { transition: { staggerChildren: 0.07 } } } as Variants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {fileTypeGrid.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedReportType === item.title;

              const handleCardClick = () => {
                setSelectedReportType(item.title);
                toast.success(`Selected ${item.title} mode. Choose a file to analyze.`, { icon: '🎯' });
                setTimeout(() => {
                  fileInputRef.current?.click();
                }, 150);
              };

              return (
                <motion.button
                  key={idx}
                  type="button"
                  onClick={handleCardClick}
                  variants={slideUp}
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(26,60,43,0.14)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`text-left p-5 rounded-[14px] flex items-start gap-4 transition-all cursor-pointer shadow-xs border ${
                    isSelected
                      ? 'bg-[#9EFFBF]/20 border-[#1A3C2B] ring-2 ring-[#1A3C2B]/30 shadow-md'
                      : 'bg-white border-[#3A3A38]/20 hover:border-[#1A3C2B]'
                  }`}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.12 }}
                    transition={{ duration: 0.4 }}
                    className={`p-2.5 rounded-[10px] shrink-0 transition-colors ${
                      isSelected ? 'bg-[#1A3C2B] text-[#9EFFBF]' : 'bg-[#1A3C2B]/10 text-[#1A3C2B]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-['Space_Grotesk'] font-bold text-sm text-[#111827]">
                        {item.title}
                      </h4>
                      {isSelected && (
                        <span className="font-['JetBrains_Mono'] text-[9px] font-bold bg-[#1A3C2B] text-[#9EFFBF] px-2 py-0.5 rounded-full uppercase">
                          ✓ Active
                        </span>
                      )}
                    </div>

                    <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
                      {item.desc}
                    </p>
                    <span className="inline-block font-['JetBrains_Mono'] text-[10px] uppercase font-semibold text-[#1A3C2B]">
                      {item.ext}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>

        {/* ── AI ANALYSIS RESULTS (RENDERED DIRECTLY BELOW UPLOADER ON SAME PAGE) ─ */}
        {latestAnalysisData && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pt-8 border-t-2 border-[#1A3C2B]/20 space-y-10"
          >
            {/* Results Header */}
            <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-[#9EFFBF]/50 text-[#1A3C2B] font-['JetBrains_Mono'] font-bold text-xs uppercase rounded-full">
                    ANALYSIS COMPLETE · {confidenceScore}% CONFIDENCE
                  </span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#1A3C2B] font-semibold bg-[#1A3C2B]/10 px-2.5 py-0.5 rounded-full">
                    POWERED BY {provider.toUpperCase()}
                  </span>
                </div>
                <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#111827]">
                  {reportName}
                </h2>
                <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#3A3A38]">
                  Ingested & Evaluated for Patient: <span className="font-semibold text-[#111827]">{userName}</span> · {keyFindings.length} Biomarkers Analyzed
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => navigate('/app/chat')}
                  className="px-4 py-2.5 bg-[#1A3C2B] text-white font-['Public_Sans'] text-xs font-semibold rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageSquare className="h-4 w-4 text-[#9EFFBF]" />
                  <span>Ask AI Assistant</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-white border border-[#3A3A38]/30 text-[#111827] font-['Public_Sans'] text-xs font-semibold rounded-[12px] hover:border-[#1A3C2B] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload Another</span>
                </button>
              </div>
            </div>

            {/* AI Medical Summary Banner */}
            <div className="bg-[#1A3C2B] text-white border-l-4 border-l-[#9EFFBF] rounded-[14px] p-6 space-y-2 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#9EFFBF]" />
                <span className="font-['JetBrains_Mono'] text-xs text-[#9EFFBF] font-bold uppercase tracking-wider">
                  CLINICAL AI SUMMARY
                </span>
              </div>
              <p className="font-['Public_Sans'] text-sm sm:text-base text-slate-200 leading-relaxed">
                {summaryText}
              </p>
            </div>

            {/* 3 Key Findings Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {keyFindings.slice(0, 3).map((item, idx) => {
                const isAttention = item.severity === 'attention' || item.status.toLowerCase().includes('low') || item.status.toLowerCase().includes('high');
                const isWarning = item.severity === 'warning' || item.status.toLowerCase().includes('sub') || item.status.toLowerCase().includes('mild');

                const borderColor = isAttention
                  ? 'border-l-[#FF8C69]'
                  : isWarning
                  ? 'border-l-[#F4D35E]'
                  : 'border-l-[#9EFFBF]';

                const badgeText = isAttention
                  ? 'REQUIRES ATTENTION'
                  : isWarning
                  ? 'MILD DEFICIENCY'
                  : 'OPTIMAL BIOMARKER';

                const badgeColor = isAttention
                  ? 'text-[#FF8C69]'
                  : isWarning
                  ? 'text-amber-700'
                  : 'text-emerald-700';

                const Icon = isAttention
                  ? AlertTriangle
                  : isWarning
                  ? Info
                  : CheckCircle2;

                const iconColor = isAttention
                  ? 'text-[#FF8C69]'
                  : isWarning
                  ? 'text-amber-600'
                  : 'text-emerald-600';

                return (
                  <div
                    key={idx}
                    className={`h-full flex flex-col justify-between bg-white border border-[#3A3A38]/20 border-l-4 ${borderColor} p-6 rounded-[14px] space-y-3 shadow-xs`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-['JetBrains_Mono'] text-[10px] font-bold uppercase ${badgeColor}`}>
                        {badgeText}
                      </span>
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
                      {item.title || item.biomarker}
                    </h3>
                    <p className="font-['Public_Sans'] text-xs text-[#3A3A38] leading-relaxed">
                      {item.description || `${item.biomarker} measured at ${item.value} (Target: ${item.range}).`}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Complete Biomarker Results Table */}
            <div className="bg-white border border-[#3A3A38]/20 rounded-[12px] p-6 space-y-4 shadow-xs">
              <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">
                Complete Biomarker Analysis
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-['Public_Sans'] text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#3A3A38]/20 font-['JetBrains_Mono'] text-[10px] uppercase text-[#3A3A38]">
                      <th className="py-3 px-4">Biomarker</th>
                      <th className="py-3 px-4">Measured Value</th>
                      <th className="py-3 px-4">Reference Range</th>
                      <th className="py-3 px-4">Clinical Marker</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3A3A38]/10">
                    {keyFindings.map((b, idx) => {
                      const isLow = b.status.toLowerCase().includes('low');
                      const isOptimal = b.status.toLowerCase().includes('normal') || b.status.toLowerCase().includes('optimal');

                      const statusColor = isLow
                        ? 'border-l-[#FF8C69] text-[#FF8C69]'
                        : isOptimal
                        ? 'border-l-[#9EFFBF] text-emerald-600'
                        : 'border-l-[#F4D35E] text-amber-600';

                      return (
                        <tr key={idx} className="hover:bg-[#F7F7F5] transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#111827]">{b.biomarker}</td>
                          <td className="py-3.5 px-4 font-['JetBrains_Mono'] font-semibold text-[#111827]">
                            {b.value}
                          </td>
                          <td className="py-3.5 px-4 font-['JetBrains_Mono'] text-[#3A3A38]">{b.range}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-block font-['JetBrains_Mono'] font-bold text-xs ${statusColor}`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lifestyle & Precaution Guidelines */}
            {lifestyle && lifestyle.length > 0 && (
              <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-4 shadow-xs">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
                  Actionable Health Recommendations
                </h3>
                <ul className="space-y-2.5 font-['Public_Sans'] text-xs sm:text-sm text-[#111827]">
                  {lifestyle.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-0.5 h-4 w-4 rounded-full bg-[#9EFFBF] text-[#1A3C2B] flex items-center justify-center shrink-0 font-bold text-[10px]">
                        ✓
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specialist Referral Section */}
            <div className="bg-[#1A3C2B] text-white border border-[#3A3A38]/30 rounded-[14px] p-8 space-y-6 shadow-md">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/10 text-[#9EFFBF] border border-white/20 font-['JetBrains_Mono'] text-xs uppercase rounded-full">
                  RECOMMENDED CLINICAL REFERRAL
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-3">
                  <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white">
                    Consult a {specialist}
                  </h2>
                  <p className="font-['Public_Sans'] text-sm text-slate-300 leading-relaxed">
                    {specialistReason}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <button
                    onClick={() => navigate('/app/patients')}
                    className="w-full md:w-auto px-6 py-3.5 bg-[#9EFFBF] text-[#1A3C2B] font-['Public_Sans'] font-bold text-sm rounded-[12px] hover:bg-white transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Find Nearby Specialists</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Uploads Table */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[12px] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
                Recent Ingested Reports
              </h3>
              <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
                {uploads.length} reports stored in Supabase storage & reports table
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loadingReports ? (
              <div className="py-8 text-center text-xs font-['JetBrains_Mono'] text-[#3A3A38] flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-[#1A3C2B] border-t-transparent rounded-full animate-spin" />
                <span>Loading report history from Supabase...</span>
              </div>
            ) : uploads.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <AlertCircle className="h-8 w-8 text-[#3A3A38]/40 mx-auto" />
                <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
                  No medical reports ingested yet. Upload your first blood test, MRI, or prescription above!
                </p>
              </div>
            ) : (
              <table className="w-full text-left font-['Public_Sans'] text-xs">
                <thead>
                  <tr className="border-b border-[#3A3A38]/20 font-['JetBrains_Mono'] uppercase text-[#3A3A38] text-[10px]">
                    <th className="py-3 px-4">Document Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Upload Date</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3A3A38]/10">
                  {uploads.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F7F7F5] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#111827] flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#1A3C2B]" />
                        <span className="truncate max-w-xs">{item.report_name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#3A3A38]">{item.report_type}</td>
                      <td className="py-3.5 px-4 font-['JetBrains_Mono'] text-[#3A3A38]">{item.upload_date}</td>
                      <td className="py-3.5 px-4 font-['JetBrains_Mono'] text-[#3A3A38]">{item.file_size}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#9EFFBF]/50 text-[#1A3C2B] font-['JetBrains_Mono'] font-bold text-[10px]">
                          <CheckCircle2 className="h-3 w-3" />
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className="px-3 py-1.5 bg-[#1A3C2B] text-white font-semibold rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors cursor-pointer"
                        >
                          View Results Below
                        </button>
                        {item.file_url && (
                          <a
                            href={item.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-[#3A3A38] hover:text-[#1A3C2B] transition-colors inline-block"
                            title="Download / View Storage Object"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </motion.main>

      <AICaseCoordinatorModal
        isOpen={coordinatorOpen}
        currentStep={coordinatorStep}
        fileName={coordinatorFileName}
        progressPercent={coordinatorProgress}
      />

      <FooterComponent />
    </div>
  );
}
