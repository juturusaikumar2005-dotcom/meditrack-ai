import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  Star,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Sparkles,
  HeartPulse,
} from 'lucide-react';
import { FooterComponent } from '@/components/layout/FooterComponent';
import toast from 'react-hot-toast';

/* ─────────────────────────── Animation Variants ─────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

const scalePop = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

/* ───────────────────────────── Types & Data ──────────────────────────────── */
interface Clinic {
  id: string;
  doctorName: string;
  specialty: string;
  clinicName: string;
  location: string;
  rating: number;
  reviews: number;
  nextSlot: string;
}

const nearbyClinics: Clinic[] = [
  {
    id: 'c-1',
    doctorName: 'Dr. Sarah Jenkins, MD',
    specialty: 'Internal Medicine / Hematology',
    clinicName: 'Metropolitan Health & Wellness Center',
    location: '0.8 miles away · Downtown Medical Plaza',
    rating: 4.9,
    reviews: 128,
    nextSlot: 'Tomorrow at 10:30 AM',
  },
  {
    id: 'c-2',
    doctorName: 'Dr. Robert Vance, FACC',
    specialty: 'Cardiovascular Specialist',
    clinicName: 'Apex Heart & Vascular Institute',
    location: '1.4 miles away · Medical District',
    rating: 4.8,
    reviews: 94,
    nextSlot: 'Thursday at 02:15 PM',
  },
  {
    id: 'c-3',
    doctorName: 'Dr. Elena Rostova, RD',
    specialty: 'Clinical Nutritionist & Metabolic Coach',
    clinicName: 'Integrative Nutrition Clinic',
    location: '2.1 miles away · Northside Care Center',
    rating: 5.0,
    reviews: 76,
    nextSlot: 'Friday at 09:00 AM',
  },
];

