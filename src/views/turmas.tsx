"use client";

import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { GameHeader } from "@/components/GameHeader";

interface Student {
  id: string;
  nome: string;
  xp: number;
  acertos: number;
  salas: number;
  streak: number;
  updatedAt: string | null;
}
interface Classroom {
  id: string;
  nome: string;
  codigo: string | null;
  alunos: Student[];
}
export default function Classrooms() {
  const { user, profile } = useAuth();
  const teacher = profile?.tipo === "professor";
  const client = useQueryClient();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const key = ["turmas", user?.id];
  const query = useQuery({
    queryKey: key,
    enabled: !!user,
    refetchInterval: 30000,
    queryFn: async () => {
      const { data, error: err } = await supabase.rpc("classroom_action", { p_action: "list" });
      if (err) throw err;
      return data as Classroom[];
    },
  });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const { data, error: err } = await supabase.rpc("classroom_action", {
        p_action: teacher ? "create" : "join",
        p_value: value.trim(),
      });
      if (err) throw err;
      client.setQueryData(key, data);
      setValue("");
      setMessage(
        teacher ? "Turma criada. Compartilhe o código com seus alunos." : "Você entrou na turma.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar. Tente novamente.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="min-h-screen">
      <GameHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl text-gold-light">
          {teacher ? "Painel do professor" : "Minhas turmas"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {teacher
            ? "Crie turmas e acompanhe o progresso de seus alunos."
            : "Entre com o código compartilhado pelo seu professor."}
        </p>
        <form onSubmit={submit} className="my-6 flex max-w-xl flex-wrap gap-3">
          <label className="flex-1">
            {teacher ? "Nome da turma" : "Código da turma"}
            <input
              required
              maxLength={teacher ? 100 : 12}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1 w-full rounded border border-input bg-background px-4 py-3"
            />
          </label>
          <button
            disabled={busy || !value.trim()}
            className="btn-gold self-end rounded px-5 py-3 disabled:opacity-50"
          >
            {busy ? "Salvando…" : teacher ? "CRIAR TURMA" : "ENTRAR NA TURMA"}
          </button>
        </form>
        {error && (
          <p role="alert" className="mb-4 text-destructive">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="mb-4 text-sand">
            {message}
          </p>
        )}
        {query.isPending && <p role="status">Carregando turmas…</p>}
        {query.isError && (
          <div role="alert">
            <p>Não foi possível carregar as turmas.</p>
            <button className="mt-2 underline" onClick={() => void query.refetch()}>
              Tentar novamente
            </button>
          </div>
        )}
        {query.data?.length === 0 && (
          <p className="text-muted-foreground">
            {teacher ? "Você ainda não criou uma turma." : "Você ainda não participa de uma turma."}
          </p>
        )}
        <div className="space-y-6">
          {query.data?.map((t) => (
            <section key={t.id} className="stone-panel rounded-lg p-5">
              <h2 className="text-xl text-gold-light">{t.nome}</h2>
              {teacher && (
                <p className="mt-2 text-sand">
                  Código de entrada: <strong className="select-all font-mono">{t.codigo}</strong>
                </p>
              )}
              {t.alunos.length === 0 ? (
                <p className="mt-4 text-muted-foreground">Aguardando os primeiros alunos.</p>
              ) : (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <caption className="mb-3 text-left text-sand">
                      {teacher ? "Ranking da turma por XP" : "Seu progresso nesta turma"}
                    </caption>
                    <thead>
                      <tr className="border-b border-border">
                        {[
                          "Explorador",
                          "XP",
                          "Acertos",
                          "Salas",
                          "Sequência",
                          "Última atividade",
                        ].map((h) => (
                          <th key={h} className="p-2">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {t.alunos.map((a, i) => (
                        <tr key={a.id} className="border-b border-border">
                          <td className="p-2">
                            {teacher ? `${i + 1}. ` : ""}
                            {a.nome}
                          </td>
                          <td className="p-2">{a.xp}</td>
                          <td className="p-2">{a.acertos}/45</td>
                          <td className="p-2">{a.salas}/15</td>
                          <td className="p-2">{a.streak} dia(s)</td>
                          <td className="p-2">
                            {a.updatedAt
                              ? new Date(a.updatedAt).toLocaleString("pt-BR", {
                                  timeZone: "America/Sao_Paulo",
                                })
                              : "Ainda não jogou"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
