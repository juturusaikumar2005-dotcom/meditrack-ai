import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HeartHandshake, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface HeaderComponentProps {
  activeItem?: string;
  howItWorksHref?: string;
  featuresHref?: string;
  assistantHref?: string;
  pricingHref?: string;
  faqHref?: string;
}

export function HeaderComponent({
  activeItem,
  howItWorksHref = '#how-it-works',
  featuresHref = '#features',
  assistantHref = '#assistant',
  pricingHref = '#pricing',
  faqHref = '#faq',
}: HeaderComponentProps) {
  const { session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = activeItem || location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStartedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (session) {
      navigate('/app/dashboard');
    } else {
      navigate('/signin');
    }
  };

  const navLinks = [
    { label: 'How It Works', href: howItWorksHref },
    { label: 'Features', href: featuresHref },
    { label: 'AI Assistant', href: assistantHref },
    { label: 'Pricing', href: pricingHref },
    { label: 'FAQ', href: faqHref },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 h-20 lg:h-22 transition-all duration-300 flex items-center px-6 sm:px-10 lg:px-14 select-none ${
        scrolled
          ? 'bg-[#F7F7F5]/98 backdrop-blur-md border-b border-[#3A3A38]/20 shadow-xs'
          : 'bg-[#F7F7F5]/70 backdrop-blur-xs border-b border-[#3A3A38]/10'
      }`}
    >
      <div className="max-w-[88rem] mx-auto w-full flex items-center justify-between gap-6">
        {/* Brand Logo & Application Name */}
        <Link to="/" className="flex items-center gap-3 sm:gap-3.5 group shrink-0">
          <div className="h-9 w-9 md:h-[42px] md:w-[42px] lg:h-12 lg:w-12 bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center rounded-[10px] transition-transform group-hover:scale-105 border border-[#1A3C2B]">
            <HeartHandshake className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
          </div>
          <span className="font-['Space_Grotesk'] text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold text-[#111827] tracking-tight leading-none">
            MEDITRACK <span className="text-[#1A3C2B]">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10 text-sm lg:text-base font-semibold font-['Public_Sans'] text-[#3A3A38]">
          {navLinks.map((link) => {
            const isActive = currentPath === link.href;
            const isRouterLink = link.href.startsWith('/');
            return isRouterLink ? (
              <Link
                key={link.label}
                to={link.href}
                className={`transition-colors hover:text-[#1A3C2B] ${
                  isActive ? 'text-[#1A3C2B] font-bold border-b-2 border-[#1A3C2B] pb-1' : ''
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={`transition-colors hover:text-[#1A3C2B] ${
                  isActive ? 'text-[#1A3C2B] font-bold border-b-2 border-[#1A3C2B] pb-1' : ''
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Single Primary CTA Button (Desktop) */}
        <div className="hidden md:flex items-center font-['Public_Sans']">
          <button
            onClick={handleGetStartedClick}
            className="px-6 py-3 text-sm lg:text-base font-semibold bg-[#1A3C2B] text-white hover:bg-[#1A3C2B]/90 rounded-[12px] transition-all active:scale-95 shadow-none border border-[#1A3C2B] cursor-pointer"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-[10px] text-[#1A3C2B] hover:bg-[#1A3C2B]/10 transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-20 inset-x-0 bg-[#F7F7F5] border-b border-[#3A3A38]/20 p-6 space-y-5 shadow-xl z-40"
          >
            <nav className="flex flex-col space-y-3.5 font-['Public_Sans'] text-base font-semibold text-[#111827]">
              {navLinks.map((link) => {
                const isRouterLink = link.href.startsWith('/');
                return isRouterLink ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1.5 hover:text-[#1A3C2B] transition-colors border-b border-[#3A3A38]/10"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1.5 hover:text-[#1A3C2B] transition-colors border-b border-[#3A3A38]/10"
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>
            <div className="pt-2 font-['Public_Sans']">
              <button
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleGetStartedClick(e);
                }}
                className="w-full block text-center py-3 text-base font-semibold bg-[#1A3C2B] text-white rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
