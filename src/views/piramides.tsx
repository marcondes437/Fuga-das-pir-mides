"use client";

import Link from "next/link";
import { GameHeader, Dust } from "@/components/GameHeader";
import { PYRAMIDS } from "@/game/data";
import { useGame, pyramidStatus } from "@/game/store";

const SKY = [
  "from-sand/50 via-gold/20 to-transparent",
  "from-destructive/40 via-secondary/40 to-transparent",
  "from-stone via-background to-transparent",
];
const LABEL = {
  bloqueada: "BLOQUEADA",
  disponivel: "DISPONÍVEL",
  andamento: "EM ANDAMENTO",
  concluida: "CONCLUÍDA",
};

export default function Page() {
  const s = useGame();
  return (
    <div className="min-h-screen">
      <GameHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-center text-3xl text-gold-light sm:text-4xl">Escolha sua pirâmide</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Cada pirâmide se abre apenas quando a anterior é vencida.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PYRAMIDS.map((p, i) => {
            const st = pyramidStatus(s, p);
            const rooms = p.rooms.filter((r) => s.rooms.includes(`${p.id}/${r.id}`)).length;
            const ch = p.rooms
              .flatMap((r) => r.challenges)
              .filter((c) => s.records[c.id]?.done).length;
            const locked = st === "bloqueada";
            return (
              <article
                key={p.id}
                className={`stone-panel relative overflow-hidden rounded-lg ${locked ? "opacity-60" : ""}`}
              >
                <div className={`relative h-48 bg-gradient-to-b ${SKY[i]}`}>
                  <Dust />
                  <svg viewBox="0 0 200 120" className="absolute bottom-0 h-full w-full">
                    <polygon
                      points={`100,${40 - i * 15} ${30 - i * 10},120 ${170 + i * 10},120`}
                      className="fill-gold/70"
                    />
                    <polygon
                      points={`100,${40 - i * 15} ${170 + i * 10},120 130,120`}
                      className="fill-secondary/80"
                    />
                  </svg>
                  <span
                    className={`absolute right-3 top-3 rounded px-2 py-0.5 font-mono text-[10px] tracking-widest ${st === "concluida" ? "bg-success text-foreground" : "bg-background/80 text-gold-light"}`}
                  >
                    {LABEL[st]}
                  </span>
                </div>
                <div className="p-5">
                  <p className="font-mono text-xs text-sand">
                    PIRÂMIDE {i + 1} · {p.level.toUpperCase()}
                  </p>
                  <h2 className="mt-1 text-xl text-gold-light">{p.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded bg-secondary">
                    <div className="h-full bg-gold" style={{ width: `${(ch / 15) * 100}%` }} />
                  </div>
                  <p className="mt-2 font-mono text-xs text-sand">
                    Salas {rooms}/5 · Desafios {ch}/15
                  </p>
                  {locked ? (
                    <div className="mt-5 rounded border border-border py-2.5 text-center text-sm text-muted-foreground">
                      🔒 Vença a pirâmide anterior
                    </div>
                  ) : (
                    <Link
                      href={`/mapa/${p.id}`}
                      className="btn-gold mt-5 block rounded py-2.5 text-center text-sm"
                    >
                      ENTRAR
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        {s.pyramids.length === 3 && (
          <div className="mt-10 text-center">
            <Link href="/final" className="btn-gold rounded px-6 py-3 text-sm">
              VER A SAÍDA
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
