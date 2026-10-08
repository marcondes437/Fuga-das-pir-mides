import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { GameState } from "@/game/store";

const game = vi.hoisted(() => ({ state: {} as GameState, attempt: vi.fn() }));
vi.mock("@/game/store", () => ({
  useGame: () => game.state,
  actions: { attempt: game.attempt, useHint: vi.fn() },
  roomStatus: () => "disponivel",
}));
vi.mock("@/components/GameHeader", () => ({ GameHeader: () => null }));
vi.mock("@/components/Solid3D", () => ({ Solid3D: () => null }));
import RoomPage from "@/views/sala.$pid.$sid";

function solve(id: string, answer: number) {
  game.state.records[id] = { attempts: 1, hints: 0, done: true, firstTry: true, answer };
}
beforeEach(() => {
  game.attempt.mockReset();
  game.state = {
    name: "Aluno",
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
});
describe("Room code release", () => {
  it("does not display a stored code while any challenge is unsolved", () => {
    game.state.rooms = ["iniciante/s1"];
    game.state.codes = { "iniciante/s1": "RA-17" };
    solve("iniciante-s1-d1", 64);
    render(<RoomPage pid="iniciante" sid="s1" />);
    expect(screen.queryByText("RA-17")).toBeNull();
    expect(screen.getByText(/Código da sala bloqueado/)).toBeTruthy();
  });
  it("starts a completed room at its last challenge and hides the code when reviewing the first", () => {
    solve("iniciante-s1-d1", 64);
    solve("iniciante-s1-d2", 30);
    solve("iniciante-s1-d3", 54);
    game.state.rooms = ["iniciante/s1"];
    game.state.codes = { "iniciante/s1": "RA-17" };
    render(<RoomPage pid="iniciante" sid="s1" />);
    expect(screen.getByText("RA-17")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /DESAFIO 1\/3/ }));
    expect(screen.queryByText("RA-17")).toBeNull();
  });
  it("does not release the code for an incorrect final answer", async () => {
    solve("iniciante-s1-d1", 64);
    solve("iniciante-s1-d2", 30);
    game.attempt.mockResolvedValue({ correct: false, roomDone: false });
    render(<RoomPage pid="iniciante" sid="s1" />);
    fireEvent.change(screen.getByPlaceholderText("Sua resposta"), { target: { value: "0" } });
    fireEvent.click(screen.getByRole("button", { name: "ATIVAR MECANISMO" }));
    await screen.findByText(/A pedra não se move/);
    expect(screen.queryByText("RA-17")).toBeNull();
  });
  it("reveals the code only when the server confirms the third correct answer", async () => {
    solve("iniciante-s1-d1", 64);
    solve("iniciante-s1-d2", 30);
    game.attempt.mockImplementation(async () => {
      solve("iniciante-s1-d3", 54);
      game.state.rooms = ["iniciante/s1"];
      game.state.codes = { "iniciante/s1": "RA-17" };
      return { correct: true, roomDone: true, gain: 70 };
    });
    render(<RoomPage pid="iniciante" sid="s1" />);
    expect(screen.queryByText("RA-17")).toBeNull();
    fireEvent.change(screen.getByPlaceholderText("Sua resposta"), { target: { value: "54" } });
    fireEvent.click(screen.getByRole("button", { name: "ATIVAR MECANISMO" }));
    await waitFor(() => expect(screen.getByText("RA-17")).toBeTruthy());
    expect(screen.getByText("CÓDIGO DESCOBERTO!")).toBeTruthy();
  });
});
