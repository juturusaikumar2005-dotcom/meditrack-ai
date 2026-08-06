import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function AuthLoadingPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (session) {
      // If returning user is already authenticated, go directly to Dashboard
      navigate('/app/dashboard', { replace: true });
    } else {
      // Mark onboarding as completed for future visits
      localStorage.setItem('meditrack_onboarded', 'true');

      // Show first-time branded loading transition screen for 2.2s before mandatory Sign In
      const timer = setTimeout(() => {
        navigate('/signin', { replace: true });
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [session, loading, navigate]);

  return <LoadingScreen />;
}
