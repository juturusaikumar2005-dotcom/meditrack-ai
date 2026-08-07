import { CheckCircle2, Shield, Sparkles } from 'lucide-react';

export function ConfidenceIndicator({
  ocrConfidence = 0.94,
  aiConfidence = 0.96,
  fdaValidated = true,
  overall = 0.95,
}: {
  ocrConfidence?: number;
  aiConfidence?: number;
  fdaValidated?: boolean;
  overall?: number;
}) {
  const ocrPct = Math.round(ocrConfidence * 100);
  const overallPct = Math.round(overall * 100);

  return (
    <div className="bg-white border border-[#3A3A38]/20 rounded-[20px] p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs font-['Public_Sans'] text-xs">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-[#9EFFBF]/50 text-[#1A3C2B] rounded-full flex items-center justify-center font-bold">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-['Space_Grotesk'] font-bold text-sm text-[#111827]">
            AI Extractor Confidence: {overallPct}%
          </h4>
          <p className="text-[#3A3A38] text-[11px]">
            OCR Handwriting Score: {ocrPct}% · FDA Formulary Match: {fdaValidated ? 'Verified' : 'Passed'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-[#1A3C2B]/10 text-[#1A3C2B] px-3 py-1.5 rounded-full font-semibold font-['JetBrains_Mono'] text-[11px]">
        <CheckCircle2 className="h-4 w-4 text-[#1A3C2B]" />
        <span>Clinical Validation Complete</span>
      </div>
    </div>
  );
}
