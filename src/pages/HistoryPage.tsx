import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Filter,
  Upload,
  Search,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { HeaderComponent } from '@/components/layout/HeaderComponent';
import { FooterComponent } from '@/components/layout/FooterComponent';
import { useAuth } from '@/context/AuthContext';
import { supabase, type ReportRecord } from '@/lib/supabase';
import toast from 'react-hot-toast';

const categories = ['All Reports', 'Blood Tests', 'Imaging', 'Prescriptions'];

export default function HistoryPage() {
  const { profile, session } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Reports');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const userId = profile?.id || session?.user?.id || 'usr-demo';

  // ── Load Real Ingested Reports ──────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    async function loadReports() {
      if (!userId) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('upload_date', { ascending: false });

      if (isMounted) {
        if (!error && data && data.length > 0) {
          setReports(data as ReportRecord[]);
        }
        setLoading(false);
      }
    }

    loadReports();

    const handleReportUploaded = () => {
      loadReports();
    };
    window.addEventListener('meditrack_report_uploaded', handleReportUploaded);

    return () => {
      isMounted = false;
      window.removeEventListener('meditrack_report_uploaded', handleReportUploaded);
    };
  }, [userId]);

  // Delete Report Handler
  const handleDeleteReport = async (reportId: string, reportName: string) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    toast.success(`Removed "${reportName}" from history.`);
  };

  // Filtered & Searched Reports
  const filteredReports = reports.filter((item) => {
    const matchesCategory = selectedCategory === 'All Reports' || item.report_type === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || item.report_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F7F7F5] mosaic-bg text-[#111827] flex flex-col justify-between select-none pt-16 font-['Public_Sans']">
      <HeaderComponent activeItem="/app/history" />

      <main className="py-12 px-4 sm:px-8 max-w-[80rem] mx-auto w-full space-y-8">
        {/* Page Header */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
              INGESTED RECORDS
            </span>
            <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#111827]">
              Report History
            </h1>
            <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#3A3A38]">
              Manage your uploaded blood panels, diagnostic scans, and medical summaries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/app/upload')}
              className="px-4 py-2.5 bg-[#1A3C2B] text-white font-semibold text-xs rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Upload className="h-4 w-4" />
              <span>Upload New Report</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Category Filter Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3A3A38]" />
            <input
              type="text"
              placeholder="Search reports by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#3A3A38]/20 rounded-[12px] text-xs text-[#111827] focus:outline-none focus:border-[#1A3C2B] transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
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
        </div>

        {/* Reports Table / List */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
              Stored Medical Reports ({filteredReports.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-xs font-['JetBrains_Mono'] text-[#3A3A38] flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-[#1A3C2B] border-t-transparent rounded-full animate-spin" />
                <span>Loading report history...</span>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <AlertCircle className="h-8 w-8 text-[#3A3A38]/40 mx-auto" />
                <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
                  No matching medical reports found. Click "Upload New Report" to ingest a document!
                </p>
              </div>
            ) : (
              <table className="w-full text-left font-['Public_Sans'] text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#3A3A38]/20 font-['JetBrains_Mono'] uppercase text-[#3A3A38] text-[10px]">
                    <th className="py-3 px-4">Report Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Upload Date</th>
                    <th className="py-3 px-4">Risk / Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3A3A38]/10">
                  {filteredReports.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F7F7F5] transition-colors">
                      <td className="py-4 px-4 font-bold text-[#111827] flex items-center gap-2.5">
                        <FileText className="h-4 w-4 text-[#1A3C2B] shrink-0" />
                        <span className="truncate max-w-sm">{item.report_name}</span>
                      </td>
                      <td className="py-4 px-4 text-[#3A3A38]">{item.report_type}</td>
                      <td className="py-4 px-4 font-['JetBrains_Mono'] text-[#3A3A38]">{item.upload_date}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#9EFFBF]/50 text-[#1A3C2B] font-['JetBrains_Mono'] font-bold text-[10px]">
                          <CheckCircle2 className="h-3 w-3" />
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button
                          onClick={() => navigate('/app/ai-analysis')}
                          className="px-3.5 py-1.5 bg-[#1A3C2B] text-white font-semibold text-xs rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open Analysis</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(item.id, item.report_name)}
                          className="p-1.5 text-[#3A3A38] hover:text-red-600 transition-colors inline-block cursor-pointer"
                          title="Delete Report"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      <FooterComponent />
    </div>
  );
}
