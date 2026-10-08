"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Box, Compass, GraduationCap, KeyRound, Trophy } from "lucide-react";
import hero from "@/assets/hero-desert.jpg";
import { Dust } from "@/components/GameHeader";
import { PYRAMIDS } from "@/game/data";
import { useGame } from "@/game/store";
import { useAuth } from "@/lib/auth-context";
import { PyramidPreview } from "@/components/PyramidPreview";

const steps = [
  {
    title: "Escolha sua pirâmide",
    text: "Comece pelos primeiros enigmas. Cada pirâmide conquistada abre o caminho para a próxima.",
    icon: Compass,
  },
  {
    title: "Decifre os mecanismos",
    text: "Explore o sólido em 3D, leia o desafio e use a geometria para encontrar a resposta. Duas dicas podem ajudar.",
    icon: Box,
  },
  {
    title: "Encontre a saída",
    text: "Conclua as salas, anote os códigos no seu Caderno do Explorador e abra a grande porta da pirâmide.",
    icon: KeyRound,
  },
];
const topics = [
  "Cubos e paralelepípedos",
  "Prismas e pirâmides",
  "Cilindros e cones",
  "Esferas e semiesferas",
  "Áreas e volumes",
  "Pitágoras e unidades",
];
const questions = [
  {
    question: "O que é Fuga da Pirâmide?",
    answer:
      "É um jogo educacional de geometria espacial em formato de escape room. Você assume o papel de um explorador e resolve desafios matemáticos para atravessar três pirâmides e encontrar a saída.",
  },
  {
    question: "Preciso acertar tudo de primeira?",
    answer:
      "Não. Você pode tentar novamente e pedir até duas dicas por desafio. Acertar na primeira tentativa rende um bônus de 10 XP. O importante é entender o raciocínio e continuar a expedição.",
  },
  {
    question: "Posso continuar em outro momento?",
    answer:
      "Sim. Entre com seu e-mail e senha para salvar o progresso na sua conta. Você pode voltar depois ou continuar em outro dispositivo usando a mesma conta.",
  },
  {
    question: "Como funciona o acesso para professores?",
    answer:
      "Professores com o perfil liberado podem criar turmas, compartilhar um código de entrada e acompanhar o desempenho dos alunos. O cadastro começa com um perfil de aluno; solicite a liberação ao responsável pelo jogo.",
  },
];

