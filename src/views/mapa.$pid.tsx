"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GameHeader } from "@/components/GameHeader";
import { getPyramid } from "@/game/data";
import { useGame, roomStatus, pyramidStatus } from "@/game/store";

// room positions in a 400x300 cross-section
const POS = [
  { x: 95, y: 250 },
  { x: 305, y: 250 },
  { x: 140, y: 175 },
  { x: 260, y: 140 },
  { x: 200, y: 85 },
];

export default function MapPage({ pid }: { pid: string }) {
  const p = getPyramid(pid)!;
  const s = useGame();
  const router = useRouter();
  const done = p.rooms.every((r) => s.rooms.includes(`${p.id}/${r.id}`));
  if (pyramidStatus(s, p) === "bloqueada")
    return (
      <div>
        <GameHeader />
        <p className="p-10 text-center text-muted-foreground">
          Esta pirâmide ainda está selada.{" "}
          <Link href="/piramides" className="text-gold-light underline">
            Voltar
          </Link>
        </p>
      </div>
    );

  return (
    <div className="min-h-screen">
      <GameHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Link href="/piramides" className="text-sm text-muted-foreground hover:text-gold-light">
          ← Pirâmides
        </Link>
        <h1 className="mt-2 text-3xl text-gold-light">{p.name}</h1>
        <p className="text-muted-foreground">
          Corte transversal · toque em uma câmara iluminada para entrar.
        </p>
        <div className="stone-panel mt-6 rounded-lg p-3">
          <svg viewBox="0 0 400 320" className="w-full">
            <defs>
              <pattern id="bricks" width="20" height="10" patternUnits="userSpaceOnUse">
                <rect width="20" height="10" className="fill-secondary" />
                <path
                  d="M0 10H20M10 0V5M0 5H20M0 0V5"
                  className="stroke-background/40"
                  strokeWidth="0.6"
                />
              </pattern>
            </defs>
            <polygon
              points="200,15 15,300 385,300"
              fill="url(#bricks)"
              className="stroke-gold"
              strokeWidth="2"
            />
            {/* corridors */}
            <path
              d="M200 300 V275 M95 250 H305 M95 250 L140 175 M140 175 L260 140 M260 140 L200 85"
              className="stroke-background"
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M95 250 H305 M95 250 L140 175 M140 175 L260 140 M260 140 L200 85"
              className="stroke-gold/30"
              strokeWidth="1"
              strokeDasharray="3 3"
              fill="none"
            />
            {/* final door */}
            <g
              onClick={() => done && router.push(`/porta/${pid}`)}
              className={done ? "cursor-pointer" : ""}
            >
              <rect
                x="180"
                y="278"
                width="40"
                height="22"
                rx="2"
                className={done ? "fill-gold anim-torch" : "fill-background stroke-gold/40"}
              />
              <text
                x="200"
                y="293"
                textAnchor="middle"
                className={`font-mono text-[8px] ${done ? "fill-background" : "fill-muted-foreground"}`}
              >
                {done ? "PORTA" : "🔒"}
              </text>
            </g>
            {p.rooms.map((r, i) => {
              const st = roomStatus(s, p, i);
              const open = st !== "bloqueada";
              return (
                <g
                  key={r.id}
                  onClick={() => open && router.push(`/sala/${pid}/${r.id}`)}
                  className={open ? "cursor-pointer" : ""}
                >
                  <rect
                    x={POS[i]!.x - 34}
                    y={POS[i]!.y - 16}
                    width="68"
                    height="32"
                    rx="3"
                    className={
                      st === "concluida"
                        ? "fill-success stroke-gold-light"
                        : st === "bloqueada"
                          ? "fill-background stroke-gold/30"
                          : "fill-card stroke-gold-light"
                    }
                    strokeWidth={open ? 1.6 : 1}
                  />
                  {st === "andamento" && (
                    <rect
                      x={POS[i]!.x - 34}
                      y={POS[i]!.y - 16}
                      width="68"
                      height="32"
                      rx="3"
                      className="fill-none stroke-gold-light anim-torch"
                      strokeWidth="3"
                    />
                  )}
                  <text
                    x={POS[i]!.x}
                    y={POS[i]!.y - 2}
                    textAnchor="middle"
                    className="fill-parchment font-mono text-[7px]"
                  >
                    SALA 0{i + 1}
                  </text>
                  <text
                    x={POS[i]!.x}
                    y={POS[i]!.y + 9}
                    textAnchor="middle"
                    className={`text-[8px] ${open ? "fill-gold-light" : "fill-muted-foreground"}`}
                  >
                    {st === "concluida"
                      ? "✓ concluída"
                      : st === "bloqueada"
                        ? "🔒"
                        : r.topic.split(" ")[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <ol className="mt-6 grid gap-2 sm:grid-cols-5">
          {p.rooms.map((r, i) => (
            <li key={r.id} className="rounded border border-border p-3 text-xs">
              <p className="font-mono text-sand">0{i + 1}</p>
              <p className="text-parchment">{r.name}</p>
              <p className="text-muted-foreground">{r.topic}</p>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
