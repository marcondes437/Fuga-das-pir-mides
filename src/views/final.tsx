"use client";

import Link from "next/link";
import hero from "@/assets/hero-desert.jpg";
import { Dust } from "@/components/GameHeader";
import { useGame, level } from "@/game/store";

export default function Final() {
  const s = useGame();
  const recs = Object.values(s.records);
  const attempts = recs.reduce((a, r) => a + r.attempts, 0);
  const hits = recs.filter((r) => r.done).length;
  const mins =
    s.startedAt && s.finishedAt ? Math.round((s.finishedAt - s.startedAt) / 60000) : null;
  const lv = level(s.xp);
  if (s.pyramids.length < 3)
    return (
      <p className="p-10 text-center text-muted-foreground">
        A saída ainda está distante.{" "}
        <Link href="/piramides" className="text-gold-light underline">
          Continuar
        </Link>
      </p>
    );
  const stats: [string, string | number][] = [
    ["XP total", s.xp],
    ["Nível", `${lv.n} · ${lv.title}`],
    ["Tempo", mins !== null ? `${mins} min` : "—"],
    ["Acertos", hits],
    ["Erros", attempts - hits],
    ["Tentativas", attempts],
    ["Dicas", recs.reduce((a, r) => a + r.hints, 0)],
    ["Salas", `${s.rooms.length}/15`],
    ["Pirâmides", "3/3"],
  ];
  return (
    <main className="relative min-h-screen overflow-hidden">
      <img
        src={hero.src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-gold-light/30 via-background/70 to-background" />
      <Dust />
      <section className="relative z-10 mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="anim-reveal gold-text text-4xl sm:text-6xl">A SAÍDA</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-parchment">
          "Você decifrou os segredos das três pirâmides. Seu conhecimento transformou cada obstáculo
          em uma passagem. A aventura termina, mas sua jornada pela matemática continua."
        </p>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {stats.map(([k, v]) => (
            <div key={k} className="stone-panel rounded p-4">
              <p className="text-xs text-sand">{k}</p>
              <p className="mt-1 font-mono text-xl text-gold-light">{v}</p>
            </div>
          ))}
        </div>
        <Link href="/caderno" className="btn-gold mt-10 inline-block rounded px-8 py-3 text-sm">
          CONTINUAR APRENDENDO
        </Link>
      </section>
    </main>
  );
}
