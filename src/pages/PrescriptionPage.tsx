import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Upload,
  FileImage,
  X,
  Pill,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  FileText,
  User,
  Building2,
  Calendar,
  ClipboardList,
  Sparkles,
  Activity,
  Shield,
  RotateCcw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MedicineCard } from '@/components/prescription/MedicineCard';
import { MedicationTimeline } from '@/components/prescription/MedicationTimeline';
import { DrugInteractionAlert } from '@/components/prescription/DrugInteractionAlert';
import { PrecautionGrid } from '@/components/prescription/PrecautionCard';
import { ConfidenceIndicator } from '@/components/prescription/ConfidenceIndicator';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* ─────────────────────────── Animation Variants ─────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const PIPELINE_STEPS = [
  { id: 'reading', label: 'Reading Image', icon: FileImage },
  { id: 'ocr', label: 'OCR Processing', icon: FileText },
  { id: 'parsing', label: 'Parsing Prescription', icon: ClipboardList },
  { id: 'validating', label: 'Validating Medicines (FDA)', icon: Shield },
  { id: 'generating', label: 'Generating Schedule', icon: Calendar },
];

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
const MAX_SIZE_MB = 20;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip data URL prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PrescriptionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState<number>(-1); // -1 = idle, 0-4 = pipeline, 5 = done
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Entrance curtain animation
  const [curtainDone, setCurtainDone] = useState(false);

  const handleFile = useCallback((f: File) => {
    if (!ACCEPTED_TYPES.includes(f.type) && !f.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Unsupported file type. Please upload JPG, PNG, WEBP, HEIC or PDF.');
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    setFile(f);
    setResult(null);
    setError(null);
    setStep(-1);

    if (f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, [handleFile]);

  const handleAnalyze = async () => {
    if (!file) return;
    setError(null);
    setResult(null);

    try {
      setStep(0);
      await delay(600);
      const base64 = await fileToBase64(file);

      setStep(1);
      await delay(700);

      setStep(2);
      // Call the backend
      const response = await fetch(`${API_BASE}/ai/analyze-prescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: file.type || 'image/jpeg',
          fileName: file.name,
          userId: 'usr-current',
        }),
      });

      setStep(3);
      await delay(500);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Analysis failed. Please try again.');
      }

      const data = await response.json();
      setStep(4);
      await delay(600);

      setStep(5);
      setResult(data);
      toast.success(`Found ${data.medicine_count} medicine${data.medicine_count !== 1 ? 's' : ''} in your prescription!`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStep(-1);
      toast.error(err.message || 'Analysis failed.');
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setStep(-1);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="relative min-h-screen bg-[#F7F7F5]">
      {/* ── Curtain Entrance Animation ─────────────────── */}
      <AnimatePresence>
        {!curtainDone && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D2419] pointer-events-none"
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
            onAnimationComplete={() => setCurtainDone(true)}
          >
            {/* Scan line sweep */}
            <motion.div
              className="absolute inset-x-0 h-px bg-[#9EFFBF] shadow-[0_0_16px_4px_rgba(158,255,191,0.7)]"
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{ duration: 0.7, ease: 'linear', delay: 0.1 }}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="h-14 w-14 bg-[#9EFFBF]/20 rounded-[16px] border border-[#9EFFBF]/40 flex items-center justify-center">
                <Pill className="h-7 w-7 text-[#9EFFBF]" />
              </div>
              <div className="text-center">
                <p className="font-['JetBrains_Mono'] text-[#9EFFBF] text-xs tracking-[0.3em] uppercase">MEDITRACK AI</p>
                <p className="font-['Space_Grotesk'] text-white text-lg font-bold mt-1">Rx Engine Initialising</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* ── Page Header ─────────────────────────────── */}
        <motion.div
          variants={fadeUp} custom={0} initial="hidden" animate={curtainDone ? 'visible' : 'hidden'}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A3C2B]">
              MEDITRACK AI — Rx Engine
            </span>
            <span className="h-px flex-1 bg-[#1A3C2B]/20" />
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
            Prescription Understanding
          </h1>
          <p className="font-['Public_Sans'] text-sm text-[#3A3A38] max-w-2xl">
            Upload any handwritten or printed prescription. Our AI engine reads, decodes, and generates a complete medication schedule with interactions, precautions, and clinical notes.
          </p>
        </motion.div>

        {/* ── Upload Zone ──────────────────────────────── */}
        {!result && (
          <motion.div
            variants={fadeUp} custom={1} initial="hidden" animate={curtainDone ? 'visible' : 'hidden'}
            className="space-y-4"
          >
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => !file && inputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-[18px] transition-all cursor-pointer overflow-hidden ${
                dragging
                  ? 'border-[#1A3C2B] bg-[#9EFFBF]/10 scale-[1.01]'
                  : file
                  ? 'border-[#1A3C2B]/40 bg-white cursor-default'
                  : 'border-[#3A3A38]/30 bg-white hover:border-[#1A3C2B]/60 hover:bg-[#9EFFBF]/5'
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.webp,.heic,.pdf"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              {file ? (
                <div className="flex items-start gap-5 p-6">
                  {preview ? (
                    <img
                      src={preview}
                      alt="prescription preview"
                      className="h-36 w-28 object-cover rounded-[10px] border border-[#3A3A38]/20 shrink-0"
                    />
                  ) : (
                    <div className="h-36 w-28 bg-[#1A3C2B]/5 rounded-[10px] border border-[#3A3A38]/20 flex items-center justify-center shrink-0">
                      <FileText className="h-8 w-8 text-[#1A3C2B]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 pt-2">
                    <p className="font-['Space_Grotesk'] text-base font-bold text-[#111827] truncate">{file.name}</p>
                    <p className="font-['JetBrains_Mono'] text-xs text-[#3A3A38] mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || 'application/pdf'}
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
                        disabled={step >= 0 && step < 5}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#1A3C2B] text-white rounded-[10px] font-['Public_Sans'] text-sm font-bold hover:bg-[#1A3C2B]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Sparkles className="h-4 w-4" />
                        {step >= 0 && step < 5 ? 'Analysing…' : 'Analyse Prescription'}
                      </motion.button>
                      <button
                        onClick={(e) => { e.stopPropagation(); reset(); }}
                        className="flex items-center gap-1.5 px-3 py-2.5 text-[#3A3A38] hover:text-[#111827] font-['Public_Sans'] text-xs font-semibold transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-16 px-8">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                    className="h-16 w-16 bg-[#1A3C2B]/8 rounded-[16px] border border-[#1A3C2B]/20 flex items-center justify-center"
                  >
                    <Upload className="h-7 w-7 text-[#1A3C2B]" />
                  </motion.div>
                  <div className="text-center">
                    <p className="font-['Space_Grotesk'] text-base font-bold text-[#111827]">
                      Drop your prescription here
                    </p>
                    <p className="font-['Public_Sans'] text-xs text-[#3A3A38] mt-1">
                      or <span className="text-[#1A3C2B] font-semibold underline">browse files</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {['JPG', 'PNG', 'WEBP', 'HEIC', 'PDF'].map(ext => (
                      <span key={ext} className="font-['JetBrains_Mono'] text-[9px] px-2 py-1 bg-[#F7F7F5] border border-[#3A3A38]/20 rounded-full text-[#3A3A38]">
                        {ext}
                      </span>
                    ))}
                    <span className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38]">· Max 20MB</span>
                  </div>
                </div>
              )}

              {dragging && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-[#9EFFBF]/20 flex items-center justify-center pointer-events-none"
                >
                  <p className="font-['Space_Grotesk'] text-lg font-bold text-[#1A3C2B]">Drop to upload</p>
                </motion.div>
              )}
            </div>

            {/* ── Processing Pipeline ──────────────────── */}
            <AnimatePresence>
              {step >= 0 && step < 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-5 space-y-3"
                >
                  <p className="font-['JetBrains_Mono'] text-xs font-bold text-[#1A3C2B] uppercase tracking-widest">
                    AI Pipeline Running…
                  </p>
                  <div className="space-y-2.5">
                    {PIPELINE_STEPS.map((s, i) => {
                      const Icon = s.icon;
                      const done = step > i;
                      const active = step === i;
                      return (
                        <motion.div
                          key={s.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${done ? 'bg-[#1A3C2B]' : active ? 'bg-[#9EFFBF]/30 border-2 border-[#1A3C2B]' : 'bg-[#F7F7F5] border border-[#3A3A38]/20'}`}>
                            {done ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                            ) : active ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                <Icon className="h-3.5 w-3.5 text-[#1A3C2B]" />
                              </motion.div>
                            ) : (
                              <Icon className="h-3.5 w-3.5 text-[#3A3A38]/40" />
                            )}
                          </div>
                          <span className={`font-['Public_Sans'] text-xs font-semibold ${done ? 'text-[#1A3C2B]' : active ? 'text-[#111827]' : 'text-[#3A3A38]/50'}`}>
                            {s.label}
                          </span>
                          {active && (
                            <motion.div
                              className="flex-1 h-0.5 bg-[#F7F7F5] rounded-full overflow-hidden"
                            >
                              <motion.div
                                className="h-full bg-[#1A3C2B]"
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 0.8, ease: 'linear' }}
                              />
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-[12px] px-4 py-3.5"
              >
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-['Public_Sans'] text-xs font-bold text-red-700">Analysis Failed</p>
                  <p className="font-['Public_Sans'] text-xs text-red-600 mt-0.5">{error}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── Results ─────────────────────────────────── */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Header bar */}
              <motion.div
                variants={fadeUp} custom={0} initial="hidden" animate="visible"
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-[#1A3C2B] rounded-[12px] flex items-center justify-center">
                    <Pill className="h-5 w-5 text-[#9EFFBF]" />
                  </div>
                  <div>
                    <p className="font-['Space_Grotesk'] text-lg font-black text-[#111827]">
                      Prescription Analysed
                    </p>
                    <p className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38]">
                      {result.medicine_count} medicine{result.medicine_count !== 1 ? 's' : ''} · via {result.provider}
                    </p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 px-4 py-2 border border-[#3A3A38]/25 rounded-[10px] font-['Public_Sans'] text-xs font-semibold text-[#3A3A38] hover:border-[#1A3C2B] hover:text-[#1A3C2B] transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  New Prescription
                </button>
              </motion.div>

              {/* Prescription metadata */}
              {(result.doctor_name || result.hospital_name || result.patient_name || result.diagnosis) && (
                <motion.div
                  variants={fadeUp} custom={1} initial="hidden" animate="visible"
                  className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-5"
                >
                  <p className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#1A3C2B] uppercase tracking-widest mb-4">
                    Prescription Details
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {result.doctor_name && (
                      <div className="flex items-start gap-2">
                        <Stethoscope className="h-4 w-4 text-[#1A3C2B] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38] uppercase">Doctor</p>
                          <p className="font-['Public_Sans'] text-xs font-semibold text-[#111827]">{result.doctor_name}</p>
                        </div>
                      </div>
                    )}
                    {result.hospital_name && (
                      <div className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 text-[#1A3C2B] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38] uppercase">Hospital</p>
                          <p className="font-['Public_Sans'] text-xs font-semibold text-[#111827]">{result.hospital_name}</p>
                        </div>
                      </div>
                    )}
                    {result.patient_name && (
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-[#1A3C2B] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38] uppercase">Patient</p>
                          <p className="font-['Public_Sans'] text-xs font-semibold text-[#111827]">{result.patient_name}</p>
                        </div>
                      </div>
                    )}
                    {result.diagnosis && (
                      <div className="flex items-start gap-2">
                        <Activity className="h-4 w-4 text-[#1A3C2B] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38] uppercase">Diagnosis</p>
                          <p className="font-['Public_Sans'] text-xs font-semibold text-[#111827]">{result.diagnosis}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {result.doctor_notes && (
                    <div className="mt-4 pt-4 border-t border-[#3A3A38]/10">
                      <p className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38] uppercase tracking-wider mb-1">Doctor Notes</p>
                      <p className="font-['Public_Sans'] text-xs text-[#111827] italic">"{result.doctor_notes}"</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Fallback / error banner */}
              {result.fallback && (
                <motion.div
                  variants={fadeUp} custom={2} initial="hidden" animate="visible"
                  className="bg-amber-50 border border-amber-200 rounded-[12px] px-5 py-4 flex items-start gap-3"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-['Public_Sans'] text-xs font-bold text-amber-700">AI Unavailable — Manual Review Required</p>
                    <p className="font-['Public_Sans'] text-xs text-amber-600 mt-0.5">
                      Automatic prescription parsing could not complete. Please ensure your Gemini API key is configured or try again.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Medicine Cards */}
              {result.medicines?.length > 0 && (
                <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-[#1A3C2B]" />
                    <span className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest text-[#1A3C2B]">
                      Identified Medicines ({result.medicines.length})
                    </span>
                  </div>
                  <div className="space-y-4">
                    {result.medicines.map((med: any, i: number) => (
                      <MedicineCard key={i} medicine={med} index={i} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* No medicines fallback */}
              {result.medicines?.length === 0 && !result.fallback && (
                <motion.div
                  variants={fadeUp} custom={3} initial="hidden" animate="visible"
                  className="bg-white border border-[#3A3A38]/20 rounded-[14px] px-6 py-10 text-center"
                >
                  <Pill className="h-8 w-8 text-[#3A3A38]/30 mx-auto mb-3" />
                  <p className="font-['Space_Grotesk'] text-sm font-bold text-[#111827]">No medicines detected</p>
                  <p className="font-['Public_Sans'] text-xs text-[#3A3A38] mt-1 max-w-xs mx-auto">
                    The AI could not identify any medicines. Please ensure the image is clear, well-lit, and shows the full prescription.
                  </p>
                </motion.div>
              )}

              {/* Medication Timeline */}
              {result.medicines?.length > 0 && (
                <motion.div
                  variants={fadeUp} custom={4} initial="hidden" animate="visible"
                  className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-5 space-y-4"
                >
                  <MedicationTimeline medicines={result.medicines} />
                </motion.div>
              )}

              {/* Drug Interactions */}
              <motion.div
                variants={fadeUp} custom={5} initial="hidden" animate="visible"
                className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-5"
              >
                <DrugInteractionAlert interactions={result.interaction_warnings || []} />
              </motion.div>

              {/* Precautions (aggregate across all medicines) */}
              {result.medicines?.length > 0 && (
                <motion.div
                  variants={fadeUp} custom={6} initial="hidden" animate="visible"
                  className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-5"
                >
                  <PrecautionGrid data={{
                    alcohol_warning: result.medicines.some((m: any) => m.alcohol_warning),
                    driving_warning: result.medicines.some((m: any) => m.driving_warning),
                    pregnancy_warning: result.medicines.find((m: any) => m.pregnancy_warning)?.pregnancy_warning || null,
                    storage: result.medicines[0]?.storage,
                    water_recommendation: result.medicines[0]?.water_recommendation,
                    food_interactions: result.medicines.flatMap((m: any) => m.food_interactions || []),
                    precautions: result.medicines.flatMap((m: any) => m.precautions || []),
                  }} />
                </motion.div>
              )}

              {/* Confidence Report */}
              {result.medicines?.length > 0 && (
                <motion.div variants={fadeUp} custom={7} initial="hidden" animate="visible">
                  <ConfidenceIndicator
                    ocrConfidence={result.ocr_confidence || 0.9}
                    aiConfidence={result.medicines[0]?.ai_confidence || 0.9}
                    fdaValidated={result.medicines.some((m: any) => m.fda_validated)}
                    overall={result.overall_confidence || 0.9}
                  />
                </motion.div>
              )}

              {/* Safety Disclaimer */}
              <motion.div
                variants={fadeUp} custom={8} initial="hidden" animate="visible"
                className="bg-[#1A3C2B] text-white rounded-[14px] px-6 py-5 flex items-start gap-3"
              >
                <Shield className="h-5 w-5 text-[#9EFFBF] shrink-0 mt-0.5" />
                <div>
                  <p className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#9EFFBF] uppercase tracking-widest mb-1">Safety Disclaimer</p>
                  <p className="font-['Public_Sans'] text-xs text-white/80 leading-relaxed">
                    {result.safety_disclaimer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state (no file, no result) ─────── */}
        {!file && !result && curtainDone && (
          <motion.div
            variants={fadeUp} custom={2} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              { icon: FileImage, title: 'Any Format', desc: 'Handwritten, printed, or scanned prescription' },
              { icon: Sparkles, title: 'AI Analysis', desc: 'Powered by Gemini Vision with OpenRouter failover' },
              { icon: Shield, title: 'FDA Validated', desc: 'Medicine names cross-checked against FDA database' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="bg-white border border-[#3A3A38]/15 rounded-[14px] p-5 flex items-start gap-3"
              >
                <div className="h-9 w-9 bg-[#1A3C2B]/8 rounded-[10px] flex items-center justify-center shrink-0">
                  <Icon className="h-4.5 w-4.5 text-[#1A3C2B]" />
                </div>
                <div>
                  <p className="font-['Space_Grotesk'] text-sm font-bold text-[#111827]">{title}</p>
                  <p className="font-['Public_Sans'] text-xs text-[#3A3A38] mt-0.5">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
