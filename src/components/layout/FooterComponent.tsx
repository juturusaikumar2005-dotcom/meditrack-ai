import { Link } from 'react-router-dom';
import { HeartHandshake, ShieldCheck } from 'lucide-react';

interface FooterComponentProps {
  year?: number;
  howHref?: string;
  featuresHref?: string;
  pricingHref?: string;
  faqHref?: string;
  supportHref?: string;
  securityHref?: string;
  privacyHref?: string;
  termsHref?: string;
}

export function FooterComponent({
  year = new Date().getFullYear(),
  howHref = '#how-it-works',
  featuresHref = '#features',
  pricingHref = '#pricing',
  faqHref = '#faq',
  supportHref = '/app/chat',
  securityHref = '#trust',
  privacyHref = '#privacy',
  termsHref = '#terms',
}: FooterComponentProps) {
  return (
    <footer className="bg-[#1A3C2B] text-white border-t border-[#3A3A38]/30 pt-16 pb-12 px-4 sm:px-8 select-none">
      <div className="max-w-[80rem] mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 bg-white text-[#1A3C2B] flex items-center justify-center rounded-[10px]">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <span className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-white">
                MEDITRACK
              </span>
            </Link>
            <p className="text-sm text-slate-300 font-['Public_Sans'] leading-relaxed max-w-sm">
              Your health, explained simply. Empowering individuals and healthcare providers with instant AI clinical insights and specialist routing.
            </p>
            <div className="flex items-center gap-2 text-xs font-['JetBrains_Mono'] text-[#9EFFBF]">
              <ShieldCheck className="h-4 w-4" />
              <span>HIPAA Compliant · 256-bit Encrypted</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="font-['Space_Grotesk'] font-bold text-sm text-[#9EFFBF] uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-slate-300 font-['Public_Sans']">
              <li><a href={howHref} className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href={featuresHref} className="hover:text-white transition-colors">Features</a></li>
              <li><Link to="/app/chat" className="hover:text-white transition-colors">AI Health Assistant</Link></li>
              <li><a href={pricingHref} className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <h4 className="font-['Space_Grotesk'] font-bold text-sm text-[#9EFFBF] uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-slate-300 font-['Public_Sans']">
              <li><a href={faqHref} className="hover:text-white transition-colors">FAQ</a></li>
              <li><Link to={supportHref} className="hover:text-white transition-colors">Support Center</Link></li>
              <li><a href={securityHref} className="hover:text-white transition-colors">Security Overview</a></li>
              <li><Link to="/app/patients" className="hover:text-white transition-colors">Find a Specialist</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="font-['Space_Grotesk'] font-bold text-sm text-[#9EFFBF] uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-slate-300 font-['Public_Sans']">
              <li><a href={privacyHref} className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href={termsHref} className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#compliance" className="hover:text-white transition-colors">Clinical Compliance</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-['JetBrains_Mono'] text-slate-400">
          <p>© {year} MEDITRACK AI. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#9EFFBF] transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-[#9EFFBF] transition-colors">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-[#9EFFBF] transition-colors">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
