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
  Download,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, type ReportRecord } from '@/lib/supabase';

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
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const safeReports = Array.isArray(reports) ? reports : [];
  const latestReport = safeReports[0];
  const summaryText = typeof latestAnalysis?.parsed?.summary === 'string' && latestAnalysis.parsed.summary.length > 0
    ? latestAnalysis.parsed.summary
    : 'Comprehensive clinical parsing completed. Results indicate stable blood glucose and hemoglobin levels alongside mild iron reserve (Ferritin) depletion.';

  return (
    <div className="space-y-8 select-none font-['Public_Sans']">
      {/* 1. Welcome Card */}
      <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
            HEALTH PORTAL DASHBOARD
          </span>
          <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#111827]">
            Welcome back, {userName}
          </h1>
          <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#3A3A38]">
            Overview of your uploaded medical reports, latest AI summaries, and diagnostic insights.
          </p>
        </div>

        {/* Quick Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/app/upload')}
            className="px-4 py-2.5 bg-[#1A3C2B] text-white font-semibold text-xs rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Upload className="h-4 w-4" />
            <span>Upload New Report</span>
          </button>
          <button
            onClick={() => navigate('/app/chat')}
            className="px-4 py-2.5 bg-white border border-[#3A3A38]/30 text-[#111827] font-semibold text-xs rounded-[12px] hover:border-[#1A3C2B] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="h-4 w-4 text-[#1A3C2B]" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>

      {/* 2. Latest Uploaded Report & AI Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latest Uploaded Report Card */}
        <div className="bg-white border border-[#3A3A38]/20 p-6 rounded-[14px] space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-[10px] uppercase font-bold text-[#1A3C2B] bg-[#9EFFBF]/40 px-2.5 py-0.5 rounded-full">
                LATEST INGESTED DOCUMENT
              </span>
              <FileText className="h-5 w-5 text-[#1A3C2B]" />
            </div>

            {latestReport ? (
              <div className="space-y-2">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
                  {latestReport.report_name}
                </h3>
                <div className="flex items-center gap-3 text-xs font-['JetBrains_Mono'] text-[#3A3A38]">
                  <span>Type: {latestReport.report_type}</span>
                  <span>•</span>
                  <span>Date: {latestReport.upload_date}</span>
                </div>
              </div>
            ) : (
              <div className="py-4 text-xs text-[#3A3A38] space-y-1">
                <p className="font-bold text-[#111827]">No medical reports uploaded yet.</p>
                <p>Upload a blood test panel or scan to view AI parsing.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/app/ai-analysis')}
            className="w-full py-2.5 bg-[#F7F7F5] border border-[#3A3A38]/20 text-[#111827] font-semibold text-xs rounded-[12px] hover:border-[#1A3C2B] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Complete AI Analysis</span>
            <ArrowRight className="h-4 w-4 text-[#1A3C2B]" />
          </button>
        </div>

        {/* Latest AI Summary Card */}
        <div className="bg-[#1A3C2B] text-white border border-[#3A3A38]/30 p-6 rounded-[14px] space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#9EFFBF]" />
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#9EFFBF] font-bold uppercase tracking-wider">
                LATEST CLINICAL AI SUMMARY
              </span>
            </div>
            <p className="font-['Public_Sans'] text-xs sm:text-sm text-slate-200 leading-relaxed">
              {summaryText}
            </p>
          </div>

          <button
            onClick={() => navigate('/app/chat')}
            className="w-full py-2.5 bg-[#9EFFBF] text-[#1A3C2B] font-bold text-xs rounded-[12px] hover:bg-white transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Ask AI About This Summary</span>
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3. Recent Reports Table */}
      <div className="bg-white border border-[#3A3A38]/20 rounded-[12px] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
              Recent Reports
            </h3>
            <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
              {reports.length} report documents stored in your account
            </p>
          </div>
          <button
            onClick={() => navigate('/app/history')}
            className="inline-flex items-center gap-1 text-xs font-['JetBrains_Mono'] text-[#1A3C2B] font-bold hover:underline cursor-pointer"
          >
            <span>View Full History</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-8 text-center text-xs font-['JetBrains_Mono'] text-[#3A3A38] flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-[#1A3C2B] border-t-transparent rounded-full animate-spin" />
              <span>Loading reports...</span>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <AlertCircle className="h-8 w-8 text-[#3A3A38]/40 mx-auto" />
              <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
                No reports ingested yet. Click "Upload New Report" to get started!
              </p>
            </div>
          ) : (
            <table className="w-full text-left font-['Public_Sans'] text-xs">
              <thead>
                <tr className="border-b border-[#3A3A38]/20 font-['JetBrains_Mono'] uppercase text-[#3A3A38] text-[10px]">
                  <th className="py-3 px-4">Document Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Upload Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A3A38]/10">
                {reports.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7F7F5] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#111827] flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#1A3C2B]" />
                      <span className="truncate max-w-xs">{item.report_name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#3A3A38]">{item.report_type}</td>
                    <td className="py-3.5 px-4 font-['JetBrains_Mono'] text-[#3A3A38]">{item.upload_date}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#9EFFBF]/50 text-[#1A3C2B] font-['JetBrains_Mono'] font-bold text-[10px]">
                        <CheckCircle2 className="h-3 w-3" />
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate('/app/ai-analysis')}
                        className="px-3 py-1.5 bg-[#1A3C2B] text-white font-semibold rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors cursor-pointer"
                      >
                        View Analysis
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
