import { beforeEach, describe, expect, it, vi } from "vitest";

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/lib/supabase", () => ({ supabase: { rpc } }));
import { actions, clearGame, loadGame } from "@/game/store";
const state = {
  name: "Aluno",
  xp: 20,
  records: {},
  rooms: [],
  codes: {},
  pyramids: [],
  startedAt: 1,
  finishedAt: null,
  streak: 1,
  lastPlayed: "2026-10-08",
};
beforeEach(() => {
  rpc.mockReset();
  clearGame();
});
describe("Game backend", () => {
  it("requires an account before sending game actions", async () => {
    await expect(actions.attempt("iniciante-s1-d1", "64")).rejects.toThrow("Entre na sua conta");
    expect(rpc).not.toHaveBeenCalled();
  });
  it("sends the raw answer and accepts the server reward", async () => {
    rpc.mockResolvedValueOnce({ data: { state }, error: null });
    await loadGame("aluno");
    rpc.mockResolvedValueOnce({ data: { state, correct: true, gain: 20 }, error: null });
    const result = await actions.attempt("iniciante-s1-d1", "64,00");
    expect(rpc).toHaveBeenLastCalledWith("game_action", {
      p_action: "answer",
      p_id: "iniciante-s1-d1",
      p_answer: "64,00",
    });
    expect(result.gain).toBe(20);
  });
  it("reports save failures instead of treating an answer as saved", async () => {
    rpc.mockResolvedValueOnce({ data: { state }, error: null });
    await loadGame("aluno");
    rpc.mockResolvedValueOnce({ data: null, error: { message: "Conexão indisponível" } });
    await expect(actions.attempt("iniciante-s1-d1", "64")).rejects.toThrow("Conexão indisponível");
  });
  it("discards an old account's answer response after logout", async () => {
    rpc.mockResolvedValueOnce({ data: { state }, error: null });
    await loadGame("aluno");
    let finish!: (value: unknown) => void;
    rpc.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const pending = actions.attempt("iniciante-s1-d1", "64");
    clearGame();
    finish({ data: { state }, error: null });
    await expect(pending).rejects.toThrow("Sua sessão mudou");
  });
  it("sends all five door codes for validation on the server", async () => {
    rpc.mockResolvedValueOnce({ data: { state }, error: null });
    await loadGame("aluno");
    rpc.mockResolvedValueOnce({
      data: { state, wrong: [true, false, false, false, false] },
      error: null,
    });
    const codes = ["wrong", "two", "three", "four", "five"];
    expect((await actions.completePyramid("iniciante", codes)).wrong?.[0]).toBe(true);
    expect(rpc).toHaveBeenLastCalledWith("game_action", {
      p_action: "door",
      p_id: "iniciante",
      p_answer: JSON.stringify(codes),
    });
  });
});
