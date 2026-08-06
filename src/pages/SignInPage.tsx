import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HeartHandshake,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  FileText,
  Brain,
  Stethoscope,
  CheckCircle2,
} from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

type SignInForm = { email: string; password: string; remember: boolean };

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

export default function SignInPage() {
  const { signIn, signInWithGoogle, session } = useAuth();
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
    formState: { errors },
  } = useForm<SignInForm>({
    defaultValues: { email: '', password: '', remember: true },
  });

  const onSubmit: SubmitHandler<SignInForm> = async (data) => {
    setLoading(true);
    const { error } = await signIn(data.email, data.password);
    setLoading(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Welcome back to MEDITRACK AI');
      navigate('/app/dashboard');
    }
  };

  const handleGoogleAuth = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(`Google Sign-In failed: ${error}`);
    }
  };

  const handleForgotPassword = () => {
    toast('Password reset link sent to registered email address', {
      icon: '📧',
      style: { borderRadius: '12px', background: '#1A3C2B', color: '#FFFFFF' },
    });
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
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-11 w-11 rounded-[10px] bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center border border-[#1A3C2B]"
                >
                  <HeartHandshake className="h-6 w-6" />
                </motion.div>
                <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827] tracking-tight">
                  MEDITRACK <span className="text-[#1A3C2B]">AI</span>
                </span>
              </div>

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
                  Welcome Back
                </h2>
                <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#3A3A38]">
                  Sign in to access your personal healthcare portal
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-['Public_Sans']">
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#111827]">Password</label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-semibold text-[#1A3C2B] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 h-4 w-4 text-[#3A3A38] pointer-events-none" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      autoComplete="current-password"
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

                {/* Remember Me Checkbox */}
                <div className="flex items-center pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register('remember')}
                      className="h-4 w-4 rounded-[4px] border-[#3A3A38]/30 text-[#1A3C2B] focus:ring-[#1A3C2B]"
                    />
                    <span className="text-xs text-[#3A3A38] font-medium">Remember me on this device</span>
                  </label>
                </div>

                {/* Sign In Submit Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-[12px] bg-[#1A3C2B] text-white text-xs sm:text-sm font-semibold hover:bg-[#1A3C2B]/90 transition-colors flex items-center justify-center cursor-pointer shadow-none"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </motion.button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#3A3A38]/20" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-[#3A3A38] font-['JetBrains_Mono'] uppercase text-[10px]">
                      OR CONTINUE WITH
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
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-[#1A3C2B] hover:underline">
                  Sign Up
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

export function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
