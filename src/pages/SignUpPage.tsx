import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HeartHandshake,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  ArrowLeft,
  FileText,
  Brain,
  Stethoscope,
  CheckCircle2,
} from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { GoogleIcon } from './SignInPage';
import toast from 'react-hot-toast';

type SignUpForm = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

const featureHighlights = [
  {
    icon: FileText,
    title: 'AI Report Analysis',
    desc: 'Understand complex medical reports in simple language.',
    accent: 'border-l-4 border-l-[#9EFFBF]',
  },
  {
    icon: Brain,
    title: 'AI Health Assistant',
    desc: 'Ask health-related questions anytime and receive clear, helpful guidance.',
    accent: 'border-l-4 border-l-[#FF8C69]',
  },
  {
    icon: Stethoscope,
    title: 'Specialist Recommendations',
    desc: 'Receive suggestions on the right healthcare specialist based on your reports.',
    accent: 'border-l-4 border-l-[#F4D35E]',
  },
];

export default function SignUpPage() {
  const { signUp, signInWithGoogle, session } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [session, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>({
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', terms: false },
  });

  const passwordValue = watch('password');

  const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
    setLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setLoading(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Account created successfully!');
      navigate('/app/welcome');
    }
  };

  const handleGoogleAuth = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(`Google Sign-In failed: ${error}`);
    } else {
      toast.success('Signed in with Google successfully');
      navigate('/app/welcome');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] mosaic-bg flex flex-col justify-between select-none font-['Public_Sans']">
      {/* Top Header Bar */}
      <header className="px-6 py-4 flex items-center justify-between z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#1A3C2B] hover:underline transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Split-Screen Container */}
      <div className="flex-1 max-w-[84rem] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT BRANDING PANEL (Hidden on Mobile, 45% Desktop / 40% Tablet) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-8 pr-4"
          >
            {/* Brand Logo & Headline */}
            <div className="space-y-4">
              <Link to="/app/dashboard" className="flex items-center gap-3 group cursor-pointer">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-11 w-11 rounded-[10px] bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center border border-[#1A3C2B] group-hover:scale-105 transition-transform"
                >
                  <HeartHandshake className="h-6 w-6" />
                </motion.div>
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827] tracking-tight group-hover:text-[#1A3C2B] transition-colors">
                  MEDITRACK
                </span>
              </Link>

              <h1 className="font-['Space_Grotesk'] text-4xl xl:text-5xl font-bold text-[#111827] tracking-tight leading-tight">
                Understand Your Health with AI.
              </h1>

              <p className="font-['Public_Sans'] text-sm text-[#3A3A38] leading-relaxed">
                Upload your medical reports, receive AI-powered explanations, track your health history, and get personalized specialist recommendations—all in one secure place.
              </p>
            </div>

            {/* 3 Value Feature Cards */}
            <div className="space-y-3 pt-2">
              {featureHighlights.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 + idx * 0.1 }}
                    className={`bg-white border border-[#3A3A38]/20 rounded-[14px] p-4 flex items-start gap-3.5 ${feat.accent} hover:border-[#1A3C2B] transition-colors`}
                  >
                    <div className="p-2 bg-[#F7F7F5] border border-[#3A3A38]/15 rounded-[10px] text-[#1A3C2B] shrink-0 mt-0.5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-['Space_Grotesk'] font-bold text-sm text-[#111827]">
                        {feat.title}
                      </h4>
                      <p className="font-['Public_Sans'] text-xs text-[#3A3A38] mt-0.5 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Trust Section Footer */}
            <div className="pt-4 border-t border-[#3A3A38]/15 flex flex-wrap items-center gap-4 text-xs font-['JetBrains_Mono'] text-[#1A3C2B]">
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-4 w-4" /> Secure & Private
              </span>
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-4 w-4" /> AI-Powered Insights
              </span>
              <span className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="h-4 w-4" /> 256-Bit Encrypted
              </span>
            </div>
          </motion.div>

          {/* RIGHT AUTHENTICATION PANEL (55% Desktop / 60% Tablet / 100% Mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="lg:col-span-7 w-full max-w-md mx-auto lg:max-w-lg"
          >
            {/* Mobile Branding Header */}
            <div className="lg:hidden text-center mb-6 space-y-2">
              <div className="flex items-center justify-center gap-2.5">
                <div className="h-10 w-10 rounded-[10px] bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">
                  MEDITRACK <span className="text-[#1A3C2B]">AI</span>
                </span>
              </div>
            </div>

            {/* Flat Card Container */}
            <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] shadow-none p-6 sm:p-10">
              <div className="mb-6 space-y-1 text-center sm:text-left">
                <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
                  Create Your Account
                </h2>
                <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#3A3A38]">
                  Join MEDITRACK AI for personalized clinical insights
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-['Public_Sans']">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 h-4 w-4 text-[#3A3A38] pointer-events-none" />
                    <input
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Doe"
                      {...register('fullName', {
                        required: 'Full name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' },
                      })}
                      className="w-full h-11 pl-10 pr-3.5 rounded-[12px] bg-[#F7F7F5] border border-[#3A3A38]/20 text-xs sm:text-sm text-[#111827] placeholder:text-[#3A3A38]/60 outline-none focus:bg-white focus:border-[#1A3C2B] transition-colors"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 h-4 w-4 text-[#3A3A38] pointer-events-none" />
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      {...register('email', {
                        required: 'Email address is required',
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: 'Please enter a valid email address',
                        },
                      })}
                      className="w-full h-11 pl-10 pr-3.5 rounded-[12px] bg-[#F7F7F5] border border-[#3A3A38]/20 text-xs sm:text-sm text-[#111827] placeholder:text-[#3A3A38]/60 outline-none focus:bg-white focus:border-[#1A3C2B] transition-colors"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 h-4 w-4 text-[#3A3A38] pointer-events-none" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                      })}
                      className="w-full h-11 pl-10 pr-10 rounded-[12px] bg-[#F7F7F5] border border-[#3A3A38]/20 text-xs sm:text-sm text-[#111827] placeholder:text-[#3A3A38]/60 outline-none focus:bg-white focus:border-[#1A3C2B] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 text-[#3A3A38] hover:text-[#111827] p-1 cursor-pointer"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 mt-1 font-medium">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 h-4 w-4 text-[#3A3A38] pointer-events-none" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === passwordValue || 'Passwords do not match',
                      })}
                      className="w-full h-11 pl-10 pr-3.5 rounded-[12px] bg-[#F7F7F5] border border-[#3A3A38]/20 text-xs sm:text-sm text-[#111827] placeholder:text-[#3A3A38]/60 outline-none focus:bg-white focus:border-[#1A3C2B] transition-colors"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1 font-medium">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start pt-1">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register('terms', { required: 'You must accept the terms of service' })}
                      className="mt-0.5 h-4 w-4 rounded-[4px] border-[#3A3A38]/30 text-[#1A3C2B] focus:ring-[#1A3C2B]"
                    />
                    <span className="text-xs text-[#3A3A38]">
                      I agree to the{' '}
                      <a href="#terms" className="font-semibold text-[#1A3C2B] hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#privacy" className="font-semibold text-[#1A3C2B] hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-xs text-red-600 font-medium">{errors.terms.message}</p>
                )}

                {/* Sign Up Submit Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-[12px] bg-[#1A3C2B] text-white text-xs sm:text-sm font-semibold hover:bg-[#1A3C2B]/90 transition-colors flex items-center justify-center cursor-pointer shadow-none"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating account...</span>
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </motion.button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#3A3A38]/20" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-[#3A3A38] font-['JetBrains_Mono'] uppercase text-[10px]">
                      OR SIGN UP WITH
                    </span>
                  </div>
                </div>

                {/* Google Authentication Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full h-11 rounded-[12px] bg-white border border-[#3A3A38]/20 text-xs sm:text-sm font-semibold text-[#111827] hover:bg-[#F7F7F5] hover:border-[#1A3C2B] transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-none"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </motion.button>
              </form>

              {/* Footer Link */}
              <div className="mt-6 text-center text-xs text-[#3A3A38]">
                Already have an account?{' '}
                <Link to="/signin" className="font-semibold text-[#1A3C2B] hover:underline">
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <footer className="py-4 text-center text-[11px] font-['JetBrains_Mono'] text-[#3A3A38]">
        © {new Date().getFullYear()} MEDITRACK AI · HIPAA COMPLIANT · 256-BIT ENCRYPTED
      </footer>
    </div>
  );
}
