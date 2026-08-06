import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  Brain,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Activity,
  CheckCircle2,
  Loader2,
  Bot,
} from 'lucide-react';

export interface CoordinatorStep {
  id: number;
  agentName: string;
  title: string;
  description: string;
  icon: any;
  status: 'pending' | 'active' | 'completed';
}

interface AICaseCoordinatorModalProps {
  isOpen: boolean;
  currentStep: number; // 1 to 7
  fileName: string;
  progressPercent: number;
  onComplete?: () => void;
}

export function AICaseCoordinatorModal({
  isOpen,
  currentStep,
  fileName,
  progressPercent,
}: AICaseCoordinatorModalProps) {
  if (!isOpen) return null;

  const steps: CoordinatorStep[] = [
    {
      id: 1,
      agentName: 'Ingestion Agent',
      title: 'Report Ingestion & Validation',
      description: 'Validating file integrity, format tokens and HIPAA encryption bounds...',
      icon: UploadCloud,
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'pending',
    },
    {
      id: 2,
      agentName: 'Extraction Agent',
      title: 'Optical Biomarker Extraction',
      description: 'Parsing lab tables, numerical values, units, and optical medical text...',
      icon: FileText,
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'pending',
    },
    {
      id: 3,
      agentName: 'Interpretation Agent',
      title: 'Biomarker Reference Evaluation',
      description: 'Cross-referencing laboratory reference ranges (Ferritin, Glucose, Hb, WBC)...',
      icon: Brain,
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : 'pending',
    },
    {
      id: 4,
      agentName: 'Risk Assessor Agent',
      title: 'Clinical Severity & Risk Assessment',
      description: 'Evaluating abnormal threshold flags and classifying risk bounds...',
      icon: ShieldCheck,
      status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'active' : 'pending',
    },
    {
      id: 5,
      agentName: 'Gemini Synthesis Agent',
      title: 'AI Medical Insight Generation',
      description: 'Querying Google Gemini API for structured plain-English clinical summary...',
      icon: Sparkles,
      status: currentStep > 5 ? 'completed' : currentStep === 5 ? 'active' : 'pending',
    },
    {
      id: 6,
      agentName: 'Triage Specialist Agent',
      title: 'Specialist Referral Routing',
      description: 'Triage rules engine matching findings to relevant medical specialists...',
      icon: Stethoscope,
      status: currentStep > 6 ? 'completed' : currentStep === 6 ? 'active' : 'pending',
    },
    {
      id: 7,
      agentName: 'Persistence Agent',
      title: 'Supabase Storage & Database Commit',
      description: 'Persisting object to medical-reports bucket and committing analysis_results...',
      icon: Activity,
      status: currentStep > 7 ? 'completed' : currentStep === 7 ? 'active' : 'pending',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-white border border-[#3A3A38]/20 rounded-[16px] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden font-['Public_Sans']"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#3A3A38]/15">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center rounded-[12px] shadow-xs">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-['JetBrains_Mono'] text-[10px] uppercase font-bold text-[#1A3C2B] bg-[#9EFFBF]/50 px-2.5 py-0.5 rounded-full">
                    AI CASE COORDINATOR
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38]">
                    MULTI-AGENT ORCHESTRATION
                  </span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827] mt-0.5">
                  Analyzing: {fileName}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#1A3C2B]">
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* Master Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-[#F7F7F5] border border-[#3A3A38]/15 h-3 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="h-full bg-[#1A3C2B] rounded-full"
              />
            </div>
            <div className="flex justify-between text-[11px] font-['JetBrains_Mono'] text-[#3A3A38]">
              <span>Step {Math.min(currentStep, 7)} of 7</span>
              <span>
                {currentStep >= 7 ? 'Analysis complete!' : 'Agents executing workflow...'}
              </span>
            </div>
          </div>

          {/* Steps Orchestration List */}
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 no-scrollbar">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.status === 'active';
              const isCompleted = step.status === 'completed';

              return (
                <motion.div
                  key={step.id}
                  initial={false}
                  animate={{
                    backgroundColor: isActive
                      ? 'rgba(158, 255, 191, 0.15)'
                      : isCompleted
                      ? '#FFFFFF'
                      : '#F7F7F5',
                    borderColor: isActive
                      ? '#1A3C2B'
                      : isCompleted
                      ? 'rgba(58, 58, 56, 0.2)'
                      : 'rgba(58, 58, 56, 0.1)',
                  }}
                  className="border rounded-[12px] p-3.5 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`h-9 w-9 rounded-[10px] flex items-center justify-center shrink-0 border ${
                        isCompleted
                          ? 'bg-[#1A3C2B] text-[#9EFFBF] border-[#1A3C2B]'
                          : isActive
                          ? 'bg-[#9EFFBF] text-[#1A3C2B] border-[#1A3C2B]'
                          : 'bg-[#F7F7F5] text-[#3A3A38]/50 border-[#3A3A38]/20'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isActive ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#1A3C2B] uppercase">
                          {step.agentName}
                        </span>
                      </div>
                      <h4 className="font-['Space_Grotesk'] text-sm font-bold text-[#111827]">
                        {step.title}
                      </h4>
                      <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right font-['JetBrains_Mono'] text-[10px] font-bold">
                    {isCompleted && (
                      <span className="text-emerald-700 bg-[#9EFFBF]/50 px-2 py-0.5 rounded-full uppercase">
                        Done
                      </span>
                    )}
                    {isActive && (
                      <span className="text-[#1A3C2B] animate-pulse uppercase">
                        Running
                      </span>
                    )}
                    {!isCompleted && !isActive && (
                      <span className="text-[#3A3A38]/40 uppercase">
                        Queued
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