export default function Landing() {
  const s = useGame();
  const auth = useAuth();
  const signedIn = !!auth.user && !!s.name && !auth.loading;
  const playHref = signedIn ? "/piramides" : "/login";
  const rooms = PYRAMIDS.reduce((total, p) => total + p.rooms.length, 0);
  const challenges = PYRAMIDS.reduce(
    (total, p) => total + p.rooms.reduce((n, r) => n + r.challenges.length, 0),
    0,
  );

  return (
    <div className="overflow-x-clip bg-background">
      <a
        href="#conteudo"
        className="sr-only z-50 rounded bg-parchment p-3 text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <header className="relative z-30 border-b border-gold/20 bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link
            href="/"
            aria-label="Fuga da Pirâmide — início"
            className="flex items-center gap-3 text-gold-light"
          >
            <Compass aria-hidden="true" className="h-8 w-8 shrink-0" strokeWidth={1.3} />
            <span className="font-display text-xs font-bold tracking-[0.14em] sm:text-sm">
              FUGA DA
              <br />
              PIRÂMIDE
            </span>
          </Link>
          <nav aria-label="Navegação principal" className="flex items-center gap-6 text-sm">
            <a
              href="#sobre"
              className="hidden text-parchment transition-colors hover:text-gold-light md:block"
            >
              A aventura
            </a>
            <a
              href="#como-jogar"
              className="hidden text-parchment transition-colors hover:text-gold-light md:block"
            >
              Como jogar
            </a>
            <a
              href="#professores"
              className="hidden text-parchment transition-colors hover:text-gold-light md:block"
            >
              Para professores
            </a>
            <Link
              href={playHref}
              className="rounded border border-gold/50 px-4 py-2.5 text-xs text-gold-light transition-colors hover:bg-gold/10 sm:text-sm"
            >
              {signedIn ? "Minha expedição" : "Entrar no jogo"}
            </Link>
          </nav>
        </div>
      </header>

      <main id="conteudo">
        <section
          className="relative isolate min-h-[680px] overflow-hidden border-b border-gold/20"
          aria-labelledby="hero-title"
        >
          <Image
            src={hero}
            alt="Pirâmides do Egito no deserto ao entardecer"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="-z-20 object-cover object-[65%_center]"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/95 via-background/75 to-background/25" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-background/15" />
          <div className="motion-reduce:hidden">
            <Dust />
          </div>
          <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 sm:pt-28 lg:pb-28">
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-gold-light sm:text-xs">
              <span className="h-px w-8 bg-gold-light" />
              Uma aventura de geometria espacial
            </p>
            <h1
              id="hero-title"
              className="mt-7 max-w-3xl text-4xl font-bold leading-[1.12] text-parchment sm:text-6xl lg:text-7xl"
            >
              O conhecimento
              <br />é a sua <span className="gold-text">saída.</span>
            </h1>
            <p className="mt-5 font-display text-sm tracking-[0.18em] text-sand sm:text-base">
              FUGA DA PIRÂMIDE
            </p>
            <p className="mt-6 max-w-lg text-base leading-8 text-parchment/85 sm:text-lg">
              Câmaras seladas, códigos secretos e enigmas milenares. Explore três pirâmides e
              transforme áreas e volumes em caminhos para uma grande descoberta.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href={playHref}
                className="btn-gold inline-flex items-center gap-3 rounded px-6 py-4 text-xs sm:px-8 sm:text-sm"
              >
                {signedIn ? "CONTINUAR EXPEDIÇÃO" : "COMEÇAR EXPEDIÇÃO"}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <a
                href="#como-jogar"
                className="border-b border-sand/50 py-2 text-sm text-parchment transition-colors hover:text-gold-light"
              >
                Conhecer o jogo ↓
              </a>
            </div>
            {signedIn && (
              <p className="mt-5 text-sm text-sand">
                Sua próxima descoberta espera por você, {s.name}.
              </p>
            )}
            <div className="mt-16 flex max-w-lg flex-wrap gap-x-9 gap-y-5 border-t border-gold/30 pt-6 sm:gap-x-12">
              {[
                [PYRAMIDS.length, "pirâmides"],
                [rooms, "salas secretas"],
                [challenges, "desafios"],
              ].map(([number, label]) => (
                <div key={label}>
                  <p className="font-display text-3xl text-gold-light">{number}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-sand">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="sobre"
          className="scroll-mt-8 bg-parchment text-background"
          aria-labelledby="about-title"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-stone">
                01 / A aventura
              </p>
              <h2 id="about-title" className="mt-5 text-3xl leading-tight sm:text-4xl">
                A matemática
                <br />
                ganha outra dimensão.
              </h2>
            </div>
            <div>
              <p className="text-lg leading-8">
                Em <strong>Fuga da Pirâmide — Os Segredos da Geometria Espacial</strong>, cada
                problema é um mecanismo que precisa ser ativado. Seu desafio é explorar, calcular e
                descobrir o que existe depois da próxima porta.
              </p>
              <p className="mt-4 leading-7 text-stone">
                Observe os sólidos em 3D, gire os modelos e veja seu interior. Pratique do volume de
                um cubo aos problemas que combinam diferentes formas, com dificuldade crescente ao
                longo da jornada.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-stone/25 px-3 py-1.5 text-xs"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="como-jogar"
          className="scroll-mt-8 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
          aria-labelledby="steps-title"
        >
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-sand">
            02 / Seu caminho até a saída
          </p>
          <h2 id="steps-title" className="mt-5 text-3xl text-parchment sm:text-4xl">
            Três passos. Muitas descobertas.
          </h2>
          <ol className="mt-12 grid gap-9 md:grid-cols-3">
            {steps.map(({ title, text, icon: Icon }, i) => (
              <li key={title} className="border-t border-gold/35 pt-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-gold-light">0{i + 1}</span>
                  <Icon aria-hidden="true" className="h-8 w-8 text-sand" strokeWidth={1.2} />
                </div>
                <h3 className="mt-6 text-xl text-gold-light">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-parchment/80">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y border-gold/20 bg-card/40" aria-labelledby="pyramids-title">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-sand">
                  03 / O mapa da expedição
                </p>
                <h2 id="pyramids-title" className="mt-5 text-3xl text-parchment sm:text-4xl">
                  Um desafio maior a cada pirâmide.
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-sand">
                Conquiste a anterior para liberar a próxima. São cinco salas em cada etapa.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {PYRAMIDS.map((p, i) => (
                <article key={p.id} className="stone-panel relative overflow-hidden rounded-lg p-7">
                  <PyramidPreview variant={i} name={p.name} />
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sand">
                    Etapa 0{i + 1} · {p.level}
                  </p>
                  <h3 className="mt-3 text-xl text-gold-light">{p.name}</h3>
                  <p className="mt-3 min-h-14 text-sm leading-7 text-parchment/80">{p.tagline}</p>
                  <p className="mt-6 border-t border-border pt-4 font-mono text-[10px] text-sand">
                    5 SALAS · 15 DESAFIOS
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.2fr] lg:gap-20"
          aria-labelledby="progress-title"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-sand">
              04 / Cada descoberta conta
            </p>
            <h2
              id="progress-title"
              className="mt-5 text-3xl leading-tight text-parchment sm:text-4xl"
            >
              Sua jornada
              <br />
              fica registrada.
            </h2>
            <p className="mt-5 leading-7 text-parchment/80">
              Crie sua conta e continue de onde parou. O Caderno do Explorador reúne os códigos
              encontrados e os resultados da sua aventura.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: Trophy,
                title: "XP e conquistas",
                text: "Some pontos ao resolver os enigmas, suba de nível e acompanhe suas conquistas.",
              },
              {
                icon: BookOpen,
                title: "Caderno do Explorador",
                text: "Consulte os códigos das salas concluídas, suas tentativas, acertos e dicas utilizadas.",
              },
              {
                icon: Compass,
                title: "Progresso salvo",
                text: "Volte à aventura quando quiser, inclusive em outro dispositivo, usando sua conta.",
              },
              {
                icon: KeyRound,
                title: "Sequência de estudo",
                text: "Acompanhe seus dias consecutivos de expedição e mantenha a prática em movimento.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon aria-hidden="true" className="h-6 w-6 text-gold-light" strokeWidth={1.4} />
                <h3 className="mt-3 text-base text-gold-light">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-parchment/75">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="professores"
          className="scroll-mt-8 bg-parchment text-background"
          aria-labelledby="teacher-title"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-stone">
                05 / Para professores
              </p>
              <h2 id="teacher-title" className="mt-5 text-3xl leading-tight sm:text-4xl">
                Leve a expedição
                <br />
                para a sua turma.
              </h2>
              <p className="mt-5 leading-8 text-stone">
                Use a aventura como uma atividade de prática de geometria espacial e acompanhe como
                seus alunos avançam. O painel reúne os resultados de cada turma em um só lugar.
              </p>
              <Link
                href={signedIn ? "/turmas" : "/login"}
                className="mt-7 inline-flex items-center gap-3 rounded bg-background px-6 py-3.5 text-sm text-parchment hover:bg-stone"
              >
                {auth.profile?.tipo === "professor"
                  ? "Abrir painel do professor"
                  : "Acessar minha conta"}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-lg border border-stone/20 bg-background/5 p-6 sm:p-8">
              <GraduationCap
                aria-hidden="true"
                className="h-10 w-10 text-stone"
                strokeWidth={1.2}
              />
              <h3 className="mt-5 text-xl">Acompanhe cada explorador</h3>
              <ul className="mt-5 space-y-4 text-sm leading-6">
                {[
                  "Crie turmas e compartilhe um código de entrada.",
                  "Veja acertos, salas concluídas e pontuação dos alunos.",
                  "Acompanhe o ranking por XP dentro de cada turma.",
                  "Consulte a sequência e a última atividade dos alunos.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="text-stone">
                      ✦
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-stone/20 pt-5 text-xs leading-6 text-stone">
                O painel fica disponível para contas com acesso de professor liberado pelo
                responsável pelo jogo.
              </p>
            </div>
          </div>
        </section>

        <section
          id="duvidas"
          className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24"
          aria-labelledby="faq-title"
        >
          <p className="text-center font-mono text-xs uppercase tracking-[0.22em] text-sand">
            Antes de entrar
          </p>
          <h2 id="faq-title" className="mt-5 text-center text-3xl text-parchment sm:text-4xl">
            Dúvidas de explorador
          </h2>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {questions.map(({ question, answer }) => (
              <details key={question} className="group py-5">
                <summary className="cursor-pointer text-base font-medium text-gold-light marker:text-sand">
                  {question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-parchment/80">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section
          className="relative overflow-hidden border-t border-gold/25 px-5 py-16 text-center sm:py-20"
          aria-labelledby="cta-title"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,138,68,0.12),transparent_65%)]"
          />
          <div className="relative mx-auto max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-sand">
              A próxima porta espera por você
            </p>
            <h2 id="cta-title" className="mt-5 text-3xl text-parchment sm:text-4xl">
              Pronto para encontrar a saída?
            </h2>
            <p className="mt-5 leading-7 text-parchment/80">
              Entre na expedição e descubra até onde a geometria pode levar você.
            </p>
            <Link
              href={playHref}
              className="btn-gold mt-8 inline-flex items-center gap-3 rounded px-8 py-4 text-sm"
            >
              {signedIn ? "VOLTAR À AVENTURA" : "CRIAR CONTA E JOGAR"}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t border-border px-5 py-7">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-xs text-sand sm:flex-row">
          <p className="font-display tracking-wider">FUGA DA PIRÂMIDE</p>
          <p>Os Segredos da Geometria Espacial · Aprender também é explorar.</p>
          <a href="#conteudo" className="hover:text-gold-light">
            Voltar ao topo ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
