import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Activity, Calendar, FileText, Upload,
  Sparkles, ArrowRight, Pill, Clock, ChevronRight, BarChart3,
  AlertTriangle, CheckCircle2, Info,
} from 'lucide-react';
import { REPORT_TYPE_META, ReportType } from '@/data/labNormalRanges';

/* ─────────────────────────── Types ───────────────────────────────────────── */
interface AnalysisRecord {
  id: string;
  report_name: string;
  report_type: string;
  analyzed_at: string;
  overall_status?: string;
  risk_level?: string;
  confidence_score?: number;
  summary?: string;
  abnormal_count?: number;
  normal_count?: number;
  critical_count?: number;
  biomarkers?: any[];
  key_findings?: any[];
}

/* ─────────────────────────── Helpers ─────────────────────────────────────── */
function getStoredAnalyses(): AnalysisRecord[] {
  const results: AnalysisRecord[] = [];
  try {
    // Check latest analysis
    const latest = localStorage.getItem('meditrack_latest_analysis');
    if (latest) {
      const parsed = JSON.parse(latest);
      const analysis = parsed.analysis || parsed;
      results.push({
        id: parsed.id || `local_${Date.now()}`,
        report_name: parsed.report_name || 'Medical Report',
        report_type: analysis.report_type || parsed.report_type || 'General',
        analyzed_at: parsed.analyzed_at || new Date().toISOString(),
        overall_status: analysis.overall_status || analysis.risk_level,
        risk_level: analysis.risk_level,
        confidence_score: analysis.confidence_score,
        summary: analysis.summary,
        abnormal_count: analysis.abnormal_count,
        normal_count: analysis.normal_count,
        critical_count: analysis.critical_count,
        biomarkers: analysis.biomarkers || [],
        key_findings: analysis.key_findings || [],
      });
    }

    // Check for history array
    const history = localStorage.getItem('meditrack_analysis_history');
    if (history) {
      const arr = JSON.parse(history);
      if (Array.isArray(arr)) {
        arr.forEach((item: any) => {
          if (!results.find(r => r.id === item.id)) {
            const a = item.analysis || item;
            results.push({ ...item, ...a, biomarkers: a.biomarkers || [], key_findings: a.key_findings || [] });
          }
        });
      }
    }
  } catch {}
  return results.sort((a, b) => new Date(b.analyzed_at).getTime() - new Date(a.analyzed_at).getTime());
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

/* ─────────────────────────── Status Badge ────────────────────────────────── */
function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s.includes('critical')) return (
    <span className="font-['JetBrains_Mono'] text-[9px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">CRITICAL</span>
  );
  if (s.includes('attention')) return (
    <span className="font-['JetBrains_Mono'] text-[9px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">ATTENTION</span>
  );
  if (s.includes('borderline') || s.includes('moderate')) return (
    <span className="font-['JetBrains_Mono'] text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">BORDERLINE</span>
  );
  return (
    <span className="font-['JetBrains_Mono'] text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">NORMAL</span>
  );
}

