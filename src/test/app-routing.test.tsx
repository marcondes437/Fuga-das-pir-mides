import { describe, expect, it, vi } from "vitest";
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  useRouter: () => ({ push: vi.fn() }),
}));
import LandingPage from "@/app/page";
import LoginPage from "@/app/login/page";
import ClassroomsPage from "@/app/(game)/turmas/page";
import MapPage from "@/app/(game)/mapa/[pid]/page";
import RoomPage, { generateStaticParams, dynamicParams } from "@/app/(game)/sala/[pid]/[sid]/page";
import DoorPage from "@/app/(game)/porta/[pid]/page";

describe("Next.js pages", () => {
  it("allows only the fifteen rooms included in the game", () => {
    const rooms = generateStaticParams();
    expect(rooms).toHaveLength(15);
    expect(new Set(rooms.map((r) => `${r.pid}/${r.sid}`)).size).toBe(15);
    expect(dynamicParams).toBe(false);
  });
  it.each([LandingPage, LoginPage, ClassroomsPage])("renders an entry page", (Page) => {
    expect(Page().type).toBeTypeOf("function");
  });
  it("passes validated pyramid and room parameters to the game", async () => {
    const room = await RoomPage({ params: Promise.resolve({ pid: "iniciante", sid: "s1" }) });
    expect(room.props).toEqual({ pid: "iniciante", sid: "s1" });
    const map = await MapPage({ params: Promise.resolve({ pid: "iniciante" }) });
    expect(map.props.pid).toBe("iniciante");
  });
  it.each([MapPage, DoorPage])("returns not found for invalid pyramids", async (Page) => {
    await expect(Page({ params: Promise.resolve({ pid: "invalid" }) })).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
  });
  it("returns not found for an invalid room", async () => {
    await expect(
      RoomPage({ params: Promise.resolve({ pid: "iniciante", sid: "s99" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
