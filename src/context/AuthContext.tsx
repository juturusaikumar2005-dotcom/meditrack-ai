import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase, type Session, type User } from '@/lib/supabase';
import type { Profile } from '@/lib/types';

/**
 * AuthContextValue provides full Supabase Authentication state and actions
 * across the entire MEDITRACK AI application.
 */
type AuthContextValue = {
  /** Live Supabase Session object */
  supabaseSession: Session | null;
  /** Live Supabase User object */
  supabaseUser: User | null;
  /** Unified session reference used by ProtectedRoutes */
  session: { token: string; user: Profile } | null;
  /** Active user profile data */
  profile: Profile | null;
  /** True while auth state is resolving */
  loading: boolean;
  /** Supabase Email + Password Sign In */
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  /** Supabase Email + Password Sign Up */
  signUp: (email: string, password: string, fullName: string, role?: Profile['role']) => Promise<{ error: string | null }>;
  /** Supabase Google OAuth Sign In with prompt: "select_account" */
  signInWithGoogle: () => Promise<{ error: string | null }>;
  /** Supabase Global Logout with session & storage purge */
  signOut: () => Promise<void>;
  /** Refresh Profile directly from Supabase auth.getUser() */
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Session Restoration & Official Auth State Listener ────────────────────
  useEffect(() => {
    let mounted = true;

    // Detect if current URL has OAuth params (code or access_token or callback route)
    const hasOAuthParams =
      window.location.hash.includes('access_token') ||
      window.location.hash.includes('error') ||
      window.location.search.includes('code') ||
      window.location.pathname.includes('/auth/callback');

    console.log('[Auth Context Init] OAuth redirect params present:', hasOAuthParams, 'Location:', window.location.href);

    // Official Supabase Auth Listener (Fires automatically on token exchange)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[Supabase AuthStateChange] Event: "${event}", User: ${session?.user?.email ?? 'none'}, Token: ${session?.access_token ? 'Present' : 'None'}`);

      if (mounted) {
        setSupabaseSession(session);
        setSupabaseUser(session?.user ?? null);
        setLoading(false);
      }
    });

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const { data: { user } } = await supabase.auth.getUser();

        console.log('[Auth Init getSession]:', session ? `Session Active (${session.user.email})` : 'No Active Session');

        if (mounted) {
          if (session || user) {
            setSupabaseSession(session);
            setSupabaseUser(user ?? session?.user ?? null);
            setLoading(false);
          } else if (!hasOAuthParams) {
            // Only set loading = false if NOT waiting for OAuth redirect token exchange
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('[Auth Init Error]:', err);
        if (mounted && !hasOAuthParams) setLoading(false);
      }
    };

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ── User Profile Construction from Authenticated Supabase User ────────────
  const profile: Profile | null = supabaseUser
    ? {
        id: supabaseUser.id,
        email: supabaseUser.email ?? '',
        full_name:
          supabaseUser.user_metadata?.full_name ??
          supabaseUser.user_metadata?.name ??
          supabaseUser.email?.split('@')[0] ??
          'User',
        role: (supabaseUser.user_metadata?.role as Profile['role']) ?? 'patient',
        avatar_url: supabaseUser.user_metadata?.avatar_url ?? null,
        created_at: supabaseUser.created_at || new Date().toISOString(),
      }
    : null;

  const session = supabaseSession
    ? { token: supabaseSession.access_token, user: profile! }
    : null;

  // ── Supabase Email + Password Sign In ──────────────────────────────────────
  const signIn: AuthContextValue['signIn'] = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    if (data.session) {
      setSupabaseSession(data.session);
      setSupabaseUser(data.session.user);
    }
    return { error: null };
  };

  // ── Supabase Email + Password Sign Up ──────────────────────────────────────
  const signUp: AuthContextValue['signUp'] = async (email, password, fullName, role = 'patient') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.session) {
      setSupabaseSession(data.session);
      setSupabaseUser(data.session.user);
    }
    return { error: null };
  };

  // ── Standard Supabase Google OAuth Sign In ─────────
  const signInWithGoogle: AuthContextValue['signInWithGoogle'] = async () => {
    const redirectTo = `${window.location.origin}/auth/callback`;
    console.log('[Supabase Google OAuth] Initiating redirect to:', redirectTo);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        },
      },
    });

    if (error) {
      console.error('[Google OAuth Error]:', error.message);
      return { error: error.message };
    }
    return { error: null };
  };

  // ── Supabase Global Logout (Fix 2: scope: "global" & storage purge) ─────────
  const signOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.error('[SignOut Error]:', err);
    }
    localStorage.clear();
    sessionStorage.clear();
    setSupabaseSession(null);
    setSupabaseUser(null);
    window.location.href = '/';
  };

  // ── Refresh Profile (Fix 3: Always obtain authenticated user from getUser) ──
  const refreshProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();
      if (session && user) {
        setSupabaseSession(session);
        setSupabaseUser(user);
      }
    } catch (err) {
      console.error('[Refresh Profile Error]:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        supabaseSession,
        supabaseUser,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
