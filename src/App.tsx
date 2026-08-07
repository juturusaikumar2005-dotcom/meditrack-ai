import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

import LandingPage from '@/pages/LandingPage';

// Self-healing lazy loader for dynamic imports across Vercel deployments
const lazyWithRetry = (componentImport: () => Promise<any>) =>
  lazy(async () => {
    const pageHasBeenRefreshed = JSON.parse(
      window.sessionStorage.getItem('meditrack_stale_reload') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('meditrack_stale_reload', 'false');
      return component;
    } catch (error: any) {
      if (!pageHasBeenRefreshed) {
        window.sessionStorage.setItem('meditrack_stale_reload', 'true');
        window.location.reload();
        return new Promise(() => {});
      }
      throw error;
    }
  });

const SignInPage = lazyWithRetry(() => import('@/pages/SignInPage'));
const SignUpPage = lazyWithRetry(() => import('@/pages/SignUpPage'));
const AuthCallbackPage = lazyWithRetry(() => import('@/pages/AuthCallbackPage'));
const DashboardPage = lazyWithRetry(() => import('@/pages/DashboardPage'));
const UploadPage = lazyWithRetry(() => import('@/pages/UploadPage'));
const PrescriptionPage = lazyWithRetry(() => import('@/pages/PrescriptionPage'));
const AIAnalysisPage = lazyWithRetry(() => import('@/pages/AIAnalysisPage'));
const ChatPage = lazyWithRetry(() => import('@/pages/ChatPage'));
const HistoryPage = lazyWithRetry(() => import('@/pages/HistoryPage'));
const ProfilePage = lazyWithRetry(() => import('@/pages/ProfilePage'));
const SettingsPage = lazyWithRetry(() => import('@/pages/SettingsPage'));
const HealthTimelinePage = lazyWithRetry(() => import('@/pages/HealthTimelinePage'));
const WelcomeLandingPage = lazyWithRetry(() => import('@/pages/WelcomeLandingPage'));

function ProtectedRoutes() {
  const { session, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!session) return <Navigate to="/signin" replace />;
  return <DashboardLayout />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-[#F7F7F5]">
                <div className="h-8 w-8 border-2 border-[#1A3C2B] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* OAuth Callback Handler */}
              <Route path="/auth/callback" element={<AuthCallbackPage />} />

              {/* Welcome Post Sign-In Landing Page */}
              <Route path="/welcome" element={<WelcomeLandingPage />} />

              {/* Authentication Pages */}
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />

              {/* Core MVP Protected Application Routes */}
              <Route path="/app" element={<ProtectedRoutes />}>
                <Route index element={<Navigate to="/welcome" replace />} />
                <Route path="welcome" element={<WelcomeLandingPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="upload" element={<UploadPage />} />
                <Route path="prescription" element={<PrescriptionPage />} />
                <Route path="ai-analysis" element={<AIAnalysisPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="timeline" element={<HealthTimelinePage />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Fallback Catch-All Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1px solid rgba(58,58,56,0.2)',
                fontSize: '13px',
                fontFamily: 'Public Sans',
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
