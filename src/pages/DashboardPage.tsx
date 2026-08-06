import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  FileText,
  BrainCircuit,
  AlertTriangle,
  Clock,
  TrendingUp,
  Stethoscope,
  Upload,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

const vitalHistory = [
  { day: 'Mon', ferritin: 18, vitD: 28, glucose: 90 },
  { day: 'Tue', ferritin: 17, vitD: 26, glucose: 94 },
  { day: 'Wed', ferritin: 16, vitD: 25, glucose: 91 },
  { day: 'Thu', ferritin: 15, vitD: 24, glucose: 89 },
  { day: 'Fri', ferritin: 15, vitD: 23, glucose: 93 },
  { day: 'Sat', ferritin: 14, vitD: 22, glucose: 92 },
  { day: 'Sun', ferritin: 14, vitD: 22, glucose: 92 },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 select-none font-['Public_Sans']">
      {/* Page Header */}
      <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
            PERSONAL HEALTH PORTAL
          </span>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#111827]">
            My Health Dashboard
          </h1>
          <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#3A3A38]">
            Real-time overview of your blood tests, vital trends, and AI health interpretations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/app/upload')}
            className="px-4 py-2.5 bg-[#1A3C2B] text-white font-semibold text-xs rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            <span>Upload New Report</span>
          </button>
        </div>
      </div>

      {/* 6 Public Healthcare Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white border border-[#3A3A38]/20 p-4 rounded-[14px] space-y-1 border-l-4 border-l-[#1A3C2B]">
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38] uppercase">VITAL SCORE</span>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">78 / 100</div>
          <span className="font-['JetBrains_Mono'] text-[10px] text-emerald-700 font-bold">+2.4% Stable</span>
        </div>

        <div className="bg-white border border-[#3A3A38]/20 p-4 rounded-[14px] space-y-1 border-l-4 border-l-[#9EFFBF]">
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38] uppercase">INGESTED REPORTS</span>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">4 Files</div>
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#1A3C2B] font-bold">100% Parsed</span>
        </div>

        <div className="bg-white border border-[#3A3A38]/20 p-4 rounded-[14px] space-y-1 border-l-4 border-l-[#FF8C69]">
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38] uppercase">ATTENTION NEEDED</span>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">2 Markers</div>
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#FF8C69] font-bold">Ferritin & Vitamin D</span>
        </div>

        <div className="bg-white border border-[#3A3A38]/20 p-4 rounded-[14px] space-y-1 border-l-4 border-l-[#F4D35E]">
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38] uppercase">AI ACCURACY</span>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">99.4%</div>
          <span className="font-['JetBrains_Mono'] text-[10px] text-amber-700 font-bold">Clinical Confidence</span>
        </div>

        <div className="bg-white border border-[#3A3A38]/20 p-4 rounded-[14px] space-y-1 border-l-4 border-l-[#1A3C2B]">
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38] uppercase">DAYS SINCE LAB</span>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">12 Days</div>
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#1A3C2B] font-bold">Next: Mar 2026</span>
        </div>

        <div className="bg-white border border-[#3A3A38]/20 p-4 rounded-[14px] space-y-1 border-l-4 border-l-[#9EFFBF]">
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38] uppercase">MATCHED DOCTOR</span>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">1 Specialist</div>
          <span className="font-['JetBrains_Mono'] text-[10px] text-emerald-700 font-bold">Dr. Jenkins (GP)</span>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lab Trends Line Chart */}
        <div className="lg:col-span-2 bg-white border border-[#3A3A38]/20 p-6 rounded-[14px] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
                7-Day Biomarker Stability Chart
              </h3>
              <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
                Serum Ferritin (ng/mL) vs Fasting Blood Glucose (mg/dL)
              </p>
            </div>
            <span className="font-['JetBrains_Mono'] text-[10px] px-2.5 py-0.5 bg-[#9EFFBF]/40 text-[#1A3C2B] font-bold rounded-full">
              UPDATED TODAY
            </span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={vitalHistory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(58,58,56,0.12)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} stroke="#3A3A38" />
              <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#3A3A38" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(58,58,56,0.2)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontFamily: 'Public Sans',
                }}
              />
              <Line type="monotone" dataKey="ferritin" stroke="#FF8C69" strokeWidth={2.5} dot name="Ferritin (ng/mL)" />
              <Line type="monotone" dataKey="glucose" stroke="#1A3C2B" strokeWidth={2.5} dot name="Glucose (mg/dL)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions & AI Health Insight */}
        <div className="bg-[#1A3C2B] text-white border border-[#3A3A38]/30 p-6 rounded-[14px] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#9EFFBF]" />
              <span className="font-['JetBrains_Mono'] text-xs text-[#9EFFBF] uppercase">
                AI CLINICAL SUMMARY
              </span>
            </div>
            <h4 className="font-['Space_Grotesk'] text-2xl font-bold">
              Iron Reserves Need Attention
            </h4>
            <p className="font-['Public_Sans'] text-xs text-slate-300 leading-relaxed">
              Your Ferritin level (14 ng/mL) is on the lower reference bound. We recommend consulting a General Physician for dietary guidance.
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <button
              onClick={() => navigate('/app/patients')}
              className="w-full py-2.5 bg-[#9EFFBF] text-[#1A3C2B] font-['Public_Sans'] font-bold text-xs rounded-[12px] hover:bg-white transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Book Specialist Consultation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => navigate('/app/ai-analysis')}
              className="w-full py-2.5 bg-white/10 text-white font-['Public_Sans'] font-semibold text-xs rounded-[12px] hover:bg-white/20 transition-colors cursor-pointer"
            >
              View Detailed Biomarkers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
