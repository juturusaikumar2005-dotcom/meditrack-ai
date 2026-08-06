import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { AIAssistantProvider } from '@/context/AIAssistantContext';
import { AIChatWidget } from '@/components/ai-assistant/AIChatWidget';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageTransitionWrapper } from '@/components/dashboard/PageTransitionWrapper';

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ErrorBoundary>
      <AIAssistantProvider>
        <div className="bg-[#F7F7F5] min-h-screen relative">
          <AnimatedBackground dense />
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          <div className={`transition-[padding] duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
            <Topbar onMenuClick={() => setMobileOpen(true)} />
            <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
              <PageTransitionWrapper>
                <Outlet />
              </PageTransitionWrapper>
            </main>
          </div>
          <OnboardingTour />
          <AIChatWidget />
        </div>
      </AIAssistantProvider>
    </ErrorBoundary>
  );
}
