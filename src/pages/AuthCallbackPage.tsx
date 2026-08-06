import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import toast from 'react-hot-toast';

/**
 * OAuth Callback Page — /auth/callback
 * Handles Google OAuth redirect PKCE & hash token exchange, updates profile, and redirects user.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [statusMessage, setStatusMessage] = useState('Authenticating with Google...');

  useEffect(() => {
    let isMounted = true;

    async function processOAuthCallback() {
      console.log('[OAuth Callback] Page mounted. Exchanging authorization token...');

      try {
        // 1. Fetch current or newly exchanged session
        const { data: { session: activeSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('[OAuth Callback Error]:', sessionError.message);
          toast.error(`Google Sign-In failed: ${sessionError.message}`);
          if (isMounted) navigate('/signin', { replace: true });
          return;
        }

        // 2. Fetch authenticated user directly from Supabase
        const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();

        if (userError || (!activeSession && !authUser)) {
          console.warn('[OAuth Callback Warning]: Session or User not established yet. Waiting for Auth listener...');
          setStatusMessage('Finalizing Google authentication...');
          
          // Subscribe to live auth state change
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`[OAuth AuthStateChange]: Event = ${event}`, session?.user?.email);
            if (session?.user && isMounted) {
              await upsertUserProfile(session.user);
              await refreshProfile();
              toast.success(`Signed in as ${session.user.email}`);
              navigate('/app/welcome', { replace: true });
            }
          });

          // Timeout safety: 8 seconds
          setTimeout(() => {
            if (isMounted && !activeSession) {
              console.error('[OAuth Callback Timeout]: Failed to resolve Google Session after 8s');
              subscription.unsubscribe();
              toast.error('Google Authentication timed out. Please try again.');
              navigate('/signin', { replace: true });
            }
          }, 8000);
          return;
        }

        const currentUser = authUser || activeSession?.user;
        if (currentUser) {
          console.log(`[OAuth Callback Success] User ID: ${currentUser.id}, Email: ${currentUser.email}`);
          await upsertUserProfile(currentUser);
          await refreshProfile();

          if (isMounted) {
            toast.success(`Signed in as ${currentUser.email}`);
            navigate('/app/welcome', { replace: true });
          }
        }
      } catch (err: any) {
        console.error('[OAuth Callback Unhandled Error]:', err);
        toast.error('Failed to complete Google sign-in');
        if (isMounted) navigate('/signin', { replace: true });
      }
    }

    async function upsertUserProfile(user: any) {
      try {
        const profileData = {
          id: user.id,
          email: user.email ?? '',
          full_name:
            user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            user.email?.split('@')[0] ??
            'User',
          avatar_url: user.user_metadata?.avatar_url ?? null,
          role: user.user_metadata?.role ?? 'patient',
          created_at: user.created_at || new Date().toISOString(),
        };

        console.log('[OAuth Callback Upserting Profile]:', profileData);
        await supabase.from('profiles').upsert(profileData, { onConflict: 'id' });
      } catch (upsertErr) {
        console.warn('[Profile Upsert Non-Fatal Warning]:', upsertErr);
      }
    }

    processOAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate, refreshProfile]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F5] font-['Public_Sans']">
      <LoadingScreen />
      <p className="mt-4 text-xs font-['JetBrains_Mono'] text-[#3A3A38] uppercase tracking-wider animate-pulse">
        {statusMessage}
      </p>
    </div>
  );
}
