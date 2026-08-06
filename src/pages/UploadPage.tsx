import { useState, useEffect, useRef, type ChangeEvent, type DragEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  Eye,
  FileCheck,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { HeaderComponent } from '@/components/layout/HeaderComponent';
import { FooterComponent } from '@/components/layout/FooterComponent';
import { AICaseCoordinatorModal } from '@/components/ai-assistant/AICaseCoordinatorModal';
import { useAuth } from '@/context/AuthContext';
import { supabase, type ReportRecord } from '@/lib/supabase';
import { apiClient } from '@/lib/apiClient';
import toast from 'react-hot-toast';

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

const fileTypeGrid = [
  { title: 'Blood Test Report', desc: 'CBC, Lipid Panel, Metabolic', icon: Activity, ext: 'PDF, PNG, JPG' },
  { title: 'MRI Scan', desc: 'Brain, Spine, Joint Imaging', icon: FileText, ext: 'PDF, PNG, JPG' },
  { title: 'CT Scan', desc: 'Abdominal, Thoracic Imaging', icon: FileCheck, ext: 'PDF, PNG, JPG' },
  { title: 'X-Ray Image', desc: 'Skeletal & Chest X-Rays', icon: Eye, ext: 'PNG, JPG, PDF' },
  { title: 'Physician Prescription', desc: 'Medication & Dosage Notes', icon: Sparkles, ext: 'PDF, JPG' },
  { title: 'Medical Summary', desc: 'Discharge Summaries & Labs', icon: FileText, ext: 'PDF, PNG' },
];

function inferReportType(fileName: string): string {
  const name = fileName.toLowerCase();
  if (name.includes('blood') || name.includes('cbc') || name.includes('panel') || name.includes('lab')) return 'Blood Test';
  if (name.includes('mri') || name.includes('spine') || name.includes('brain')) return 'MRI Scan';
  if (name.includes('ct') || name.includes('scan') || name.includes('chest')) return 'CT Scan';
  if (name.includes('xray') || name.includes('x-ray') || name.includes('radiology')) return 'X-Ray';
  if (name.includes('prescription') || name.includes('rx') || name.includes('med')) return 'Prescription';
  return 'Medical Report';
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadPage() {
  const { profile, session } = useAuth();
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState<ReportRecord[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  // AI Case Coordinator Multi-Agent Orchestration State
  const [coordinatorOpen, setCoordinatorOpen] = useState(false);
  const [coordinatorStep, setCoordinatorStep] = useState(1);
  const [coordinatorProgress, setCoordinatorProgress] = useState(0);
  const [coordinatorFileName, setCoordinatorFileName] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const userId = profile?.id || session?.user?.id || 'usr-guest';

  // ── Fetch Real Reports from Supabase ───────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    async function fetchReports() {
      if (!userId) return;
      setLoadingReports(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('upload_date', { ascending: false });

      if (isMounted) {
        if (!error && data && data.length > 0) {
          setUploads(data as ReportRecord[]);
        }
        setLoadingReports(false);
      }
    }

    fetchReports();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // ── Handle Upload & Supabase Integration ────────────────────────────────────
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // 1. File Type Validation (PDF, JPG, JPEG, PNG)
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const isValidType = ALLOWED_EXTENSIONS.includes(fileExt) || ALLOWED_MIME_TYPES.includes(file.type);
    if (!isValidType) {
      toast.error(`Unsupported file type (${fileExt}). Please upload a PDF, JPG, JPEG, or PNG file.`, {
        duration: 4000,
      });
      return;
    }

    // 2. File Size Validation (Max 20MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File size exceeds 20MB limit (${formatFileSize(file.size)}). Please choose a smaller file.`, {
        duration: 4000,
      });
      return;
    }

    setUploading(true);
    toast.loading(`Uploading ${file.name} to Supabase Storage...`, { id: 'upload-toast' });

    try {
      // 3. Upload File to Supabase Storage (medical-reports bucket)
      const sanitizeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storageFilePath = `${userId}/${Date.now()}_${sanitizeName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medical-reports')
        .upload(storageFilePath, file, { upsert: true });

      if (uploadError) {
        throw new Error(uploadError.message || 'Supabase storage upload failed');
      }

      // 4. Obtain File Storage Public URL
      const { data: urlData } = supabase.storage
        .from('medical-reports')
        .getPublicUrl(uploadData?.path || storageFilePath);

      const fileUrl = urlData?.publicUrl || '';
      const reportType = inferReportType(file.name);
      const reportDate = new Date().toISOString().split('T')[0];

      // 5. Insert Record Metadata into reports table
      const newReport: ReportRecord = {
        id: `rep_${Date.now()}`,
        user_id: userId,
        report_name: file.name,
        report_type: reportType,
        file_url: fileUrl,
        file_size: formatFileSize(file.size),
        upload_date: reportDate,
        status: 'Analyzed',
      };

      const { error: insertError } = await supabase.from('reports').insert(newReport);

      if (insertError) {
        console.warn('[Reports Table] Metadata insert warning:', insertError.message);
      }

      setUploads((prev) => [newReport, ...prev]);

      // 6. Trigger AI Case Coordinator Visual Multi-Agent Orchestration Workflow
      setCoordinatorOpen(true);
      setCoordinatorFileName(file.name);
      setCoordinatorStep(1);
      setCoordinatorProgress(15);

      await new Promise((r) => setTimeout(r, 600));
      setCoordinatorStep(2);
      setCoordinatorProgress(30);

      await new Promise((r) => setTimeout(r, 600));
      setCoordinatorStep(3);
      setCoordinatorProgress(45);

      await new Promise((r) => setTimeout(r, 600));
      setCoordinatorStep(4);
      setCoordinatorProgress(60);

      // Trigger AI Analysis via Express Backend & Gemini API
      setCoordinatorStep(5);
      setCoordinatorProgress(75);
      const aiRes = await apiClient<{ id: string; analysis: any }>('/ai/analyze-report', {
        method: 'POST',
        body: JSON.stringify({
          reportId: newReport.id,
          userId: userId,
          reportName: file.name,
          fileUrl: fileUrl,
          reportType: reportType,
        }),
      });

      setCoordinatorStep(6);
      setCoordinatorProgress(90);
      await new Promise((r) => setTimeout(r, 500));

      setCoordinatorStep(7);
      setCoordinatorProgress(100);

      if (aiRes.data && aiRes.data.analysis) {
        localStorage.setItem('meditrack_latest_analysis', JSON.stringify(aiRes.data));
        await supabase.from('analysis_results').insert({
          id: aiRes.data.id,
          report_id: newReport.id,
          user_id: userId,
          result_json: JSON.stringify(aiRes.data.analysis),
          created_at: new Date().toISOString(),
        });
      }

      setUploading(false);
      toast.success(`Successfully analyzed ${file.name} via AI Case Coordinator!`, { id: 'upload-toast' });

      setTimeout(() => {
        setCoordinatorOpen(false);
        navigate('/app/ai-analysis');
      }, 900);
    } catch (err) {
      setUploading(false);
      const errorMsg = err instanceof Error ? err.message : 'Network error uploading file';
      toast.error(`Upload failed: ${errorMsg}`, { id: 'upload-toast' });
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] mosaic-bg text-[#111827] flex flex-col justify-between select-none pt-16">
      <HeaderComponent activeItem="/app/upload" />

      <main className="py-12 px-4 sm:px-8 max-w-[80rem] mx-auto w-full space-y-12">
        {/* Page Header */}
        <div className="border-b border-[#3A3A38]/15 pb-6 space-y-2">
          <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
            DOCUMENT INGESTION
          </span>
          <h1 className="font-['Space_Grotesk'] text-4xl sm:text-5xl font-bold text-[#111827]">
            Upload Medical Report
          </h1>
          <p className="font-['Public_Sans'] text-sm sm:text-base text-[#3A3A38]">
            Drop blood tests, MRI scans, CT reports, or prescriptions for instant AI analysis.
          </p>
        </div>

        {/* Drag-and-Drop Area with Distinct Corner Markers (+) */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative bg-white border-2 border-dashed p-8 sm:p-14 rounded-[16px] text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-[#1A3C2B] bg-[#9EFFBF]/10'
              : 'border-[#3A3A38]/30 hover:border-[#1A3C2B] hover:bg-[#F7F7F5]'
          }`}
        >
          {/* Corner Markers */}
          <span className="absolute top-2 left-2 text-[#3A3A38] font-['JetBrains_Mono'] text-sm font-bold">+</span>
          <span className="absolute top-2 right-2 text-[#3A3A38] font-['JetBrains_Mono'] text-sm font-bold">+</span>
          <span className="absolute bottom-2 left-2 text-[#3A3A38] font-['JetBrains_Mono'] text-sm font-bold">+</span>
          <span className="absolute bottom-2 right-2 text-[#3A3A38] font-['JetBrains_Mono'] text-sm font-bold">+</span>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
            className="hidden"
          />

          <div className="space-y-4 max-w-md mx-auto">
            <div className="h-16 w-16 bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center rounded-[10px] mx-auto">
              <UploadCloud className="h-8 w-8" />
            </div>

            <div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
                Drag and drop your report here
              </h3>
              <p className="font-['Public_Sans'] text-xs text-[#3A3A38] mt-1">
                or <span className="text-[#1A3C2B] font-semibold underline">browse files</span> from your device
              </p>
            </div>

            <p className="font-['JetBrains_Mono'] text-[11px] text-[#3A3A38] uppercase">
              SUPPORTED FORMATS: PDF, PNG, JPG, JPEG (MAX 20MB)
            </p>

            {uploading && (
              <div className="pt-2 flex items-center justify-center gap-2 text-xs font-['JetBrains_Mono'] text-[#1A3C2B]">
                <div className="h-4 w-4 border-2 border-[#1A3C2B] border-t-transparent rounded-full animate-spin" />
                <span>Uploading to Supabase medical-reports bucket...</span>
              </div>
            )}
          </div>
        </div>

        {/* Supported File Types Grid */}
        <div className="space-y-4">
          <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
            Supported Report Categories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {fileTypeGrid.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#3A3A38]/20 p-4 rounded-[14px] space-y-2 flex items-start gap-3 hover:border-[#1A3C2B] transition-colors"
                >
                  <div className="p-2.5 bg-[#F7F7F5] border border-[#3A3A38]/15 rounded-[10px] text-[#1A3C2B] shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-['Space_Grotesk'] font-bold text-sm text-[#111827]">
                      {item.title}
                    </h4>
                    <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
                      {item.desc}
                    </p>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#1A3C2B] block mt-1 uppercase">
                      {item.ext}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Uploads Table */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[12px] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
                Recent Ingested Reports
              </h3>
              <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
                {uploads.length} reports stored in Supabase storage & reports table
              </p>
            </div>
            <Link
              to="/app/ai-analysis"
              className="inline-flex items-center gap-1 text-xs font-['JetBrains_Mono'] text-[#1A3C2B] font-bold hover:underline"
            >
              <span>View Latest Analysis</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {loadingReports ? (
              <div className="py-8 text-center text-xs font-['JetBrains_Mono'] text-[#3A3A38] flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-[#1A3C2B] border-t-transparent rounded-full animate-spin" />
                <span>Loading report history from Supabase...</span>
              </div>
            ) : uploads.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <AlertCircle className="h-8 w-8 text-[#3A3A38]/40 mx-auto" />
                <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
                  No medical reports ingested yet. Upload your first blood test, MRI, or prescription above!
                </p>
              </div>
            ) : (
              <table className="w-full text-left font-['Public_Sans'] text-xs">
                <thead>
                  <tr className="border-b border-[#3A3A38]/20 font-['JetBrains_Mono'] uppercase text-[#3A3A38] text-[10px]">
                    <th className="py-3 px-4">Document Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Upload Date</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3A3A38]/10">
                  {uploads.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F7F7F5] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#111827] flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#1A3C2B]" />
                        <span className="truncate max-w-xs">{item.report_name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#3A3A38]">{item.report_type}</td>
                      <td className="py-3.5 px-4 font-['JetBrains_Mono'] text-[#3A3A38]">{item.upload_date}</td>
                      <td className="py-3.5 px-4 font-['JetBrains_Mono'] text-[#3A3A38]">{item.file_size}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#9EFFBF]/50 text-[#1A3C2B] font-['JetBrains_Mono'] font-bold text-[10px]">
                          <CheckCircle2 className="h-3 w-3" />
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => navigate('/app/ai-analysis')}
                          className="px-3 py-1.5 bg-[#1A3C2B] text-white font-semibold rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors cursor-pointer"
                        >
                          View Results
                        </button>
                        {item.file_url && (
                          <a
                            href={item.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-[#3A3A38] hover:text-[#1A3C2B] transition-colors inline-block"
                            title="Download / View Storage Object"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      <AICaseCoordinatorModal
        isOpen={coordinatorOpen}
        currentStep={coordinatorStep}
        fileName={coordinatorFileName}
        progressPercent={coordinatorProgress}
      />

      <FooterComponent />
    </div>
  );
}
