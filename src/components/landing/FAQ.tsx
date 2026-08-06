import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SectionHeading } from './Features';

const faqs = [
  { q: 'Is MEDITRACK AI a replacement for doctors?', a: 'No. MEDITRACK is a decision-support platform — agents surface evidence and recommendations, but a licensed clinician always makes the final call.' },
  { q: 'How does the multi-agent system work?', a: 'Nine specialized agents (diagnosis, prescription, drug-interaction, triage, etc.) run in parallel, share a structured patient graph, and coordinate via an orchestration layer that ranks outputs by confidence and severity.' },
  { q: 'Which medical report formats are supported?', a: 'PDF, DICOM-derived images (X-Ray, MRI, CT), blood panels and prescriptions. An OCR pipeline placeholder normalizes scanned documents into structured fields.' },
  { q: 'Is patient data secure?', a: 'Yes. All data is encrypted at rest and in transit, access is role-based, and every action is recorded in an immutable audit log. The platform is designed for HIPAA and GDPR alignment.' },
  { q: 'Can I use my own AI provider?', a: 'The architecture supports pluggable providers — Google Gemini, OpenAI and Claude are pre-wired as placeholders. Enterprise plans allow custom model endpoints.' },
  { q: 'Do you support offline mode?', a: 'A progressive offline mode is scaffolded: critical patient records cache locally and resync when connectivity returns. Full offline autonomy is on the roadmap.' },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24 px-4 sm:px-6 max-w-3xl mx-auto">
      <SectionHeading eyebrow="FAQ" title="Questions, answered" />
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <motion.div
            key={f.q}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left"
            >
              <span className="font-semibold text-slate-900 dark:text-white">{f.q}</span>
              <motion.span animate={{ rotate: open === i ? 180 : 0 }} className="flex-shrink-0">
                <ChevronDown className="h-5 w-5 text-slate-500" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-slate-200/60 dark:border-white/5 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-lg mb-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500" />
            <span className="gradient-text">MEDITRACK AI</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">Autonomous healthcare decision platform. Built for the Agentic AI era.</p>
        </div>
        {[
          { h: 'Product', links: ['Features', 'Agents', 'Pricing', 'Dashboard'] },
          { h: 'Company', links: ['About', 'Research', 'Compliance', 'Careers'] },
          { h: 'Resources', links: ['Documentation', 'API Status', 'Help Center', 'Security'] },
        ].map((col) => (
          <div key={col.h}>
            <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">{col.h}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}><a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200/60 dark:border-white/5 py-6 text-center text-xs text-slate-500">
        © 2026 MEDITRACK AI · Hackathon concept build · Not a medical device
      </div>
    </footer>
  );
}
