import { useState } from 'react';
import { motion } from 'framer-motion';
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
  HeartPulse,
  Sparkles,
} from 'lucide-react';
import { HeaderComponent } from '@/components/layout/HeaderComponent';
import { FooterComponent } from '@/components/layout/FooterComponent';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen bg-[#F7F7F5] mosaic-bg text-[#111827] flex flex-col justify-between select-none pt-16">
      <HeaderComponent activeItem="/app/patients" />

      <main className="py-12 px-4 sm:px-8 max-w-[80rem] mx-auto w-full space-y-12">
        {/* Page Header */}
        <div className="border-b border-[#3A3A38]/15 pb-6 space-y-2">
          <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
            ACCREDITED CARE NETWORK
          </span>
          <h1 className="font-['Space_Grotesk'] text-4xl sm:text-5xl font-bold text-[#111827]">
            Specialist Recommendations
          </h1>
          <p className="font-['Public_Sans'] text-sm sm:text-base text-[#3A3A38]">
            Matched directly to your low Ferritin (14 ng/mL) & Vitamin D diagnostic findings.
          </p>
        </div>

        {/* Report Summary Box */}
        <div className="bg-white border border-[#3A3A38]/20 border-l-4 border-l-[#1A3C2B] p-6 rounded-[2px] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#1A3C2B] uppercase">
              CURRENT DIAGNOSTIC REASONING
            </span>
            <span className="font-['JetBrains_Mono'] text-xs text-[#3A3A38]">MATCH ACCURACY: 98.2%</span>
          </div>
          <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">
            Primary Need: Iron Metabolism & General Wellness Assessment
          </h3>
          <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#3A3A38] leading-relaxed">
            Your recent laboratory upload indicated lower-bound Serum Ferritin (14 ng/mL) and sub-optimal Vitamin D. Consulting an Internal Medicine General Practitioner or Clinical Nutritionist is recommended to review oral supplementation and dietary optimization.
          </p>
        </div>

        {/* Primary Recommendation Card (General Practitioner) */}
        <div className="bg-[#1A3C2B] text-white border border-[#3A3A38]/30 p-8 rounded-[2px] space-y-6">
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
                Best suited to conduct a complete evaluation, rule out underlying gastrointestinal causes for iron depletion, and coordinate follow-up blood panels.
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
        </div>

        {/* 3 Specialized Support Cards (Cardiologist, Nutritionist, Wellness Coach) */}
        <div className="space-y-4">
          <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">
            Specialized Care Support Cards
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <div className="h-full flex flex-col justify-between bg-white border border-[#3A3A38]/20 border-l-4 border-l-[#FF8C69] p-6 rounded-[2px] space-y-3">
              <div>
                <HeartPulse className="h-6 w-6 text-[#FF8C69] mb-2" />
                <h4 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
                  Cardiologist
                </h4>
                <p className="font-['Public_Sans'] text-xs text-[#3A3A38] leading-relaxed mt-1">
                  Recommended if fatigue is accompanied by exertional chest discomfort or palpitations.
                </p>
              </div>
            </div>

            <div className="h-full flex flex-col justify-between bg-white border border-[#3A3A38]/20 border-l-4 border-l-[#9EFFBF] p-6 rounded-[2px] space-y-3">
              <div>
                <Sparkles className="h-6 w-6 text-[#1A3C2B] mb-2" />
                <h4 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
                  Clinical Nutritionist
                </h4>
                <p className="font-['Public_Sans'] text-xs text-[#3A3A38] leading-relaxed mt-1">
                  Specialized dietary planning to enhance heme iron absorption and optimize gut absorption.
                </p>
              </div>
            </div>

            <div className="h-full flex flex-col justify-between bg-white border border-[#3A3A38]/20 border-l-4 border-l-[#F4D35E] p-6 rounded-[2px] space-y-3">
              <div>
                <UserCheck className="h-6 w-6 text-amber-600 mb-2" />
                <h4 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
                  Wellness Coach
                </h4>
                <p className="font-['Public_Sans'] text-xs text-[#3A3A38] leading-relaxed mt-1">
                  Lifestyle, sleep, and physical recovery tracking to complement your medical treatment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Care Locator & Streamlined 3-Step Booking Flow */}
        <div className="space-y-6">
          <div className="border-b border-[#3A3A38]/15 pb-3">
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">
              Care Locator & Booking Flow
            </h3>
            <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
              Select a nearby accredited provider and schedule a consultation in 3 easy steps.
            </p>
          </div>

          {/* 3 Step Process Bar */}
          <div className="grid grid-cols-3 gap-3 text-center font-['JetBrains_Mono'] text-xs">
            <div
              className={`p-3 border rounded-[2px] ${
                bookingStep >= 1
                  ? 'bg-[#1A3C2B] text-white border-[#1A3C2B]'
                  : 'bg-white text-[#3A3A38] border-[#3A3A38]/20'
              }`}
            >
              1. SELECT PROVIDER
            </div>
            <div
              className={`p-3 border rounded-[2px] ${
                bookingStep >= 2
                  ? 'bg-[#1A3C2B] text-white border-[#1A3C2B]'
                  : 'bg-white text-[#3A3A38] border-[#3A3A38]/20'
              }`}
            >
              2. CHOOSE TIME SLOT
            </div>
            <div
              className={`p-3 border rounded-[2px] ${
                bookingStep === 3
                  ? 'bg-[#1A3C2B] text-white border-[#1A3C2B]'
                  : 'bg-white text-[#3A3A38] border-[#3A3A38]/20'
              }`}
            >
              3. CONFIRM
            </div>
          </div>

          {/* Nearby Clinic Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {nearbyClinics.map((clinic) => {
              const isSelected = selectedDoctor?.id === clinic.id;
              return (
                <div
                  key={clinic.id}
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
                </div>
              );
            })}
          </div>

          {/* Booking Time Slot Selection & Confirmation Drawer */}
          {selectedDoctor && bookingStep >= 2 && (
            <div className="bg-white border border-[#3A3A38]/20 rounded-[2px] p-6 space-y-4">
              <h4 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
                Schedule Appointment with {selectedDoctor.doctorName}
              </h4>

              <div className="grid sm:grid-cols-3 gap-3 font-['Public_Sans'] text-xs">
                {['Tomorrow at 10:30 AM', 'Tomorrow at 02:00 PM', 'Thursday at 09:15 AM'].map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-[2px] border text-center font-semibold transition-colors ${
                      selectedSlot === slot
                        ? 'bg-[#1A3C2B] text-white border-[#1A3C2B]'
                        : 'bg-[#F7F7F5] border-[#3A3A38]/20 text-[#111827] hover:border-[#1A3C2B]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={handleConfirmBooking}
                  className="px-6 py-3 bg-[#1A3C2B] text-white font-['Public_Sans'] font-bold text-sm rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors"
                >
                  Confirm Appointment ({selectedSlot})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Trust Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-white border border-[#3A3A38]/20 p-6 rounded-[14px] space-y-1">
            <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#1A3C2B]">1,200+</span>
            <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">Accredited Clinics & Specialists</p>
          </div>
          <div className="bg-white border border-[#3A3A38]/20 p-6 rounded-[14px] space-y-1">
            <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#1A3C2B]">99.1%</span>
            <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">Patient Satisfaction Rating</p>
          </div>
          <div className="bg-white border border-[#3A3A38]/20 p-6 rounded-[2px] space-y-1">
            <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#1A3C2B]">&lt; 24 hrs</span>
            <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">Average Consultation Turnaround</p>
          </div>
        </div>
      </main>

      <FooterComponent />
    </div>
  );
}
