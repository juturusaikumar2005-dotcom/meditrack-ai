import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

import LandingPage from '@/pages/LandingPage';
const SignInPage = lazy(() => import('@/pages/SignInPage'));
const SignUpPage = lazy(() => import('@/pages/SignUpPage'));
const AuthCallbackPage = lazy(() => import('@/pages/AuthCallbackPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const UploadPage = lazy(() => import('@/pages/UploadPage'));
const AIAnalysisPage = lazy(() => import('@/pages/AIAnalysisPage'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const HistoryPage = lazy(() => import('@/pages/HistoryPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const PrescriptionPage = lazy(() => import('@/pages/PrescriptionPage'));
const HealthTimelinePage = lazy(() => import('@/pages/HealthTimelinePage'));

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

              {/* Authentication Pages */}
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />

              {/* Core MVP Protected Application Routes */}
              <Route path="/app" element={<ProtectedRoutes />}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
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
