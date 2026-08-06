import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Upload,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Activity,
  BrainCircuit,
  Stethoscope,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, type ReportRecord } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { profile, session } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const userId = profile?.id || session?.user?.id || 'usr-demo';
  const userName = profile?.full_name || 'Patient';

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      if (!userId) return;
      setLoading(true);

      // 1. Fetch reports
      const { data: reportsData } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('upload_date', { ascending: false });

      if (isMounted && reportsData && reportsData.length > 0) {
        setReports(reportsData as ReportRecord[]);
      }

      // 2. Fetch latest analysis
      const { data: analysisData } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (isMounted && analysisData && analysisData.length > 0) {
        try {
          const parsed = typeof analysisData[0].result_json === 'string'
            ? JSON.parse(analysisData[0].result_json)
            : analysisData[0].result_json;

          setLatestAnalysis({
            report_name: analysisData[0].report_name || reportsData?.[0]?.report_name || 'Latest Medical Report',
            parsed,
          });
        } catch (err) {
          console.error('[Dashboard Analysis Load Error]:', err);
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    }

    loadDashboardData();

    const handleReportUploaded = () => {
      loadDashboardData();
    };
    window.addEventListener('meditrack_report_uploaded', handleReportUploaded);

    return () => {
      isMounted = false;
      window.removeEventListener('meditrack_report_uploaded', handleReportUploaded);
    };
  }, [userId]);

  const handleDeleteReport = (reportId: string, reportName: string) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    toast.success(`Removed "${reportName}" from recent reports.`);
  };

  const safeReports = Array.isArray(reports) ? reports : [];
  const latestReport = safeReports[0];
  const summaryText = typeof latestAnalysis?.parsed?.summary === 'string' && latestAnalysis.parsed.summary.length > 0
    ? latestAnalysis.parsed.summary
    : 'Comprehensive clinical parsing completed. Results indicate stable blood glucose and hemoglobin levels alongside mild iron reserve (Ferritin) depletion.';

  return (
    <div className="space-y-10 select-none font-['Public_Sans'] pb-12">
      {/* 1. Welcome Card Banner */}
      <div className="bg-white border border-[#3A3A38]/20 rounded-[20px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5">
          <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B] font-bold">
            HEALTH PORTAL DASHBOARD
          </span>
          <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#111827]">
            Welcome back, {userName}
          </h1>
          <p className="font-['Public_Sans'] text-sm sm:text-base text-[#3A3A38]">
            Overview of your uploaded medical reports, latest AI summaries, and diagnostic insights.
          </p>
        </div>

        {/* Quick Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/app/upload')}
            className="px-6 py-3.5 bg-[#1A3C2B] text-white font-semibold text-sm sm:text-base rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Upload className="h-4 w-4" />
            <span>Upload New Report</span>
          </button>
          <button
            onClick={() => navigate('/app/chat')}
            className="px-6 py-3.5 bg-white border border-[#3A3A38]/30 text-[#111827] font-semibold text-sm sm:text-base rounded-[12px] hover:border-[#1A3C2B] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <MessageSquare className="h-4 w-4 text-[#1A3C2B]" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>

      {/* 2. Main 4-Column Balanced Grid (Square / Equal Height Widget Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        
        {/* CARD 1: LATEST REPORT */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25 }}
          className="bg-white border border-[#3A3A38]/20 rounded-[20px] p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-[14px] bg-[#1A3C2B]/10 text-[#1A3C2B] flex items-center justify-center border border-[#1A3C2B]/20">
                <FileText className="h-6 w-6" />
              </div>
              <span className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#1A3C2B] bg-[#9EFFBF]/40 px-3 py-1 rounded-full">
                LATEST REPORT
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-[#111827] line-clamp-2 leading-tight">
                {latestReport ? latestReport.report_name : 'No Reports Uploaded'}
              </h3>
              <p className="font-['Public_Sans'] text-sm text-[#3A3A38] leading-relaxed">
                {latestReport
                  ? `Type: ${latestReport.report_type} • Date: ${latestReport.upload_date}`
                  : 'Upload a blood test panel or diagnostic scan to view AI interpretation.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/ai-analysis')}
            className="w-full py-3.5 bg-[#F7F7F5] border border-[#3A3A38]/20 text-[#111827] font-semibold text-sm sm:text-base rounded-[12px] hover:border-[#1A3C2B] hover:bg-white transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>View AI Analysis</span>
            <ArrowRight className="h-4 w-4 text-[#1A3C2B]" />
          </button>
        </motion.div>

        {/* CARD 2: AI SUMMARY */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25 }}
          className="bg-[#1A3C2B] text-white border border-[#3A3A38]/30 rounded-[20px] p-6 sm:p-7 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-[14px] bg-[#9EFFBF]/20 text-[#9EFFBF] flex items-center justify-center border border-[#9EFFBF]/30">
                <Sparkles className="h-6 w-6" />
              </div>
              <span className="font-['JetBrains_Mono'] text-xs text-[#9EFFBF] font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
                AI CLINICAL SUMMARY
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-white">
                Clinical Insights
              </h3>
              <p className="font-['Public_Sans'] text-sm sm:text-base text-slate-200 leading-relaxed line-clamp-4">
                {summaryText}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/chat')}
            className="w-full py-3.5 bg-[#9EFFBF] text-[#1A3C2B] font-bold text-sm sm:text-base rounded-[12px] hover:bg-white transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Ask AI About This Report</span>
            <MessageSquare className="h-4 w-4" />
          </button>
        </motion.div>

        {/* CARD 3: HEALTH SCORE */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25 }}
          className="bg-white border border-[#3A3A38]/20 rounded-[20px] p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-[14px] bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <Activity className="h-6 w-6" />
              </div>
              <span className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                HEALTH SCORE
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="font-['Space_Grotesk'] text-4xl font-bold text-[#111827]">88</span>
                <span className="font-['JetBrains_Mono'] text-sm font-bold text-[#3A3A38]">/ 100</span>
                <span className="ml-auto font-['JetBrains_Mono'] text-xs font-bold text-emerald-700 bg-[#9EFFBF]/40 px-2.5 py-0.5 rounded-full">
                  Excellent
                </span>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2 font-['Public_Sans'] text-xs">
                <div>
                  <div className="flex justify-between text-[#3A3A38] font-semibold mb-1">
                    <span>Blood Health</span>
                    <span className="font-['JetBrains_Mono'] text-[#1A3C2B]">92%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1A3C2B] w-[92%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#3A3A38] font-semibold mb-1">
                    <span>Metabolism</span>
                    <span className="font-['JetBrains_Mono'] text-amber-700">84%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F4D35E] w-[84%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/ai-analysis')}
            className="w-full py-3.5 bg-[#F7F7F5] border border-[#3A3A38]/20 text-[#111827] font-semibold text-sm sm:text-base rounded-[12px] hover:border-[#1A3C2B] hover:bg-white transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>View Detailed Vitals</span>
            <ArrowRight className="h-4 w-4 text-[#1A3C2B]" />
          </button>
        </motion.div>

        {/* CARD 4: QUICK INSIGHTS */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25 }}
          className="bg-white border border-[#3A3A38]/20 rounded-[20px] p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-[14px] bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <span className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                QUICK INSIGHTS
              </span>
            </div>

            {/* 2x2 Mini Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#F7F7F5] border border-[#3A3A38]/15 rounded-[14px] space-y-1">
                <span className="text-[10px] font-['JetBrains_Mono'] text-[#3A3A38] uppercase font-bold block">
                  📄 Reports
                </span>
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">
                  {safeReports.length}
                </span>
              </div>

              <div className="p-3 bg-[#F7F7F5] border border-[#3A3A38]/15 rounded-[14px] space-y-1">
                <span className="text-[10px] font-['JetBrains_Mono'] text-[#3A3A38] uppercase font-bold block">
                  🤖 AI Analyses
                </span>
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">
                  {latestAnalysis ? '10' : '0'}
                </span>
              </div>

              <div className="p-3 bg-[#F7F7F5] border border-[#3A3A38]/15 rounded-[14px] space-y-1">
                <span className="text-[10px] font-['JetBrains_Mono'] text-[#3A3A38] uppercase font-bold block">
                  🩺 Specialists
                </span>
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">
                  3
                </span>
              </div>

              <div className="p-3 bg-[#F7F7F5] border border-[#3A3A38]/15 rounded-[14px] space-y-1">
                <span className="text-[10px] font-['JetBrains_Mono'] text-[#3A3A38] uppercase font-bold block">
                  📅 Last Upload
                </span>
                <span className="font-['Space_Grotesk'] text-sm font-bold text-[#1A3C2B]">
                  Today
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/history')}
            className="w-full py-3.5 bg-[#F7F7F5] border border-[#3A3A38]/20 text-[#111827] font-semibold text-sm sm:text-base rounded-[12px] hover:border-[#1A3C2B] hover:bg-white transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Explore All Metrics</span>
            <ArrowRight className="h-4 w-4 text-[#1A3C2B]" />
          </button>
        </motion.div>

      </div>

      {/* 3. Recent Reports Section (Responsive Grid of Cards) */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#111827]">
              Recent Medical Reports
            </h2>
            <p className="font-['Public_Sans'] text-sm text-[#3A3A38]">
              {safeReports.length} report documents stored in your personal account
            </p>
          </div>
          <button
            onClick={() => navigate('/app/history')}
            className="inline-flex items-center gap-1.5 text-sm font-['JetBrains_Mono'] text-[#1A3C2B] font-bold hover:underline cursor-pointer"
          >
            <span>View Full History</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm font-['JetBrains_Mono'] text-[#3A3A38] flex items-center justify-center gap-2">
            <div className="h-5 w-5 border-2 border-[#1A3C2B] border-t-transparent rounded-full animate-spin" />
            <span>Loading recent reports...</span>
          </div>
        ) : safeReports.length === 0 ? (
          <div className="bg-white border border-[#3A3A38]/20 rounded-[20px] p-10 text-center space-y-3 shadow-xs">
            <AlertCircle className="h-10 w-10 text-[#3A3A38]/40 mx-auto" />
            <p className="font-['Public_Sans'] text-base text-[#3A3A38]">
              No reports ingested yet. Click "Upload New Report" to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeReports.slice(0, 6).map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-[#3A3A38]/20 rounded-[20px] p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-10 w-10 rounded-[12px] bg-[#1A3C2B]/10 text-[#1A3C2B] flex items-center justify-center border border-[#1A3C2B]/20">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#9EFFBF]/50 text-[#1A3C2B] font-['JetBrains_Mono'] font-bold text-[10px]">
                        <CheckCircle2 className="h-3 w-3" />
                        {item.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteReport(item.id, item.report_name)}
                      className="p-1.5 text-[#3A3A38] hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete Report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#111827] line-clamp-1">
                      {item.report_name}
                    </h3>
                    <div className="flex items-center gap-2.5 text-xs font-['JetBrains_Mono'] text-[#3A3A38] mt-1">
                      <span>Type: {item.report_type}</span>
                      <span>•</span>
                      <span>{item.upload_date}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/app/ai-analysis')}
                  className="w-full py-2.5 bg-[#1A3C2B] text-white font-semibold text-xs sm:text-sm rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>View Analysis</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