/* ─────────────────────────── Timeline Card ───────────────────────────────── */
function TimelineCard({ record, index }: { record: AnalysisRecord; index: number }) {
  const typeMeta = REPORT_TYPE_META[(record.report_type as ReportType)] || REPORT_TYPE_META['General'];
  const abnormal = (record.abnormal_count || 0) + (record.critical_count || 0);
  const normal = record.normal_count || 0;
  const total = abnormal + normal;

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Timeline connector */}
      {index > 0 && (
        <div className="absolute left-6 -top-4 w-0.5 h-4 bg-[#3A3A38]/20" />
      )}

      <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-4 hover:shadow-md transition-shadow group flex items-start gap-4">
        {/* Type icon */}
        <div className={`h-12 w-12 ${typeMeta.bg} rounded-[12px] flex items-center justify-center text-xl shrink-0 border border-current/10 ${typeMeta.color}`}>
          {typeMeta.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="font-['Space_Grotesk'] text-sm font-bold text-[#111827] truncate">{record.report_name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`font-['JetBrains_Mono'] text-[10px] font-bold ${typeMeta.color}`}>
                  {typeMeta.label}
                </span>
                <span className="text-[#3A3A38]/40">·</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38] flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(record.analyzed_at)}
                </span>
              </div>
            </div>
            <StatusBadge status={record.overall_status || record.risk_level} />
          </div>

          {/* Stats bar */}
          {total > 0 && (
            <div className="mt-2.5 space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-[#F7F7F5] rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-400 rounded-l-full"
                    style={{ width: `${total > 0 ? (normal / total) * 100 : 0}%` }}
                  />
                  <div
                    className="h-full bg-red-400"
                    style={{ width: `${total > 0 ? (abnormal / total) * 100 : 0}%` }}
                  />
                </div>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38] whitespace-nowrap">
                  {normal}N · {abnormal}A
                </span>
              </div>
            </div>
          )}

          {/* Summary snippet */}
          {record.summary && (
            <p className="font-['Public_Sans'] text-xs text-[#3A3A38] mt-2 line-clamp-2">
              {record.summary}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────── Trend Insight Card ─────────────────────────── */
function TrendInsightCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-gradient-to-br from-[#1A3C2B] to-[#0D2419] text-white rounded-[16px] p-6 space-y-4"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[#9EFFBF]" />
        <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#9EFFBF] uppercase tracking-widest">
          AI Trend Insights
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-3 bg-white/10 rounded-[10px] p-3">
          <Info className="h-4 w-4 text-[#9EFFBF] shrink-0 mt-0.5" />
          <p className="font-['Public_Sans'] text-xs text-white/80 leading-relaxed">
            Upload more reports over time to unlock health trend analysis — tracking improvements or changes in your biomarkers across months.
          </p>
        </div>
        <div className="flex items-start gap-3 bg-white/10 rounded-[10px] p-3">
          <Activity className="h-4 w-4 text-[#9EFFBF] shrink-0 mt-0.5" />
          <p className="font-['Public_Sans'] text-xs text-white/80 leading-relaxed">
            The AI Health Timeline will identify patterns such as improving hemoglobin, rising blood sugar, or stable kidney function — always noting these are informational, not a diagnosis.
          </p>
        </div>
      </div>
      <p className="font-['JetBrains_Mono'] text-[9px] text-white/40 italic">
        Trend analysis activates after 2+ reports of the same type.
      </p>
    </motion.div>
  );
}

/* ─────────────────────────── Main Page ───────────────────────────────────── */
export default function HealthTimelinePage() {
  const [curtainDone, setCurtainDone] = useState(false);
  const [records, setRecords] = useState<AnalysisRecord[]>([]);

  useEffect(() => {
    setRecords(getStoredAnalyses());
  }, []);

  const hasRecords = records.length > 0;

  return (
    <div className="relative min-h-screen bg-[#F7F7F5]">
      {/* ── Curtain Entrance ─────────────────────── */}
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
              className="absolute inset-x-0 h-px bg-[#9EFFBF] shadow-[0_0_16px_4px_rgba(158,255,191,0.5)]"
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{ duration: 0.6, ease: 'linear', delay: 0.1 }}
            />
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="h-12 w-12 bg-[#9EFFBF]/20 rounded-[14px] border border-[#9EFFBF]/40 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#9EFFBF]" />
              </div>
              <p className="font-['JetBrains_Mono'] text-[#9EFFBF] text-xs tracking-[0.3em] uppercase">
                Health Timeline
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Header ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: curtainDone ? 1 : 0, y: curtainDone ? 0 : 24 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A3C2B]">
              MEDITRACK AI — Phase 9
            </span>
            <span className="h-px flex-1 bg-[#1A3C2B]/20" />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
                Health Timeline
              </h1>
              <p className="font-['Public_Sans'] text-sm text-[#3A3A38] mt-1">
                Your complete medical report history in chronological order — with AI trend insights.
              </p>
            </div>
            <Link
              to="/app/upload"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1A3C2B] text-white rounded-[12px] font-['Public_Sans'] text-sm font-bold hover:bg-[#1A3C2B]/90 transition-colors shrink-0"
            >
              <Upload className="h-4 w-4" />
              Add Report
            </Link>
          </div>
        </motion.div>

        {/* ── Stats Strip ────────────────────────── */}
        {curtainDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { label: 'Total Reports', value: records.length, icon: FileText, color: 'text-[#1A3C2B]' },
              { label: 'Abnormal Found', value: records.reduce((a, r) => a + (r.abnormal_count || 0), 0), icon: AlertTriangle, color: 'text-orange-600' },
              { label: 'Normal Values', value: records.reduce((a, r) => a + (r.normal_count || 0), 0), icon: CheckCircle2, color: 'text-emerald-600' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-4 text-center">
                <Icon className={`h-5 w-5 ${color} mx-auto mb-1.5`} />
                <p className={`font-['JetBrains_Mono'] text-2xl font-black ${color}`}>{value}</p>
                <p className="font-['Public_Sans'] text-[10px] text-[#3A3A38] font-semibold">{label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Timeline ────────────────────────────── */}
        {hasRecords ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: curtainDone ? 1 : 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#1A3C2B]" />
              <span className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest text-[#1A3C2B]">
                Report History
              </span>
            </div>

            <div className="space-y-4 pl-3 border-l-2 border-[#1A3C2B]/15">
              {records.map((record, i) => (
                <div key={record.id} className="relative pl-4">
                  {/* Timeline dot */}
                  <div className="absolute -left-[9px] top-5 h-4 w-4 rounded-full border-2 border-[#1A3C2B] bg-white" />
                  <TimelineCard record={record} index={i} />
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          curtainDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white border border-[#3A3A38]/20 rounded-[18px] p-12 text-center space-y-5"
            >
              <div className="h-16 w-16 bg-[#1A3C2B]/8 rounded-[16px] flex items-center justify-center mx-auto">
                <TrendingUp className="h-8 w-8 text-[#1A3C2B]" />
              </div>
              <div>
                <h2 className="font-['Space_Grotesk'] text-xl font-black text-[#111827]">
                  Your Timeline is Empty
                </h2>
                <p className="font-['Public_Sans'] text-sm text-[#3A3A38] mt-2 max-w-sm mx-auto">
                  Upload and analyse your first medical report to start building your personal health timeline.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  to="/app/upload"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A3C2B] text-white rounded-[12px] font-['Public_Sans'] text-sm font-bold"
                >
                  <Upload className="h-4 w-4" />
                  Upload a Report
                </Link>
              </div>
            </motion.div>
          )
        )}

        {/* ── AI Trend Insights ──────────────────── */}
        {curtainDone && <TrendInsightCard />}

        {/* ── Report Type Legend ─────────────────── */}
        {curtainDone && hasRecords && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-5 space-y-3"
          >
            <p className="font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-widest text-[#1A3C2B]">
              Supported Report Types
            </p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(REPORT_TYPE_META) as [ReportType, any][]).map(([type, meta]) => (
                <span key={type} className={`font-['JetBrains_Mono'] text-[9px] px-2.5 py-1 rounded-full border ${meta.bg} ${meta.color} border-current/20`}>
                  {meta.icon} {meta.label}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
