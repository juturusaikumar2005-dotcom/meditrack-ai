import { motion } from 'framer-motion';
import { Check, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const tiers = [
  {
    name: 'Patient Essential',
    price: '$0',
    period: 'forever',
    desc: 'For individuals seeking quick, plain-language interpretations of lab reports.',
    features: [
      'Up to 5 report uploads per month',
      'AI Biomarker extraction (Basic)',
      'Specialist recommendation matching',
      'Standard clinical guidance',
      'Community knowledge base access',
    ],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Health Pro',
    price: '$19',
    period: '/month',
    desc: 'Complete health monitoring with historical trend tracking and 24/7 AI Assistant.',
    features: [
      'Unlimited medical report uploads',
      '24/7 AI Healthcare Assistant chat',
      'Historical biomarker trend timeline',
      'Abnormal lab value instant alerts',
      'Priority specialist referral routing',
      'PDF & DICOM summary export',
    ],
    cta: 'Start Pro Plan',
    highlight: true,
  },
  {
    name: 'Clinical Enterprise',
    price: '$299',
    period: '/month',
    desc: 'For medical practices, clinics, and care teams requiring multi-patient management.',
    features: [
      'Multi-patient workspace & triage dashboard',
      'HIPAA compliant 256-bit encrypted archival',
      'EHR & EMR API integration',
      'Custom clinical triage rules',
      'Role-based staff permissions',
      '24/7 Dedicated clinical support SLA',
    ],
    cta: 'Contact Clinical Team',
    highlight: false,
  },
];

export function Pricing() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const handlePricingClick = () => {
    if (session) {
      navigate('/app/dashboard');
    } else {
      const hasOnboarded = localStorage.getItem('meditrack_onboarded');
      if (hasOnboarded === 'true') {
        navigate('/signin');
      } else {
        navigate('/auth-loading');
      }
    }
  };

  return (
    <section id="pricing" className="py-20 px-4 sm:px-8 border-b border-[#3A3A38]/15">
      <div className="max-w-[80rem] mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#3A3A38]/20 rounded-full text-xs font-['JetBrains_Mono'] text-[#1A3C2B] uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#FF8C69]" />
            <span>TRANSPARENT PRICING</span>
          </div>
          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold text-[#111827]">
            Simple Plans for Every Healthcare Need
          </h2>
          <p className="font-['Public_Sans'] text-base text-[#3A3A38] max-w-xl mx-auto">
            Start with our free plan. Upgrade anytime for unlimited AI analysis and historical health tracking.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className={`relative rounded-[14px] p-8 flex flex-col justify-between transition-all select-none ${
                t.highlight
                  ? 'bg-[#1A3C2B] text-white border-2 border-[#9EFFBF] shadow-lg'
                  : 'bg-white text-[#111827] border border-[#3A3A38]/20 hover:border-[#1A3C2B]'
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#9EFFBF] text-[#1A3C2B] text-[11px] font-['JetBrains_Mono'] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  MOST POPULAR
                </span>
              )}
              <div>
                <h3 className={`font-['Space_Grotesk'] text-xl font-bold ${t.highlight ? 'text-white' : 'text-[#111827]'}`}>
                  {t.name}
                </h3>
                <p className={`mt-2 font-['Public_Sans'] text-xs min-h-[36px] ${t.highlight ? 'text-slate-200' : 'text-[#3A3A38]'}`}>
                  {t.desc}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className={`font-['Space_Grotesk'] text-4xl font-bold tracking-tight ${t.highlight ? 'text-[#9EFFBF]' : 'text-[#1A3C2B]'}`}>
                    {t.price}
                  </span>
                  <span className={`font-['JetBrains_Mono'] text-xs ${t.highlight ? 'text-slate-300' : 'text-[#3A3A38]'}`}>
                    {t.period}
                  </span>
                </div>

                <ul className="mt-8 space-y-3 font-['Public_Sans'] text-xs sm:text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0 ${
                        t.highlight ? 'bg-[#9EFFBF] text-[#1A3C2B]' : 'bg-[#9EFFBF]/40 text-[#1A3C2B]'
                      }`}>
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={t.highlight ? 'text-slate-100' : 'text-[#111827]'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePricingClick}
                className={`mt-8 w-full py-3.5 rounded-[12px] font-['Public_Sans'] font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                  t.highlight
                    ? 'bg-[#9EFFBF] text-[#1A3C2B] hover:bg-[#9EFFBF]/90 font-bold'
                    : 'bg-[#1A3C2B] text-white hover:bg-[#1A3C2B]/90'
                }`}
              >
                {t.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
