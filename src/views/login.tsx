"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

export default function Login() {
  const auth = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "update">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (auth.recovery) setMode("update");
  }, [auth.recovery]);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { nome: name.trim() },
            emailRedirectTo: window.location.origin + "/login",
          },
        });
        if (err) throw err;
        if (data.session) router.push("/piramides");
        else
          setMessage("Confira seu e-mail para confirmar o cadastro. Depois, entre com sua senha.");
      } else if (mode === "forgot") {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin + "/login",
        });
        if (err) throw err;
        setMessage(
          "Se houver uma conta com esse e-mail, você receberá um link para trocar a senha.",
        );
      } else if (mode === "update") {
        const { error: err } = await supabase.auth.updateUser({ password });
        if (err) throw err;
        setMessage("Senha atualizada. Você já pode continuar sua expedição.");
        setPassword("");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (err) throw err;
        router.push("/piramides");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Não foi possível entrar. Tente novamente.";
      setError(msg === "Invalid login credentials" ? "E-mail ou senha incorretos." : msg);
    } finally {
      setBusy(false);
    }
  };
  const change = (next: typeof mode) => {
    setMode(next);
    setError("");
    setMessage("");
    setPassword("");
  };
  const input =
    "w-full rounded border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring";
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Link href="/" className="mb-6 text-sm text-sand">
        ← Fuga da Pirâmide
      </Link>
      <h1 className="text-3xl text-gold-light">
        {mode === "signup"
          ? "Criar conta"
          : mode === "forgot"
            ? "Recuperar senha"
            : mode === "update"
              ? "Nova senha"
              : "Entrar na expedição"}
      </h1>
      <p className="mb-6 mt-3 text-muted-foreground">Seu progresso fica salvo na sua conta.</p>
      {auth.user && !auth.recovery && (
        <Link href="/piramides" className="mb-4 text-gold-light underline">
          Continuar com minha conta
        </Link>
      )}
      <form onSubmit={submit} className="space-y-4">
        {mode === "signup" && (
          <label className="block">
            Nome do explorador
            <input
              className={input}
              required
              maxLength={80}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        )}
        {mode !== "update" && (
          <label className="block">
            E-mail
            <input
              className={input}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        )}
        {mode !== "forgot" && (
          <label className="block">
            Senha
            <input
              className={input}
              type="password"
              required
              minLength={mode === "login" ? 1 : 8}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        )}
        {error && (
          <p role="alert" className="rounded bg-destructive/25 p-3">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="rounded bg-success/25 p-3">
            {message}
          </p>
        )}
        <button disabled={busy} className="btn-gold w-full rounded px-6 py-3 disabled:opacity-50">
          {busy
            ? "Aguarde…"
            : mode === "signup"
              ? "CRIAR CONTA"
              : mode === "forgot"
                ? "ENVIAR LINK"
                : mode === "update"
                  ? "SALVAR SENHA"
                  : "ENTRAR"}
        </button>
      </form>
      <div className="mt-5 flex flex-wrap gap-4 text-sm text-sand">
        {mode !== "login" && <button onClick={() => change("login")}>Já tenho conta</button>}
        {mode === "login" && (
          <>
            <button onClick={() => change("signup")}>Criar conta</button>
            <button onClick={() => change("forgot")}>Esqueci minha senha</button>
          </>
        )}
      </div>
      {mode === "signup" && (
        <p className="mt-6 text-sm text-muted-foreground">
          O cadastro cria uma conta de aluno. O acesso de professor é liberado pelo administrador.
        </p>
      )}
    </main>
  );
}
