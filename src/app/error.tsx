"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl text-gold-light">Não foi possível abrir esta passagem</h1>
      <button onClick={reset} className="btn-gold rounded px-6 py-3">
        Tentar novamente
      </button>
      <Link href="/">Voltar ao início</Link>
    </main>
  );
}
