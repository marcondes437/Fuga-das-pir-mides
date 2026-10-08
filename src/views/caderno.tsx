"use client";

import { GameHeader } from "@/components/GameHeader";
import { PYRAMIDS } from "@/game/data";
import { useGame, actions, level } from "@/game/store";
import { useState } from "react";

export default function Notebook() {
  const s = useGame();
  const recs = Object.values(s.records);
  const lv = level(s.xp);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const reset = async () => {
    if (!confirm("Apagar todo o progresso?")) return;
    setBusy(true);
    setError("");
    try {
      await actions.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível reiniciar.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="min-h-screen">
      <GameHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-lg bg-parchment p-6 text-background sm:p-10">
          <h1 className="text-3xl">Caderno do Explorador</h1>
          <p className="mt-1 opacity-75">
            {s.name || "Explorador"} · Nível {lv.n} — {lv.title} · {s.xp} XP
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-sm sm:grid-cols-4">
            <Stat k="Acertos" v={recs.filter((r) => r.done).length} />
            <Stat k="Tentativas" v={recs.reduce((a, r) => a + r.attempts, 0)} />
            <Stat k="Dicas" v={recs.reduce((a, r) => a + r.hints, 0)} />
            <Stat k="1ª tentativa" v={recs.filter((r) => r.firstTry).length} />
          </div>
          {PYRAMIDS.map((p) => (
            <section key={p.id} className="mt-8">
              <h2 className="text-xl">{p.name}</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-5">
                {p.rooms.map((r) => {
                  const code = s.codes[`${p.id}/${r.id}`];
                  return (
                    <div key={r.id} className="rounded border border-stone/40 p-3">
                      <p className="text-xs opacity-70">{r.name}</p>
                      <p className="mt-1 font-mono text-lg">{code ?? "— — —"}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
          <section className="mt-8">
            <h2 className="text-xl">Conquistas e sequência</h2>
            <p className="mt-2">{s.streak} dia(s) consecutivo(s) de expedição.</p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {[
                ["Primeiro mecanismo", recs.some((r) => r.done)],
                ["Arqueólogo", s.rooms.length >= 5],
                ["Guardião das Pirâmides", s.pyramids.length === 3],
                ["Mira certeira", recs.filter((r) => r.firstTry).length >= 10],
              ].map(([label, done]) => (
                <li
                  key={String(label)}
                  className={`rounded border border-stone/40 p-3 ${done ? "" : "opacity-50"}`}
                >
                  {done ? "✓" : "○"} {label}
                </li>
              ))}
            </ul>
          </section>
          {error && (
            <p role="alert" className="mt-4">
              {error}
            </p>
          )}
          <button
            disabled={busy}
            onClick={() => void reset()}
            className="mt-10 text-xs underline opacity-60"
          >
            {busy ? "Reiniciando…" : "Reiniciar expedição"}
          </button>
        </div>
      </main>
    </div>
  );
}
function Stat({ k, v }: { k: string; v: number }) {
  return (
    <div className="rounded border border-stone/40 p-3">
      <p className="text-xs opacity-70">{k}</p>
      <p className="text-2xl">{v}</p>
    </div>
  );
}
