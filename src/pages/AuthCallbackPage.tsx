import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { LoadingScreen } from '@/components/LoadingScreen';

/**
 * OAuth Callback Page — /auth/callback
 *
 * Supabase redirects back here after Google OAuth consent.
 * When detectSessionInUrl is enabled (set in supabase.ts), the Supabase client
 * automatically exchanges the URL code/hash for a session.
 * We simply wait for onAuthStateChange to fire (handled in AuthContext),
 * then redirect to the dashboard.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // getSession() triggers the PKCE code exchange if there's a ?code= param in the URL.
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('[MEDITRACK] OAuth callback error:', error.message);
        navigate('/signin?error=oauth_failed', { replace: true });
        return;
      }

      if (session) {
        // Google OAuth succeeded — session is now live in Supabase + AuthContext
        navigate('/app/dashboard', { replace: true });
      } else {
        // No session yet — something went wrong
        navigate('/signin', { replace: true });
      }
    });
  }, [navigate]);

  return <LoadingScreen />;
}
