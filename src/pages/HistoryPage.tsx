import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  FileText,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Filter,
  Upload,
  MessageSquare,
} from 'lucide-react';
import { HeaderComponent } from '@/components/layout/HeaderComponent';
import { FooterComponent } from '@/components/layout/FooterComponent';

interface TimelineEntry {
  id: string;
  title: string;
  category: 'Blood Tests' | 'Imaging' | 'Prescriptions';
  date: string;
  summary: string;
  status: 'Analyzed' | 'Stable' | 'Action Needed';
  statusColor: string;
}

const mockTimeline: TimelineEntry[] = [
  {
    id: 't-1',
    title: 'Comprehensive Blood Panel',
    category: 'Blood Tests',
    date: 'Jan 24, 2026',
    summary: 'Ferritin low at 14 ng/mL. Fasting glucose normal at 92 mg/dL.',
    status: 'Action Needed',
    statusColor: 'bg-[#FF8C69]/20 text-[#FF8C69] border-[#FF8C69]',
  },
  {
    id: 't-2',
    title: 'Lumbar Spine MRI Scan',
    category: 'Imaging',
    date: 'Jan 15, 2026',
    summary: 'Mild L4-L5 disc protrusion noted without nerve root compression.',
    status: 'Stable',
    statusColor: 'bg-[#9EFFBF]/30 text-[#1A3C2B] border-[#1A3C2B]',
  },
  {
    id: 't-3',
    title: 'Chest X-Ray Digital',
    category: 'Imaging',
    date: 'Jan 02, 2026',
    summary: 'Clear lung fields without focal consolidation or pleural effusion.',
    status: 'Analyzed',
    statusColor: 'bg-[#9EFFBF]/30 text-[#1A3C2B] border-[#1A3C2B]',
  },
  {
    id: 't-4',
    title: 'Cardiology Prescription Note',
    category: 'Prescriptions',
    date: 'Dec 28, 2025',
    summary: 'Daily multivitamin & Vitamin D3 (2000 IU) supplementation started.',
    status: 'Analyzed',
    statusColor: 'bg-[#F4D35E]/30 text-amber-900 border-[#F4D35E]',
  },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState<string>('All Reports');
  const navigate = useNavigate();

  const filteredEntries = mockTimeline.filter((item) => {
    if (filter === 'All Reports') return true;
    return item.category === filter;
  });

  return (
    <div className="min-h-screen bg-[#F7F7F5] mosaic-bg text-[#111827] flex flex-col justify-between select-none pt-16">
      <HeaderComponent activeItem="/app/history" />

      <main className="py-12 px-4 sm:px-8 max-w-[80rem] mx-auto w-full space-y-10">
        {/* Page Header */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
              LONGITUDINAL TRACKING
            </span>
            <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#111827]">
              Health & Diagnostic Timeline
            </h1>
            <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#3A3A38]">
              Track blood panel trends, imaging scan history, and physician notes across time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/app/upload')}
              className="px-4 py-2.5 bg-[#1A3C2B] text-white font-['Public_Sans'] font-semibold text-xs rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Report</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 font-['Public_Sans'] text-xs">
          <Filter className="h-4 w-4 text-[#3A3A38] shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-[12px] font-semibold transition-colors shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1A3C2B] text-white'
                  : 'bg-white border border-[#3A3A38]/20 text-[#111827] hover:border-[#1A3C2B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vertical Timeline Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative pl-6 border-l-2 border-[#3A3A38]/20 space-y-8">
              {filteredHistory.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Timeline Dot Marker */}
                  <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-white border-4 border-[#1A3C2B] transition-transform group-hover:scale-125" />

                  {/* Card Body */}
                  <div className="bg-white border border-[#3A3A38]/20 p-5 rounded-[14px] space-y-3 hover:border-[#1A3C2B] transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#1A3C2B] text-[#9EFFBF] font-['JetBrains_Mono'] text-[10px] uppercase font-bold">
                          {item.category}
                        </span>
                        <span className="font-['JetBrains_Mono'] text-xs text-[#3A3A38]">
                          {item.date}
                        </span>
                      </div>
                      <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#1A3C2B]">
                        {item.value}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#111827]">
                        {item.title}
                      </h3>
                      <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#3A3A38] mt-1 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#3A3A38]/10 flex items-center justify-between text-xs">
                      <span className="font-['JetBrains_Mono'] text-[#3A3A38]">
                        Facility: {item.facility}
                      </span>
                      <button
                        onClick={() => navigate('/app/ai-analysis')}
                        className="text-[#1A3C2B] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Analysis</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar Stats & Vital Trends */}
          <div className="space-y-6">
              </div>
              <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
                Overall vitals are stable. Iron levels require monitoring.
              </p>
            </div>

            {/* Progress Bars (Iron & Vitamin D) */}
            <div className="bg-white border border-[#3A3A38]/20 rounded-[2px] p-6 space-y-4">
              <h4 className="font-['Space_Grotesk'] font-bold text-lg text-[#111827]">
                Biomarker Progress
              </h4>

              <div className="space-y-3 font-['Public_Sans'] text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Iron Reserve Stability</span>
                    <span className="font-['JetBrains_Mono'] text-[#FF8C69]">65%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-[2px] overflow-hidden">
                    <div className="h-full bg-[#FF8C69] w-[65%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Vitamin D Target</span>
                    <span className="font-['JetBrains_Mono'] text-amber-600">45%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-[2px] overflow-hidden">
                    <div className="h-full bg-[#F4D35E] w-[45%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Trend Visualization (Ferritin over 4 months) */}
            <div className="bg-[#1A3C2B] text-white border border-[#3A3A38]/30 rounded-[2px] p-6 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#9EFFBF]" />
                <span className="font-['JetBrains_Mono'] text-xs uppercase text-[#9EFFBF]">
                  4-MONTH TREND: FERRITIN
                </span>
              </div>
              <p className="font-['Public_Sans'] text-xs text-slate-300">
                Oct: 18 ng/mL → Nov: 16 ng/mL → Dec: 15 ng/mL → Jan: 14 ng/mL
              </p>
              <div className="pt-2 border-t border-white/10 text-[11px] font-['JetBrains_Mono'] text-[#9EFFBF]">
                ➡️ Trend slope is stabilizing after supplementation.
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterComponent />
    </div>
  );
}
