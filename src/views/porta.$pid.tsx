"use client";

import Link from "next/link";
import { useState } from "react";
import { GameHeader } from "@/components/GameHeader";
import { getPyramid, PYRAMIDS } from "@/game/data";
import { useGame, actions } from "@/game/store";

export default function DoorPage({ pid }: { pid: string }) {
  const p = getPyramid(pid)!;
  const s = useGame();
  const [codes, setCodes] = useState(["", "", "", "", ""]);
  const [wrong, setWrong] = useState<boolean[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const opened = s.pyramids.includes(pid);
  const ready = p.rooms.every((r) => s.rooms.includes(`${pid}/${r.id}`));
  const next = PYRAMIDS[PYRAMIDS.indexOf(p) + 1];

  const tryOpen = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await actions.completePyramid(pid, codes);
      setWrong(result.wrong ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível abrir a porta.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <GameHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 text-center">
        <Link href={`/mapa/${pid}`} className="text-sm text-muted-foreground hover:text-gold-light">
          ← Mapa
        </Link>
        <h1 className="mt-2 text-3xl text-gold-light">A Grande Porta</h1>
        <p className="text-muted-foreground">{p.name}</p>
        {!ready ? (
          <p className="mt-10 text-parchment">
            A porta permanece selada. Conclua as cinco salas primeiro.
          </p>
        ) : (
          <div className="stone-panel relative mt-8 overflow-hidden rounded-t-[50%_20%] p-8 pt-16">
            <div
              className={`transition-all duration-[1600ms] ${opened ? "translate-y-[-30%] opacity-0" : ""}`}
            >
              <div className="grid gap-3 sm:grid-cols-5">
                {p.rooms.map((r, i) => (
                  <label key={r.id} className="flex flex-col items-center gap-2">
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-full border-2 font-display text-lg ${wrong?.[i] ? "border-destructive text-destructive" : wrong ? "border-success text-success" : "border-gold text-gold-light"}`}
                    >
                      {i + 1}
                    </span>
                    <input
                      value={codes[i]}
                      maxLength={8}
                      onChange={(e) =>
                        setCodes(codes.map((c, j) => (j === i ? e.target.value : c)))
                      }
                      placeholder="···"
                      className="w-full rounded border border-input bg-background px-2 py-2 text-center font-mono uppercase focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <span className="text-[10px] text-muted-foreground">{r.name}</span>
                  </label>
                ))}
              </div>
              {wrong && (
                <p className="mt-5 rounded bg-destructive/25 px-3 py-2 text-sm">
                  Os mecanismos marcados em vermelho não reconheceram o código. Consulte seu Caderno
                  do Explorador.
                </p>
              )}
              {error && (
                <p role="alert" className="mt-4 text-destructive">
                  {error}
                </p>
              )}
              <button
                onClick={() => void tryOpen()}
                disabled={busy || codes.some((c) => !c.trim())}
                className="btn-gold mt-6 rounded px-8 py-3 text-sm"
              >
                {busy ? "SALVANDO…" : "GIRAR OS MECANISMOS"}
              </button>
            </div>
            {opened && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gold-light/40 to-background p-6">
                <h2 className="anim-reveal text-3xl text-gold-light">A PORTA SE ABRE</h2>
                <p className="mt-3 text-parchment">+150 XP · {p.name} concluída</p>
                {next ? (
                  <Link
                    href={`/mapa/${next.id}`}
                    className="btn-gold mt-6 rounded px-6 py-2.5 text-sm"
                  >
                    SEGUIR PARA {next.name.toUpperCase()}
                  </Link>
                ) : (
                  <Link href="/final" className="btn-gold mt-6 rounded px-6 py-2.5 text-sm">
                    ENCONTRAR A SAÍDA
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