/* ─────────────────────────────── Component ───────────────────────────────── */
export default function PatientsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<Clinic | null>(nearbyClinics[0]);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [selectedSlot, setSelectedSlot] = useState<string>('Tomorrow at 10:30 AM');

  const handleConfirmBooking = () => {
    toast.success(`Appointment confirmed with ${selectedDoctor?.doctorName} for ${selectedSlot}!`, {
      icon: '🏥',
      style: { borderRadius: '2px', background: '#1A3C2B', color: '#FFFFFF' },
    });
    setBookingStep(3);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] mosaic-bg text-[#111827] flex flex-col justify-between select-none">

      <main className="py-12 px-4 sm:px-8 max-w-[80rem] mx-auto w-full space-y-12">

        {/* ── Page Header ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="border-b border-[#3A3A38]/15 pb-6 space-y-2"
        >
          <motion.span
            variants={fadeLeft}
            custom={0}
            className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B] block"
          >
            ACCREDITED CARE NETWORK
          </motion.span>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-['Space_Grotesk'] text-4xl sm:text-5xl font-bold text-[#111827]"
          >
            Specialist Recommendations
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="font-['Public_Sans'] text-sm sm:text-base text-[#3A3A38]"
          >
            Matched directly to your low Ferritin (14 ng/mL) &amp; Vitamin D diagnostic findings.
          </motion.p>
        </motion.div>

        {/* ── Report Summary Box ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="bg-white border border-[#3A3A38]/20 border-l-4 border-l-[#1A3C2B] p-6 rounded-[2px] space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#1A3C2B] uppercase">
              CURRENT DIAGNOSTIC REASONING
            </span>
            <span className="font-['JetBrains_Mono'] text-xs text-[#3A3A38]">MATCH ACCURACY: 98.2%</span>
          </div>
          <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">
            Primary Need: Iron Metabolism &amp; General Wellness Assessment
          </h3>
          <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#3A3A38] leading-relaxed">
            Your recent laboratory upload indicated lower-bound Serum Ferritin (14 ng/mL) and sub-optimal Vitamin D.
            Consulting an Internal Medicine General Practitioner or Clinical Nutritionist is recommended to review oral
            supplementation and dietary optimization.
          </p>
        </motion.div>

        {/* ── Primary Recommendation Card ── */}
        <motion.div
          variants={scalePop}
          initial="hidden"
          animate="visible"
          custom={0}
          className="bg-[#1A3C2B] text-white border border-[#3A3A38]/30 p-8 rounded-[2px] space-y-6"
        >
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-xs text-[#9EFFBF] uppercase font-bold">
              PRIMARY CLINICAL RECOMMENDATION
            </span>
            <span className="px-2.5 py-0.5 bg-[#9EFFBF]/20 text-[#9EFFBF] border border-[#9EFFBF]/30 font-['JetBrains_Mono'] text-[10px] font-bold uppercase rounded-[2px]">
              HIGHEST MATCH
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white">
                General Practitioner / Internal Medicine
              </h2>
              <p className="font-['Public_Sans'] text-sm text-slate-300 leading-relaxed">
                Best suited to conduct a complete evaluation, rule out underlying gastrointestinal causes for iron
                depletion, and coordinate follow-up blood panels.
              </p>
            </div>

            <div className="text-left md:text-right">
              <button
                onClick={() => setSelectedDoctor(nearbyClinics[0])}
                className="w-full md:w-auto px-6 py-3.5 bg-[#9EFFBF] text-[#1A3C2B] font-['Public_Sans'] font-bold text-sm rounded-[2px] hover:bg-white transition-colors"
              >
                Select Primary Provider
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Specialized Support Cards ── */}
        <div className="space-y-4">
          <motion.h3
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]"
          >
            Specialized Care Support Cards
          </motion.h3>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
          >
            {/* Cardiologist */}
            <motion.div
              variants={fadeUp}
              custom={0}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="h-full flex flex-col justify-between bg-white border border-[#3A3A38]/20 border-l-4 border-l-[#FF8C69] p-6 rounded-[2px] space-y-3"
            >
              <div>
                <HeartPulse className="h-6 w-6 text-[#FF8C69] mb-2" />
                <h4 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">Cardiologist</h4>
                <p className="font-['Public_Sans'] text-xs text-[#3A3A38] leading-relaxed mt-1">
                  Recommended if fatigue is accompanied by exertional chest discomfort or palpitations.
                </p>
              </div>
            </motion.div>

            {/* Clinical Nutritionist */}
            <motion.div
              variants={fadeUp}
              custom={1}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="h-full flex flex-col justify-between bg-white border border-[#3A3A38]/20 border-l-4 border-l-[#9EFFBF] p-6 rounded-[2px] space-y-3"
            >
              <div>
                <Sparkles className="h-6 w-6 text-[#1A3C2B] mb-2" />
                <h4 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">Clinical Nutritionist</h4>
                <p className="font-['Public_Sans'] text-xs text-[#3A3A38] leading-relaxed mt-1">
                  Specialized dietary planning to enhance heme iron absorption and optimize gut absorption.
                </p>
              </div>
            </motion.div>

            {/* Wellness Coach */}
            <motion.div
              variants={fadeUp}
              custom={2}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="h-full flex flex-col justify-between bg-white border border-[#3A3A38]/20 border-l-4 border-l-[#F4D35E] p-6 rounded-[2px] space-y-3"
            >
              <div>
                <UserCheck className="h-6 w-6 text-amber-600 mb-2" />
                <h4 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">Wellness Coach</h4>
                <p className="font-['Public_Sans'] text-xs text-[#3A3A38] leading-relaxed mt-1">
                  Lifestyle, sleep, and physical recovery tracking to complement your medical treatment.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Care Locator & Booking Flow ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="space-y-6"
        >
          <div className="border-b border-[#3A3A38]/15 pb-3">
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">
              Care Locator &amp; Booking Flow
            </h3>
            <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
              Select a nearby accredited provider and schedule a consultation in 3 easy steps.
            </p>
          </div>

          {/* 3 Step Progress Bar */}
          <div className="grid grid-cols-3 gap-3 text-center font-['JetBrains_Mono'] text-xs">
            {['1. SELECT PROVIDER', '2. CHOOSE TIME SLOT', '3. CONFIRM'].map((label, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scaleX: 0.8 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`p-3 border rounded-[2px] ${
                  bookingStep > i
                    ? 'bg-[#1A3C2B] text-white border-[#1A3C2B]'
                    : 'bg-white text-[#3A3A38] border-[#3A3A38]/20'
                }`}
              >
                {label}
              </motion.div>
            ))}
          </div>

          {/* Nearby Clinic Cards Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
          >
            {nearbyClinics.map((clinic, idx) => {
              const isSelected = selectedDoctor?.id === clinic.id;
              return (
                <motion.div
                  key={clinic.id}
                  variants={fadeUp}
                  custom={idx}
                  whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(26,60,43,0.12)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={() => {
                    setSelectedDoctor(clinic);
                    setBookingStep(2);
                  }}
                  className={`h-full flex flex-col justify-between bg-white border p-6 rounded-[2px] space-y-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-2 border-[#1A3C2B] ring-2 ring-[#9EFFBF]/50'
                      : 'border-[#3A3A38]/20 hover:border-[#1A3C2B]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-['Space_Grotesk'] font-bold text-lg text-[#111827]">
                        {clinic.doctorName}
                      </h4>
                      <p className="font-['Public_Sans'] text-xs font-semibold text-[#1A3C2B]">
                        {clinic.specialty}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 font-['JetBrains_Mono'] text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-[2px]">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{clinic.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-1 font-['Public_Sans'] text-xs text-[#3A3A38]">
                    <p className="font-semibold text-[#111827]">{clinic.clinicName}</p>
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#1A3C2B]" />
                      <span>{clinic.location}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#3A3A38]/10 flex items-center justify-between text-xs font-['JetBrains_Mono']">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {clinic.nextSlot}
                    </span>
                    <span className="text-[#1A3C2B] font-bold">Select →</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Booking Time Slot Selection & Confirmation Drawer */}
          <AnimatePresence>
            {selectedDoctor && bookingStep >= 2 && (
              <motion.div
                key="booking-drawer"
                initial={{ opacity: 0, y: 24, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 16, height: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden bg-white border border-[#3A3A38]/20 rounded-[2px] p-6 space-y-4"
              >
                <h4 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
                  Schedule Appointment with {selectedDoctor.doctorName}
                </h4>

                <div className="grid sm:grid-cols-3 gap-3 font-['Public_Sans'] text-xs">
                  {['Tomorrow at 10:30 AM', 'Tomorrow at 02:00 PM', 'Thursday at 09:15 AM'].map((slot, si) => (
                    <motion.button
                      key={slot}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: si * 0.08, duration: 0.35 }}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-[2px] border text-center font-semibold transition-colors ${
                        selectedSlot === slot
                          ? 'bg-[#1A3C2B] text-white border-[#1A3C2B]'
                          : 'bg-[#F7F7F5] border-[#3A3A38]/20 text-[#111827] hover:border-[#1A3C2B]'
                      }`}
                    >
                      {slot}
                    </motion.button>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleConfirmBooking}
                    className="px-6 py-3 bg-[#1A3C2B] text-white font-['Public_Sans'] font-bold text-sm rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors"
                  >
                    Confirm Appointment ({selectedSlot})
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Trust Metrics Section ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
        >
          {[
            { value: '1,200+', label: 'Accredited Clinics & Specialists' },
            { value: '99.1%', label: 'Patient Satisfaction Rating' },
            { value: '< 24 hrs', label: 'Average Consultation Turnaround' },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              variants={scalePop}
              custom={i}
              whileHover={{ y: -3, boxShadow: '0 12px 30px rgba(26,60,43,0.10)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-white border border-[#3A3A38]/20 p-6 rounded-[14px] space-y-1"
            >
              <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#1A3C2B]">{metric.value}</span>
              <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">{metric.label}</p>
            </motion.div>
          ))}
        </motion.div>

      </main>

      <FooterComponent />
    </div>
  );
}
