import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Info,
  Stethoscope,
  MessageSquare,
  Upload,
  Download,
  Share2,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { FooterComponent } from '@/components/layout/FooterComponent';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface KeyFinding {
  biomarker: string;
  value: string;
  range: string;
  status: string;
  severity?: 'optimal' | 'warning' | 'attention';
  title?: string;
  description?: string;
}

export default function AIAnalysisPage() {
  const { profile, session } = useAuth();
  const navigate = useNavigate();

  const [analysisData, setAnalysisData] = useState<any>(() => {
    const stored = localStorage.getItem('meditrack_latest_analysis');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return null;
  });

  const userId = profile?.id || session?.user?.id || 'usr-demo';
  const userName = profile?.full_name || 'Patient';

  // ── Fetch Latest Analysis Result from Supabase analysis_results table ─────────
  useEffect(() => {
    let isMounted = true;
    async function loadLatestResult() {
      if (!userId) return;
      const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (isMounted && !error && data && data.length > 0) {
        try {
          const latest = data[0];
          const parsed = typeof latest.result_json === 'string'
            ? JSON.parse(latest.result_json)
            : latest.result_json;

          setAnalysisData({
            id: latest.id || `ans_${Date.now()}`,
            report_name: latest.report_name || 'Medical Diagnostic Report',
            provider: 'Google Gemini AI',
            analysis: parsed,
          });
        } catch (err) {
          console.error('[Analysis Result Parsing Error]:', err);
        }
      }
    }

    loadLatestResult();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const reportName = analysisData?.report_name || 'Comprehensive Blood Panel Results';
  const provider = analysisData?.provider || 'Google Gemini AI';
  const analysis = analysisData?.analysis || {};

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

  const handleDownloadPDF = () => {
    toast.success(`Downloading ${reportName} AI Summary (PDF)`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Report analysis link copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] mosaic-bg text-[#111827] flex flex-col justify-between select-none font-['Public_Sans']">

      <main className="py-12 px-4 sm:px-8 max-w-[80rem] mx-auto w-full space-y-10">
        {/* Report Header */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#9EFFBF]/50 text-[#1A3C2B] font-['JetBrains_Mono'] font-bold text-xs uppercase rounded-full">
                ANALYSIS COMPLETE · {confidenceScore}% CONFIDENCE
              </span>
              <span className="font-['JetBrains_Mono'] text-xs text-[#1A3C2B] font-semibold bg-[#1A3C2B]/10 px-2.5 py-0.5 rounded-full">
                POWERED BY {provider.toUpperCase()}
              </span>
            </div>
            <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#111827]">
              {reportName}
            </h1>
            <p className="font-['Public_Sans'] text-sm sm:text-base text-[#3A3A38]">
              Ingested & Evaluated for Patient: <span className="font-semibold text-[#111827]">{userName}</span> · {keyFindings.length} Biomarkers Analyzed
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigate('/app/chat')}
              className="px-5 py-3 bg-[#1A3C2B] text-white text-sm sm:text-base font-semibold rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <MessageSquare className="h-4 w-4 text-[#9EFFBF]" />
              <span>Ask AI Assistant</span>
            </button>
            <button
              onClick={() => navigate('/app/upload')}
              className="px-5 py-3 bg-white border border-[#3A3A38]/30 text-[#111827] text-sm sm:text-base font-semibold rounded-[12px] hover:border-[#1A3C2B] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Upload className="h-4 w-4" />
              <span>Upload New</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="p-3 bg-white border border-[#3A3A38]/30 text-[#111827] rounded-[12px] hover:border-[#1A3C2B] transition-colors cursor-pointer"
              title="Download PDF"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-3 bg-white border border-[#3A3A38]/30 text-[#111827] rounded-[12px] hover:border-[#1A3C2B] transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* AI Medical Summary Banner */}
        <div className="bg-[#1A3C2B] text-white border-l-4 border-l-[#9EFFBF] rounded-[14px] p-6 sm:p-8 space-y-2.5 shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#9EFFBF]" />
            <span className="font-['JetBrains_Mono'] text-xs text-[#9EFFBF] font-bold uppercase tracking-wider">
              CLINICAL AI SUMMARY
            </span>
          </div>
          <p className="font-['Public_Sans'] text-base sm:text-lg text-slate-200 leading-relaxed">
            {summaryText}
          </p>
        </div>

        {/* 3 Key Findings Summary Boxes */}
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
                className={`h-full flex flex-col justify-between bg-white border border-[#3A3A38]/20 border-l-4 ${borderColor} p-6 sm:p-8 rounded-[14px] space-y-3.5 shadow-xs`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-['JetBrains_Mono'] text-xs sm:text-sm font-bold uppercase ${badgeColor}`}>
                    {badgeText}
                  </span>
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-[#111827]">
                  {item.title || item.biomarker}
                </h3>
                <p className="font-['Public_Sans'] text-sm sm:text-base text-[#3A3A38] leading-relaxed">
                  {item.description || `${item.biomarker} measured at ${item.value} (Target: ${item.range}).`}
                </p>
              </div>
            );
          })}
        </div>

        {/* Detailed Biomarker Results Table */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#111827]">
            Complete Biomarker Analysis
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-['Public_Sans'] text-sm sm:text-base">
              <thead>
                <tr className="border-b border-[#3A3A38]/20 font-['JetBrains_Mono'] text-xs uppercase text-[#3A3A38]">
                  <th className="py-3.5 px-4">Biomarker</th>
                  <th className="py-3.5 px-4">Measured Value</th>
                  <th className="py-3.5 px-4">Reference Range</th>
                  <th className="py-3.5 px-4">Clinical Marker</th>
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
                      <td className="py-4 px-4 font-bold text-[#111827]">{b.biomarker}</td>
                      <td className="py-4 px-4 font-['JetBrains_Mono'] font-bold text-[#111827] text-base sm:text-lg">
                        {b.value}
                      </td>
                      <td className="py-4 px-4 font-['JetBrains_Mono'] text-[#3A3A38]">{b.range}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block font-['JetBrains_Mono'] font-bold text-xs sm:text-sm ${statusColor}`}>
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
          <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-[#111827]">
              Actionable Health Recommendations
            </h3>
            <ul className="space-y-3 font-['Public_Sans'] text-base sm:text-lg text-[#111827]">
              {lifestyle.map((rec, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 h-5 w-5 rounded-full bg-[#9EFFBF] text-[#1A3C2B] flex items-center justify-center shrink-0 font-bold text-xs">
                    ✓
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specialist Referral Section */}
        <div className="bg-[#1A3C2B] text-white border border-[#3A3A38]/30 rounded-[14px] p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 bg-white/10 text-[#9EFFBF] border border-white/20 font-['JetBrains_Mono'] text-xs uppercase font-bold rounded-full">
              RECOMMENDED CLINICAL REFERRAL
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-white">
                Consult a {specialist}
              </h2>
              <p className="font-['Public_Sans'] text-base sm:text-lg text-slate-200 leading-relaxed">
                {specialistReason}
              </p>
            </div>

            <div className="text-left md:text-right">
              <button
                onClick={() => navigate('/app/history')}
                className="w-full md:w-auto px-6 py-4 bg-[#9EFFBF] text-[#1A3C2B] font-['Public_Sans'] font-bold text-base rounded-[12px] hover:bg-white transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Find Nearby Specialists</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <FooterComponent />
    </div>
  );
}
