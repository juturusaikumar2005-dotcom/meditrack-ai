import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertOctagon, Activity, FileText, Calendar, Building2, User, Stethoscope } from 'lucide-react';
import { REPORT_TYPE_META, ReportType } from '@/data/labNormalRanges';

interface ReportSummaryBannerProps {
  reportType?: string;
  overallStatus?: string;
  riskLevel?: string;
  confidenceScore?: number;
  summary?: string;
  normalCount?: number;
  abnormalCount?: number;
  criticalCount?: number;
  patientName?: string | null;
  labName?: string | null;
  collectionDate?: string | null;
  doctorName?: string | null;
  reportName?: string;
  provider?: string;
}

const OVERALL_STATUS_CONFIG = {
  Normal: { bg: 'bg-emerald-50', border: 'border-emerald-300', ring: 'border-emerald-500', text: 'text-emerald-700', icon: CheckCircle2, label: 'All Normal' },
  Borderline: { bg: 'bg-amber-50', border: 'border-amber-300', ring: 'border-amber-500', text: 'text-amber-700', icon: AlertTriangle, label: 'Borderline Values' },
  'Attention Needed': { bg: 'bg-orange-50', border: 'border-orange-300', ring: 'border-orange-500', text: 'text-orange-700', icon: AlertTriangle, label: 'Attention Needed' },
  Critical: { bg: 'bg-red-50', border: 'border-red-300', ring: 'border-red-500', text: 'text-red-700', icon: AlertOctagon, label: 'Critical Values' },
  Low: { bg: 'bg-orange-50', border: 'border-orange-300', ring: 'border-orange-500', text: 'text-orange-700', icon: AlertTriangle, label: 'Attention Needed' },
  Moderate: { bg: 'bg-amber-50', border: 'border-amber-300', ring: 'border-amber-500', text: 'text-amber-700', icon: AlertTriangle, label: 'Borderline Values' },
  'Attention': { bg: 'bg-orange-50', border: 'border-orange-300', ring: 'border-orange-500', text: 'text-orange-700', icon: AlertTriangle, label: 'Attention Needed' },
};

const DEFAULT_STATUS = { bg: 'bg-[#F7F7F5]', border: 'border-[#3A3A38]/20', ring: 'border-[#1A3C2B]', text: 'text-[#1A3C2B]', icon: Activity, label: 'Analysed' };

export function ReportSummaryBanner({
  reportType, overallStatus, riskLevel, confidenceScore, summary,
  normalCount, abnormalCount, criticalCount, patientName, labName,
  collectionDate, doctorName, reportName, provider,
}: ReportSummaryBannerProps) {
  const statusKey = overallStatus || riskLevel || 'Normal';
  const cfg = OVERALL_STATUS_CONFIG[statusKey as keyof typeof OVERALL_STATUS_CONFIG] || DEFAULT_STATUS;
  const StatusIcon = cfg.icon;

  const detectedType = (reportType || 'General') as ReportType;
  const typeMeta = REPORT_TYPE_META[detectedType] || REPORT_TYPE_META['General'];

  const total = (normalCount || 0) + (abnormalCount || 0);
  const abnormalTotal = (abnormalCount || 0) + (criticalCount || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`${cfg.bg} ${cfg.border} border rounded-[18px] p-6 space-y-5`}
    >
      {/* Top row: report type + overall status */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {/* Report type badge */}
          <div className={`h-12 w-12 rounded-[12px] ${typeMeta.bg} ${typeMeta.color} flex items-center justify-center text-2xl shrink-0 border border-current/20`}>
            {typeMeta.icon}
          </div>
          <div>
            <p className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38] uppercase tracking-widest">
              Report Type
            </p>
            <p className="font-['Space_Grotesk'] text-lg font-black text-[#111827]">
              {typeMeta.label}
            </p>
            {provider && (
              <p className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38]">
                Analysed by {provider}
              </p>
            )}
          </div>
        </div>

        {/* Overall status ring */}
        <div className="flex flex-col items-center gap-1">
          <div className={`h-16 w-16 rounded-full border-4 ${cfg.ring} flex items-center justify-center`}>
            <StatusIcon className={`h-7 w-7 ${cfg.text}`} />
          </div>
          <span className={`font-['JetBrains_Mono'] text-[9px] font-bold ${cfg.text} uppercase text-center`}>
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/70 rounded-[10px] p-3 text-center">
          <p className="font-['JetBrains_Mono'] text-2xl font-black text-emerald-600">{normalCount ?? '—'}</p>
          <p className="font-['Public_Sans'] text-[10px] text-[#3A3A38] font-semibold">Normal</p>
        </div>
        <div className="bg-white/70 rounded-[10px] p-3 text-center">
          <p className={`font-['JetBrains_Mono'] text-2xl font-black ${abnormalTotal > 0 ? 'text-orange-600' : 'text-[#3A3A38]/40'}`}>
            {abnormalTotal > 0 ? abnormalTotal : '0'}
          </p>
          <p className="font-['Public_Sans'] text-[10px] text-[#3A3A38] font-semibold">Abnormal</p>
        </div>
        <div className="bg-white/70 rounded-[10px] p-3 text-center">
          <p className={`font-['JetBrains_Mono'] text-2xl font-black ${criticalCount && criticalCount > 0 ? 'text-red-600' : 'text-[#3A3A38]/40'}`}>
            {criticalCount ?? '0'}
          </p>
          <p className="font-['Public_Sans'] text-[10px] text-[#3A3A38] font-semibold">Critical</p>
        </div>
      </div>

      {/* Critical alert */}
      {criticalCount != null && criticalCount > 0 && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2.5 bg-red-600 text-white rounded-[10px] px-4 py-3"
        >
          <AlertOctagon className="h-4 w-4 shrink-0" />
          <p className="font-['Public_Sans'] text-xs font-bold">
            {criticalCount} critical value{criticalCount > 1 ? 's' : ''} detected — seek immediate medical attention.
          </p>
        </motion.div>
      )}

      {/* Summary */}
      {summary && (
        <div className="space-y-1.5">
          <p className="font-['JetBrains_Mono'] text-[9px] font-bold text-[#3A3A38] uppercase tracking-widest">
            Clinical Summary
          </p>
          <p className="font-['Public_Sans'] text-sm text-[#111827] leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Metadata row */}
      {(patientName || labName || collectionDate || doctorName) && (
        <div className="flex flex-wrap gap-4 pt-3 border-t border-current/10">
          {patientName && (
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#3A3A38]" />
              <span className="font-['Public_Sans'] text-xs text-[#3A3A38]">{patientName}</span>
            </div>
          )}
          {doctorName && (
            <div className="flex items-center gap-1.5">
              <Stethoscope className="h-3.5 w-3.5 text-[#3A3A38]" />
              <span className="font-['Public_Sans'] text-xs text-[#3A3A38]">{doctorName}</span>
            </div>
          )}
          {labName && (
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-[#3A3A38]" />
              <span className="font-['Public_Sans'] text-xs text-[#3A3A38]">{labName}</span>
            </div>
          )}
          {collectionDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#3A3A38]" />
              <span className="font-['Public_Sans'] text-xs text-[#3A3A38]">{collectionDate}</span>
            </div>
          )}
          {confidenceScore != null && (
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#3A3A38]" />
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38]">
                AI Confidence: <span className="font-bold text-[#1A3C2B]">{Math.round(confidenceScore)}%</span>
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
