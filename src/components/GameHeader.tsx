"use client";

import Link from "next/link";
import { useGame, level } from "@/game/store";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export function GameHeader() {
  const s = useGame();
  const lv = level(s.xp);
  const { profile } = useAuth();
  const [error, setError] = useState("");
  const logout = async () => {
    const { error: err } = await supabase.auth.signOut();
    if (err) setError("Não foi possível sair. Tente novamente.");
    else window.location.assign("/login");
  };
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-3 sm:flex-row">
        <Link href="/" className="font-display text-sm tracking-[0.2em] text-gold-light">
          FUGA DA PIRÂMIDE
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-3 text-sm">
          <Link href="/turmas" className="text-sand">
            {profile?.tipo === "professor" ? "Painel" : "Turmas"}
          </Link>
          <button onClick={() => void logout()} className="text-muted-foreground">
            Sair
          </button>
          {error && (
            <span role="alert" className="text-destructive">
              {error}
            </span>
          )}
          <Link href="/piramides" className="text-muted-foreground hover:text-gold-light">
            Pirâmides
          </Link>
          <Link href="/caderno" className="text-muted-foreground hover:text-gold-light">
            Caderno
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="font-mono text-xs text-sand">
              Nv {lv.n} · {lv.title}
            </span>
            <div className="h-1.5 w-24 overflow-hidden rounded bg-secondary">
              <div className="h-full bg-gold" style={{ width: `${lv.progress * 100}%` }} />
            </div>
          </div>
          <span className="rounded border border-border px-2 py-0.5 font-mono text-xs text-gold-light">
            {s.xp} XP
          </span>
        </nav>
      </div>
    </header>
  );
}

export function Dust() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="anim-dust absolute h-1 w-1 rounded-full bg-sand/60"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${40 + ((i * 53) % 60)}%`,
            animationDelay: `${(i * 0.7) % 6}s`,
          }}
        />
      ))}
    </div>
  );
}
