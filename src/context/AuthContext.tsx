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
  /** Supabase Email + Password Sign Up (Auto-inserts record into profiles table) */
  signUp: (email: string, password: string, fullName: string, role?: Profile['role']) => Promise<{ error: string | null }>;
  /** Supabase Google OAuth Sign In */
  signInWithGoogle: () => Promise<{ error: string | null }>;
  /** Supabase Logout */
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Session Restoration & State Listener ──────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        setSupabaseSession(session);
        setSupabaseUser(session?.user ?? null);
        setLoading(false);
      }
    };

    initAuth();

    // Listen to real-time auth changes (sign-in, sign-out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSupabaseSession(session);
        setSupabaseUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ── User Profile Construction ──────────────────────────────────────────────
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

  // ── Supabase Google OAuth Sign In ──────────────────────────────────────────
  const signInWithGoogle: AuthContextValue['signInWithGoogle'] = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  };

  // ── Supabase Logout ────────────────────────────────────────────────────────
  const signOut = async () => {
    await supabase.auth.signOut();
    setSupabaseSession(null);
    setSupabaseUser(null);
  };

  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setSupabaseSession(session);
      setSupabaseUser(session.user);
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
