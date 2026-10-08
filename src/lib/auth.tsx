import { useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { clearGame, loadGame } from "@/game/store";
import { AuthContext, useAuth, type Profile } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recovery, setRecovery] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  useEffect(() => {
    let active = true;
    let revision = 0;
    const sync = async (next: User | null) => {
      const current = ++revision;
      setUser(next);
      setProfile(null);
      setLoading(true);
      setError("");
      clearGame();
      try {
        if (next) {
          await loadGame(next.id);
          const { data, error: err } = await supabase
            .from("usuarios")
            .select("id,nome,tipo")
            .eq("id", next.id)
            .single();
          if (err) throw err;
          if (active && current === revision) setProfile(data as Profile);
        }
      } catch (err) {
        if (active && current === revision) {
          clearGame();
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível carregar seu progresso. Tente novamente.",
          );
        }
      } finally {
        if (active && current === revision) setLoading(false);
      }
    };
    // No awaited Supabase calls inside the auth event callback.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      if (event === "SIGNED_OUT") setRecovery(false);
      if (event !== "TOKEN_REFRESHED" && event !== "INITIAL_SESSION")
        window.setTimeout(() => {
          if (active) void sync(session?.user ?? null);
        }, 0);
    });
    supabase.auth.getSession().then(({ data, error: err }) => {
      if (active) {
        if (err) {
          setError(err.message);
          setLoading(false);
        } else void sync(data.session?.user ?? null);
      }
    });
    return () => {
      active = false;
      revision++;
      subscription.unsubscribe();
    };
  }, [retryCount]);
  return (
    <AuthContext.Provider
      value={{ user, profile, loading, error, recovery, retry: () => setRetryCount((c) => c + 1) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthGate({ children }: { children: ReactNode }) {
  const auth = useAuth();
  if (auth.loading)
    return (
      <p className="p-10 text-center" role="status">
        Carregando sua expedição…
      </p>
    );
  if (auth.error)
    return (
      <div className="p-10 text-center">
        <p role="alert">{auth.error}</p>
        <button className="btn-gold mt-4 rounded px-5 py-2" onClick={auth.retry}>
          Tentar novamente
        </button>
      </div>
    );
  if (!auth.user)
    return (
      <div className="p-10 text-center">
        <p>Entre na sua conta para continuar.</p>
        <a href="/login" className="btn-gold mt-4 inline-block rounded px-5 py-2">
          Entrar ou criar conta
        </a>
      </div>
    );
  return children;
}
