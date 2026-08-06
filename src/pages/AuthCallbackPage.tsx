import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';

/**
 * OAuth Callback Page — /auth/callback
 * Handles Google OAuth redirect consent flow and ensures smooth redirection to /app/dashboard.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { session, refreshProfile } = useAuth();

  useEffect(() => {
    let isMounted = true;

    async function handleCallback() {
      console.log('[Auth Callback] Mounted. Processing OAuth session...');

      const { data: { session: activeSession }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('[OAuth Callback Error]:', error.message);
        if (isMounted) navigate('/signin?error=oauth_failed', { replace: true });
        return;
      }

      if (activeSession) {
        console.log(`[OAuth Callback Success] Session restored. User ID: ${activeSession.user.id}`);
        await refreshProfile();
        if (isMounted) navigate('/app/welcome', { replace: true });
      } else if (session) {
        if (isMounted) navigate('/app/welcome', { replace: true });
      } else {
        console.warn('[OAuth Callback Warning] No active session found. Redirecting to signin.');
        if (isMounted) navigate('/signin', { replace: true });
      }
    }

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate, session, refreshProfile]);

  return <LoadingScreen />;
}
