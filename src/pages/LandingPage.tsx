import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Brain,
  FileText,
  Stethoscope,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Clock,
} from 'lucide-react';
import { HeaderComponent } from '@/components/layout/HeaderComponent';
import { FooterComponent } from '@/components/layout/FooterComponent';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { Pricing } from '@/components/landing/Pricing';
import { BrandIntroScreen } from '@/components/brand/BrandIntroScreen';
import { useAuth } from '@/context/AuthContext';

// Framer Motion Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [showIntro, setShowIntro] = useState(true);

  const steps = [
    { num: '01', title: 'Upload Report', desc: 'Securely drop your blood test, MRI, CT scan, or medical PDF.', icon: Upload },
    { num: '02', title: 'AI Parsing', desc: 'Our engine extracts biomarkers, lab values, and clinical terms.', icon: Brain },
    { num: '03', title: 'Key Findings', desc: 'View plain-English summaries categorized by severity and risk.', icon: FileText },
    { num: '04', title: 'Action Plan', desc: 'Receive actionable lifestyle, dietary, and precaution tips.', icon: Sparkles },
    { num: '05', title: 'Specialist Referral', desc: 'Get matched with accredited local specialists and book directly.', icon: Stethoscope },
  ];

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-[#1A3C2B]" />,
      title: 'Instant Lab Parsing',
      description: 'Upload complex blood work and receive clear, plain-language interpretations in under 3 seconds.',
      accentColor: 'mint' as const,
    },
    {
      icon: <FileText className="h-8 w-8 text-[#FF8C69]" />,
      title: 'Biomarker Extraction',
      description: 'Automatically flags abnormal lab thresholds (Ferritin, Hemoglobin, Vitamin D, Glucose) with visual severity bounds.',
      accentColor: 'coral' as const,
    },
    {
      icon: <Stethoscope className="h-8 w-8 text-[#F4D35E]" />,
      title: 'Specialist Triage Engine',
      description: 'Directly routes your report findings to the relevant specialist (Cardiologist, Dermatologist, ENT, Endocrinologist).',
      accentColor: 'gold' as const,
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-[#1A3C2B]" />,
      title: 'Privacy-First Architecture',
      description: '256-bit encrypted data handling aligned with HIPAA standards. Your personal data is never sold or shared.',
      accentColor: 'forest' as const,
    },
    {
      icon: <Clock className="h-8 w-8 text-[#9EFFBF]" />,
      title: 'Historical Health Timeline',
      description: 'Track lab trends across 4+ months to monitor stability, recovery progress, and vital improvements.',
      accentColor: 'mint' as const,
    },
    {
      icon: <Sparkles className="h-8 w-8 text-[#FF8C69]" />,
      title: '24/7 AI Health Assistant',
      description: 'Ask questions about medications, symptoms, and precaution guidelines anytime with instant clinical responses.',
      accentColor: 'coral' as const,
    },
  ];

  const testimonials = [
    {
      quote: "MEDITRACK AI translated my 12-page blood report into 3 simple bullet points. I knew exactly what to ask my doctor.",
      author: "Elena Rostova",
      role: "Patient",
    },
    {
      quote: "The specialist triage feature matched me with a cardiologist in my neighborhood within minutes. Truly empowering.",
      author: "Marcus Vance",
      role: "Verified User",
    },
    {
      quote: "I use this to explain diagnostic results to my family members without causing panic. Clean, calm, and accurate.",
      author: "Dr. Aris Thorne",
      role: "General Practitioner",
    },
  ];

  const faqs = [
    {
      question: "Is MEDITRACK AI a substitute for a medical doctor?",
      answer: "No. MEDITRACK AI provides educational health guidance and report interpretations to help you understand your data. It does not provide a final medical diagnosis or replace emergency clinical care."
    },
    {
      question: "What medical report formats are supported?",
      answer: "We support PDF documents, high-resolution images (JPEG, PNG) of lab blood tests, X-Rays, MRI scans, CT scans, and physician prescriptions."
    },
    {
      question: "How is my personal health information protected?",
      answer: "All reports and conversation records are encrypted using AES 256-bit standards. We comply strictly with HIPAA privacy standards and never sell user health data."
    },
    {
      question: "How does the specialist routing work?",
      answer: "When abnormal markers or symptom queries are processed, our clinical triage rules match your findings to specialized medical fields (e.g. Hematology, Cardiology, Endocrinology) and recommend local accredited providers."
    }
  ];

  const handleGetStartedClick = () => {
    if (session) {
      navigate('/app/dashboard');
    } else {
      navigate('/signin');
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <BrandIntroScreen onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#F7F7F5] mosaic-bg text-[#111827] flex flex-col select-none pt-20">
      <HeaderComponent activeItem="/" />

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-[#3A3A38]/15 relative overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-[80rem] mx-auto text-center space-y-8 relative z-10"
        >
          <motion.div variants={fadeInUp} className="inline-block">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#3A3A38]/20 rounded-full text-xs font-['JetBrains_Mono'] text-[#1A3C2B] uppercase tracking-wider shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FF8C69]" />
              <span>AI-POWERED CLINICAL GUIDANCE PLATFORM</span>
            </motion.div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="font-['Space_Grotesk'] text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#111827] max-w-5xl mx-auto leading-tight"
          >
            Your health, <br className="hidden sm:block" />
            <span className="text-[#1A3C2B] relative inline-block">
              explained simply.
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                className="absolute left-0 bottom-1 w-full h-2 bg-[#9EFFBF] -z-10 origin-left rounded-full"
              />
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="font-['Public_Sans'] text-base sm:text-xl text-[#3A3A38] max-w-2xl mx-auto leading-relaxed"
          >
            Upload lab reports, track diagnostic trends over time, and connect with accredited specialists in seconds.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 font-['Public_Sans']">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGetStartedClick}
              className="w-full sm:w-auto px-8 py-4 bg-[#1A3C2B] text-white font-semibold rounded-[12px] hover:bg-[#1A3C2B]/90 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Upload className="h-5 w-5 text-[#9EFFBF]" />
              <span>Upload Medical Report</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGetStartedClick}
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#111827] border border-[#3A3A38]/30 font-semibold rounded-[12px] hover:border-[#1A3C2B] hover:text-[#1A3C2B] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Explore AI Assistant</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Social Proof & Stats Bar Section */}
      <section className="py-12 px-4 sm:px-8 border-b border-[#3A3A38]/15 bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
          className="max-w-[80rem] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <motion.div variants={fadeInUp} className="space-y-1">
            <h3 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#1A3C2B]">10,000+</h3>
            <p className="font-['Public_Sans'] text-xs text-[#3A3A38] font-medium">Reports Parsed</p>
          </motion.div>
          <motion.div variants={fadeInUp} className="space-y-1">
            <h3 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#1A3C2B]">99.4%</h3>
            <p className="font-['Public_Sans'] text-xs text-[#3A3A38] font-medium">Biomarker Accuracy</p>
          </motion.div>
          <motion.div variants={fadeInUp} className="space-y-1">
            <h3 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#1A3C2B]">150+</h3>
            <p className="font-['Public_Sans'] text-xs text-[#3A3A38] font-medium">Accredited Specialists</p>
          </motion.div>
          <motion.div variants={fadeInUp} className="space-y-1">
            <h3 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#1A3C2B]">AES-256</h3>
            <p className="font-['Public_Sans'] text-xs text-[#3A3A38] font-medium">HIPAA Aligned Encryption</p>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 border-b border-[#3A3A38]/15">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="max-w-[80rem] mx-auto space-y-12"
        >
          <motion.div variants={fadeInUp} className="text-center space-y-3">
            <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
              HOW IT WORKS
            </span>
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold text-[#111827]">
              5 Steps to Clarity
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  variants={fadeInUp}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-white border border-[#3A3A38]/20 p-5 rounded-[14px] space-y-3 flex flex-col justify-between hover:border-[#1A3C2B] transition-colors cursor-pointer shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#1A3C2B] bg-[#9EFFBF]/50 px-2.5 py-0.5 rounded-full">
                      {step.num}
                    </span>
                    <Icon className="h-5 w-5 text-[#1A3C2B]" />
                  </div>
                  <div>
                    <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#111827] mb-1">
                      {step.title}
                    </h3>
                    <p className="font-['Public_Sans'] text-xs text-[#3A3A38] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 px-4 sm:px-8 border-b border-[#3A3A38]/15">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="max-w-[80rem] mx-auto space-y-12"
        >
          <motion.div variants={fadeInUp} className="text-center space-y-3">
            <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
              CLINICAL ARCHITECTURE
            </span>
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold text-[#111827]">
              Engineered for Precision & Safety
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <FeatureCard
                  icon={f.icon}
                  title={f.title}
                  description={f.description}
                  accentColor={f.accentColor}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* AI Assistant Preview Section */}
      <section id="assistant" className="py-20 px-4 sm:px-8 border-b border-[#3A3A38]/15">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="max-w-[80rem] mx-auto grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeInUp} className="space-y-6">
            <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
              INTERACTIVE HEALTHCARE CHAT
            </span>
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold text-[#111827] leading-tight">
              Ask questions in plain English. Get clinical clarity.
            </h2>
            <p className="font-['Public_Sans'] text-base text-[#3A3A38] leading-relaxed">
              Our assistant answers medical concerns, interprets lab acronyms, and alerts you to acute symptoms with instant emergency triage guidance.
            </p>
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGetStartedClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1A3C2B] text-white font-semibold text-sm rounded-[12px] hover:bg-[#1A3C2B]/90 transition-all cursor-pointer"
              >
                <span>Launch Assistant Demo</span>
                <ArrowRight className="h-4 w-4 text-[#9EFFBF]" />
              </motion.button>
            </div>
          </motion.div>

          {/* Interactive Chat Sample Preview Card */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -4 }}
            className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#3A3A38]/15">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#9EFFBF] animate-pulse" />
                <span className="font-['Space_Grotesk'] font-bold text-sm text-[#111827]">
                  MEDITRACK Assistant
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#1A3C2B] font-semibold bg-[#9EFFBF]/30 px-2 py-0.5 rounded-full">
                ONLINE
              </span>
            </div>

            {/* User Message */}
            <div className="bg-[#F7F7F5] border border-[#3A3A38]/15 p-3.5 rounded-[12px] space-y-1">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38]">YOU</span>
              <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#111827]">
                "My blood test shows Ferritin at 14 ng/mL. What does this mean?"
              </p>
            </div>

            {/* AI Response Message */}
            <div className="bg-[#1A3C2B] text-white p-4 rounded-[12px] space-y-2 border-l-4 border-l-[#9EFFBF]">
              <div className="flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#9EFFBF]">AI GUIDANCE</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-slate-300">JUST NOW</span>
              </div>
              <p className="font-['Public_Sans'] text-xs sm:text-sm text-slate-200 leading-relaxed">
                A Ferritin level of 14 ng/mL is on the lower bound of standard reference ranges (typically 12–150 ng/mL for women). This indicates low iron stores, which can lead to fatigue.
              </p>
              <div className="pt-1 text-[11px] font-['JetBrains_Mono'] text-[#9EFFBF] flex items-center gap-1">
                <Stethoscope className="h-3.5 w-3.5" />
                <span>Recommended Specialist: Hematologist / GP</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 px-4 sm:px-8 border-b border-[#3A3A38]/15">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="max-w-[80rem] mx-auto space-y-12"
        >
          <motion.div variants={fadeInUp} className="text-center space-y-3">
            <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
              CENTRAL HEALTH DASHBOARD
            </span>
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold text-[#111827]">
              All your records in one clean view
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#3A3A38]/15">
              <div>
                <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">
                  Patient Overview: Marcus Vance
                </h3>
                <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
                  Last synced: Today at 09:42 AM · 4 Active Diagnostics
                </p>
              </div>
              <span className="font-['JetBrains_Mono'] text-xs px-3.5 py-1 bg-[#9EFFBF]/40 text-[#1A3C2B] font-semibold rounded-full border border-[#1A3C2B]/20">
                HEALTH SCORE: 78/100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div whileHover={{ y: -3 }} className="bg-[#F7F7F5] border border-[#3A3A38]/15 p-4 rounded-[12px] border-l-4 border-l-[#FF8C69]">
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38] uppercase font-semibold">
                  ATTENTION NEEDED
                </span>
                <h4 className="font-['Space_Grotesk'] font-bold text-lg text-[#111827]">
                  Iron Deficiency
                </h4>
                <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
                  Ferritin 14 ng/mL (Low)
                </p>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} className="bg-[#F7F7F5] border border-[#3A3A38]/15 p-4 rounded-[12px] border-l-4 border-l-[#9EFFBF]">
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38] uppercase font-semibold">
                  STABLE BIOMARKER
                </span>
                <h4 className="font-['Space_Grotesk'] font-bold text-lg text-[#111827]">
                  Blood Glucose
                </h4>
                <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
                  Fasting 92 mg/dL (Normal)
                </p>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} className="bg-[#F7F7F5] border border-[#3A3A38]/15 p-4 rounded-[12px] border-l-4 border-l-[#F4D35E]">
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38] uppercase font-semibold">
                  MONITORING
                </span>
                <h4 className="font-['Space_Grotesk'] font-bold text-lg text-[#111827]">
                  Vitamin D3
                </h4>
                <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
                  22 ng/mL (Mild Low)
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust / Privacy Section */}
      <section id="privacy" className="py-20 px-4 sm:px-8 border-b border-[#3A3A38]/15 bg-[#1A3C2B] text-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="max-w-[80rem] mx-auto text-center space-y-8"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 text-[#9EFFBF] border border-white/20 rounded-full text-xs font-['JetBrains_Mono'] uppercase">
            <Lock className="h-3.5 w-3.5" />
            <span>PRIVACY-FIRST PROMISE</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-['Space_Grotesk'] text-4xl sm:text-6xl font-bold max-w-3xl mx-auto">
            Your medical data remains yours alone.
          </motion.h2>

          <motion.p variants={fadeInUp} className="font-['Public_Sans'] text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We employ bank-grade AES 256-bit encryption. Your uploads are processed securely and deleted upon request. Zero data commercialization.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 max-w-4xl mx-auto text-left">
            <motion.div variants={fadeInUp} whileHover={{ y: -4 }} className="bg-white/5 border border-white/10 p-5 rounded-[14px] space-y-2">
              <CheckCircle2 className="h-5 w-5 text-[#9EFFBF]" />
              <h4 className="font-['Space_Grotesk'] font-bold text-lg">HIPAA Aligned</h4>
              <p className="font-['Public_Sans'] text-xs text-slate-300">
                Built strictly according to health portability and accountability standards.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ y: -4 }} className="bg-white/5 border border-white/10 p-5 rounded-[14px] space-y-2">
              <CheckCircle2 className="h-5 w-5 text-[#9EFFBF]" />
              <h4 className="font-['Space_Grotesk'] font-bold text-lg">End-to-End Encryption</h4>
              <p className="font-['Public_Sans'] text-xs text-slate-300">
                Data in transit and at rest is secured with cryptographic hashing.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} whileHover={{ y: -4 }} className="bg-white/5 border border-white/10 p-5 rounded-[14px] space-y-2">
              <CheckCircle2 className="h-5 w-5 text-[#9EFFBF]" />
              <h4 className="font-['Space_Grotesk'] font-bold text-lg">Zero Ads & Selling</h4>
              <p className="font-['Public_Sans'] text-xs text-slate-300">
                We never sell, monetize, or train open models on your personal diagnostic records.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Transparent Pricing Section */}
      <Pricing />

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-8 border-b border-[#3A3A38]/15">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="max-w-[80rem] mx-auto space-y-12"
        >
          <motion.div variants={fadeInUp} className="text-center space-y-3">
            <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
              COMMUNITY IMPACT
            </span>
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold text-[#111827]">
              Trusted by Patients & Physicians
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-white border border-[#3A3A38]/20 p-6 rounded-[14px] space-y-4 flex flex-col justify-between hover:border-[#1A3C2B] transition-colors cursor-pointer shadow-xs"
              >
                <p className="font-['Public_Sans'] text-sm sm:text-base text-[#111827] italic leading-relaxed">
                  "{t.quote}"
                </p>
                <div>
                  <h4 className="font-['Space_Grotesk'] font-bold text-base text-[#1A3C2B]">
                    {t.author}
                  </h4>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#3A3A38]">
                    {t.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 px-4 sm:px-8 border-b border-[#3A3A38]/15">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="max-w-[80rem] mx-auto space-y-12"
        >
          <motion.div variants={fadeInUp} className="text-center space-y-3">
            <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold text-[#111827]">
              Everything you need to know
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white border border-[#3A3A38]/20 rounded-[14px] overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-['Space_Grotesk'] font-bold text-base sm:text-lg text-[#111827] hover:bg-[#F7F7F5] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#1A3C2B] transition-transform duration-300 ${
                      activeFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="px-5 pb-5 font-['Public_Sans'] text-sm text-[#3A3A38] leading-relaxed border-t border-[#3A3A38]/10 pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final Closing CTA Banner Section */}
      <section className="py-20 px-4 sm:px-8 border-b border-[#3A3A38]/15 bg-[#1A3C2B] text-white relative overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-[80rem] mx-auto text-center space-y-8 relative z-10"
        >
          <motion.h2 variants={fadeInUp} className="font-['Space_Grotesk'] text-4xl sm:text-6xl font-bold max-w-3xl mx-auto">
            Ready to Take Control of Your Health?
          </motion.h2>
          <motion.p variants={fadeInUp} className="font-['Public_Sans'] text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
            Join thousands of patients and physicians using MEDITRACK AI for instant, plain-language diagnostic insights.
          </motion.p>
          <motion.div variants={fadeInUp} className="pt-2 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleGetStartedClick}
              className="px-8 py-4 bg-[#9EFFBF] text-[#1A3C2B] font-['Public_Sans'] font-bold text-base rounded-[12px] hover:bg-[#9EFFBF]/90 transition-all cursor-pointer shadow-md"
            >
              Get Started Free Today
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      <FooterComponent />
    </div>
    </>
  );
}
