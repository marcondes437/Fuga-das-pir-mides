import { useSyncExternalStore } from "react";
import { PYRAMIDS, type Pyramid } from "./data";
import { supabase } from "@/lib/supabase";

export interface ChallengeRecord {
  attempts: number;
  hints: number;
  done: boolean;
  firstTry: boolean;
  answer?: number;
  explanation?: string;
  revealedHints?: string[];
}
export interface GameState {
  name: string;
  xp: number;
  records: Record<string, ChallengeRecord>;
  rooms: string[]; // "pid/sid" completed
  codes: Record<string, string>;
  pyramids: string[]; // completed pyramid ids
  startedAt: number | null;
  finishedAt: number | null;
  streak: number;
  lastPlayed: string | null;
}

const empty: GameState = {
  name: "",
  xp: 0,
  records: {},
  rooms: [],
  codes: {},
  pyramids: [],
  startedAt: null,
  finishedAt: null,
  streak: 0,
  lastPlayed: null,
};
let state: GameState = empty;
let owner: string | null = null;
let generation = 0;
const subs = new Set<() => void>();

function publish(next: GameState) {
  state = next;
  subs.forEach((f) => f());
}

export function clearGame() {
  owner = null;
  generation++;
  publish(empty);
}
interface GameResult {
  state: GameState;
  correct?: boolean;
  gain?: number;
  roomDone?: boolean;
  wrong?: boolean[] | null;
}
export async function loadGame(userId: string) {
  const current = ++generation;
  const { data, error } = await supabase.rpc("game_action", { p_action: "load" });
  if (error) throw error;
  if (current === generation) {
    owner = userId;
    publish((data as GameResult).state);
  }
}
async function play(action: string, id = "", answer = "") {
  if (!owner) throw new Error("Entre na sua conta para jogar.");
  const current = generation;
  const { data, error } = await supabase.rpc("game_action", {
    p_action: action,
    p_id: id,
    p_answer: answer,
  });
  if (error) throw new Error(error.message);
  if (current !== generation) throw new Error("Sua sessão mudou. Entre novamente.");
  const result = data as GameResult;
  publish(result.state);
  return result;
}

export function useGame() {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => state,
    () => empty,
  );
}

export const actions = {
  useHint: (id: string) => play("hint", id),
  attempt: (id: string, answer: string) => play("answer", id, answer),
  completePyramid: (pid: string, codes: string[]) => play("door", pid, JSON.stringify(codes)),
  reset: () => play("reset"),
};

export type PyramidStatus = "bloqueada" | "disponivel" | "andamento" | "concluida";
export function pyramidStatus(s: GameState, p: Pyramid): PyramidStatus {
  if (s.pyramids.includes(p.id)) return "concluida";
  const idx = PYRAMIDS.indexOf(p);
  if (idx > 0 && !s.pyramids.includes(PYRAMIDS[idx - 1]!.id)) return "bloqueada";
  return p.rooms.some((r) => r.challenges.some((c) => s.records[c.id]?.attempts))
    ? "andamento"
    : "disponivel";
}
export function roomStatus(s: GameState, p: Pyramid, i: number): PyramidStatus {
  const r = p.rooms[i]!;
  if (s.rooms.includes(`${p.id}/${r.id}`)) return "concluida";
  if (pyramidStatus(s, p) === "bloqueada") return "bloqueada";
  if (i > 0 && !s.rooms.includes(`${p.id}/${p.rooms[i - 1]!.id}`)) return "bloqueada";
  return r.challenges.some((c) => s.records[c.id]?.attempts) ? "andamento" : "disponivel";
}
export function level(xp: number) {
  const titles = [
    "Aprendiz",
    "Explorador",
    "Escriba",
    "Arqueólogo",
    "Sacerdote da Geometria",
    "Guardião das Pirâmides",
  ];
  const n = Math.min(titles.length - 1, Math.floor(xp / 300));
  return { n: n + 1, title: titles[n], next: (n + 1) * 300, progress: (xp % 300) / 300 };
}
