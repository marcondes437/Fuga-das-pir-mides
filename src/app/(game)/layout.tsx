"use client";
import type { ReactNode } from "react";
import { AuthGate } from "@/lib/auth";
export default function GameLayout({ children }: { children: ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
