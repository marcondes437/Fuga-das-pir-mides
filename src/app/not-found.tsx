import Link from "next/link";
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl text-gold-light">Página não encontrada</h1>
      <p>Esta passagem não existe na pirâmide.</p>
      <Link href="/" className="btn-gold rounded px-6 py-3">
        Voltar ao início
      </Link>
    </main>
  );
}
