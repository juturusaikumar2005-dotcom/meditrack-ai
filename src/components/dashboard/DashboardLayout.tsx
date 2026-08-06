import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { AIAssistantProvider } from '@/context/AIAssistantContext';
import { AIChatWidget } from '@/components/ai-assistant/AIChatWidget';

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Note: Auth guarding is handled exclusively by ProtectedRoutes in App.tsx.
  // DashboardLayout only renders when the user is authenticated.

  return (
    <AIAssistantProvider>
      <div className="min-[#F7F7F5] min-h-screen relative">
        <AnimatedBackground dense />
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div className={`transition-[padding] duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <OnboardingTour />
        <AIChatWidget />
      </div>
    </AIAssistantProvider>
  );
}
