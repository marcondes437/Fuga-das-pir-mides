"use client";

import Link from "next/link";
import { lazy, Suspense, useEffect, useState } from "react";
import { GameHeader } from "@/components/GameHeader";
import { getPyramid } from "@/game/data";
import { useGame, actions, roomStatus } from "@/game/store";

const Solid3D = lazy(() => import("@/components/Solid3D").then((m) => ({ default: m.Solid3D })));

export default function RoomPage({ pid, sid }: { pid: string; sid: string }) {
  const p = getPyramid(pid)!;
  const idx = p.rooms.findIndex((r) => r.id === sid);
  const room = p.rooms[idx]!;
  const s = useGame();
  const roomKey = `${pid}/${sid}`;
  const solvedCount = room.challenges.filter((c) => s.records[c.id]?.done).length;
  const allSolved = room.challenges.every((c) => s.records[c.id]?.done === true);
  const roomDone = s.rooms.includes(roomKey) && allSolved;
  const current = room.challenges.findIndex((c) => !s.records[c.id]?.done);
  const [view, setView] = useState(current === -1 ? room.challenges.length - 1 : current);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<null | { ok: boolean; msg: string }>(null);
  const [revealing, setRevealing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAnswer("");
    setFeedback(null);
  }, [view]);

  if (roomStatus(s, p, idx) === "bloqueada")
    return (
      <div>
        <GameHeader />
        <p className="p-10 text-center text-muted-foreground">
          Esta câmara está selada.{" "}
          <Link href={`/mapa/${pid}`} className="text-gold-light underline">
            Voltar ao mapa
          </Link>
        </p>
      </div>
    );

  const c = room.challenges[view]!;
  const rec = s.records[c.id];
  const solved = !!rec?.done;
  const roomCode =
    roomDone && solved && view === room.challenges.length - 1 ? s.codes[roomKey] : undefined;

  const submit = async () => {
    if (solved || busy || !answer.trim()) return;
    setBusy(true);
    setError("");
    try {
      const result = await actions.attempt(c.id, answer);
      setFeedback(
        result.correct
          ? { ok: true, msg: `Mecanismo ativado! +${result.gain ?? 0} XP` }
          : { ok: false, msg: "A pedra não se move. Revise o cálculo — uma dica pode ajudar." },
      );
      if (result.roomDone) setRevealing(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar. Tente novamente.");
    } finally {
      setBusy(false);
    }
  };
  const hint = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await actions.useHint(c.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível pedir a dica.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <GameHeader />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Link href={`/mapa/${pid}`} className="text-sm text-muted-foreground hover:text-gold-light">
          ← Mapa da {p.name}
        </Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-sand">
              SALA 0{idx + 1} · {room.topic.toUpperCase()}
            </p>
            <h1 className="text-3xl text-gold-light">{room.name}</h1>
          </div>
          <div className="flex gap-2">
            {room.challenges.map((x, i) => {
              const d = s.records[x.id]?.done;
              const avail = d || i <= (current === -1 ? 2 : current);
              return (
                <button
                  key={x.id}
                  disabled={!avail || busy}
                  onClick={() => setView(i)}
                  className={`rounded border px-3 py-1.5 font-mono text-xs ${i === view ? "border-gold-light text-gold-light" : "border-border text-muted-foreground"} ${d ? "bg-success/30" : ""} disabled:opacity-40`}
                >
                  DESAFIO {i + 1}/3 {d ? "✓" : !avail ? "🔒" : ""}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="stone-panel h-[340px] overflow-hidden rounded-lg sm:h-[460px]">
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Acendendo as tochas…
                </div>
              }
            >
              <Solid3D key={c.id} shape={c.shape} />
            </Suspense>
          </div>

          <section className="stone-panel rounded-lg p-6">
            <p className="font-mono text-xs text-sand">
              {c.topic} · {c.xp} XP
            </p>
            <h2 className="mt-1 text-xl text-gold-light">{c.title}</h2>
            <p className="mt-3 italic text-parchment/80">{c.story}</p>
            <p className="mt-4 text-lg leading-relaxed text-foreground">{c.prompt}</p>

            {c.type === "choice" ? (
              <div className="mt-5 grid gap-2">
                {c.options!.map((o, i) => (
                  <button
                    key={o}
                    disabled={solved || busy}
                    onClick={() => setAnswer(String(i))}
                    className={`rounded border px-4 py-2.5 text-left text-sm ${answer === String(i) || (solved && i === rec?.answer) ? "border-gold-light bg-gold/15 text-gold-light" : "border-border hover:border-gold"}`}
                  >
                    {String.fromCharCode(65 + i)}) {o}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-5 flex items-center gap-2">
                <input
                  inputMode="decimal"
                  disabled={solved || busy}
                  value={solved ? String(rec?.answer ?? "").replace(".", ",") : answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Sua resposta"
                  className="w-full rounded border border-input bg-background px-4 py-3 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <span className="min-w-12 font-mono text-sand">{c.unit}</span>
              </div>
            )}

            {!solved && (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => void submit()}
                  disabled={busy || !answer.trim()}
                  className="btn-gold rounded px-6 py-2.5 text-sm"
                >
                  {busy ? "SALVANDO…" : "ATIVAR MECANISMO"}
                </button>
                <button
                  onClick={() => void hint()}
                  disabled={busy || (rec?.hints ?? 0) >= 2}
                  className="rounded border border-border px-4 py-2.5 text-sm text-sand hover:border-gold disabled:opacity-40"
                >
                  Pedir dica ({2 - (rec?.hints ?? 0)})
                </button>
              </div>
            )}

            {(rec?.hints ?? 0) > 0 && (
              <ul className="mt-4 space-y-2">
                {rec?.revealedHints?.map((h, i) => (
                  <li
                    key={i}
                    className="rounded border-l-2 border-gold bg-background/50 px-3 py-2 text-sm text-parchment"
                  >
                    📜 Dica {i + 1}: {h}
                  </li>
                ))}
              </ul>
            )}

            {error && (
              <p role="alert" className="mt-4 rounded bg-destructive/25 px-3 py-2 text-sm">
                {error}
              </p>
            )}
            {feedback && !solved && !feedback.ok && (
              <p className="mt-4 rounded bg-destructive/25 px-3 py-2 text-sm">{feedback.msg}</p>
            )}
            {solved && (
              <div className="mt-4 rounded bg-success/25 px-3 py-3 text-sm">
                <p className="font-semibold">
                  {feedback?.ok ? feedback.msg : "Desafio resolvido."}
                </p>
                <p className="mt-1 font-mono text-parchment/90">{rec?.explanation}</p>
                {view < 2 && (
                  <button
                    onClick={() => setView(view + 1)}
                    className="btn-gold mt-3 rounded px-4 py-2 text-xs"
                  >
                    PRÓXIMO DESAFIO →
                  </button>
                )}
              </div>
            )}
            {!roomDone && (
              <p className="mt-4 rounded border border-border px-3 py-2 text-sm text-sand">
                Código da sala bloqueado. Acerte os {room.challenges.length} desafios para liberá-lo
                ({solvedCount}/{room.challenges.length}).
              </p>
            )}
            {roomCode && !revealing && (
              <div className="mt-4 flex items-center justify-between rounded border border-gold px-3 py-2 text-sm">
                <span>
                  Código da sala: <span className="font-mono text-gold-light">{roomCode}</span>
                </span>
                <Link href={`/mapa/${pid}`} className="text-gold-light underline">
                  Voltar ao mapa
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>

      {revealing && roomCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-6">
          <div className="stone-panel relative w-full max-w-md overflow-hidden rounded-lg p-10 text-center">
            <div className="anim-slab absolute inset-0 z-10 flex items-center justify-center bg-secondary">
              <span className="font-display text-4xl text-gold/50">𓂀</span>
            </div>
            <p className="font-display text-sm tracking-[0.3em] text-sand">
              SALA CONCLUÍDA · +50 XP
            </p>
            <h2 className="mt-2 text-2xl text-gold-light">CÓDIGO DESCOBERTO!</h2>
            <p className="anim-reveal glow-gold mt-6 rounded border border-gold-light py-4 font-mono text-3xl text-gold-light">
              {roomCode}
            </p>
            <p className="mt-5 text-sm text-parchment">
              Guarde este código. Você precisará dele para abrir a porta final.
            </p>
            <Link
              href={`/mapa/${pid}`}
              className="btn-gold mt-6 inline-block rounded px-6 py-2.5 text-sm"
            >
              VOLTAR AO MAPA
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
