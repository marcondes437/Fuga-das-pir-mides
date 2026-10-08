# Fuga da Pirâmide — Os Segredos da Geometria Espacial

Jogo educacional gamificado de geometria espacial, com aventura arqueológica,
escape room, modelos 3D interativos, códigos secretos, XP e níveis.

## Como rodar no seu computador

### 1. Instale o Node.js (versão 20.9 ou superior)

Baixe em https://nodejs.org (instalador "LTS"). Para conferir se instalou, abra
o terminal e digite:

```sh
node --version
```

Deve aparecer algo como `v20.x.x` ou `v22.x.x`.

### 2. Extraia o zip

Descompacte `fuga-da-piramide-fonte.zip` em uma pasta qualquer, por exemplo
`Documentos/fuga-da-piramide`.

### 3. Instale as dependências

Abra o terminal **dentro da pasta extraída** e rode:

```sh
bun install --frozen-lockfile
```

O projeto usa `bun.lock` para fixar as versões. O Bun está disponível em
https://bun.sh. Após instalar, você também pode usar `npm run` para os comandos abaixo.

Isso baixa as bibliotecas do jogo. Só precisa fazer uma vez.

### 4. Rode o jogo

```sh
npm run dev
```

No terminal vai aparecer algo como:

```
Local: http://localhost:3000
```

Abra http://localhost:3000 no navegador (Chrome, Edge ou Firefox). O comando
de desenvolvimento usa a porta 3000.

Para **parar o jogo**, volte ao terminal e aperte `Ctrl + C`.

### Rodar versão pronta para publicar (opcional)

```sh
npm run build
npm start
```

## Requisitos do sistema

- Node.js 20.9+ (recomendado: 22 LTS)
- Navegador moderno (o modelo 3D usa WebGL)
- Windows, macOS ou Linux

## Como jogar

1. Na tela inicial, escolha **Entrar ou criar conta**. Cadastre nome, e-mail e
   senha e confirme o e-mail antes de entrar.
2. Escolha uma das **três pirâmides** — cada uma abre só depois de vencer a anterior.
3. Cada pirâmide tem **5 salas** com **3 desafios cada** (45 desafios no total).
4. Em cada desafio: leia a história, gire o modelo 3D (arraste) e use o botão
   "Transparente" para ver o interior do sólido.
5. Você tem **2 dicas** por desafio, liberadas pelo servidor.
6. Acertar de primeira dá **bônus de 10 XP**.
7. Conclua a sala para revelar o **código secreto**.
8. Na **porta final**, use os 5 códigos da pirâmide para escapar.

O progresso, tentativas, XP e códigos ficam salvos no **Supabase**, associados à
sua conta. Você pode continuar em outro dispositivo. O botão "Reiniciar
expedição", no Caderno, apaga seu progresso no servidor.

## Backend Supabase

Esta versão está conectada ao projeto **Fuga da Pirâmide**
(`gvqbbzdbonzauanospco`). A URL e a chave publicável estão no cliente; elas são
públicas por definição. As regras do banco protegem os dados de cada conta.
Para conectar outro projeto, copie `.env.example` para `.env` e configure as
variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Nunca coloque
uma chave `service_role` ou chave secreta no frontend.

- `/login`: cadastro, login, recuperação e troca de senha.
- `/turmas`: aluno entra pelo código; professor cria turmas e acompanha o
  ranking por XP, acertos, salas e sequência dos próprios alunos.
- Respostas, explicações, dicas e códigos são controlados pelo servidor.
- A função `game_action` calcula pontuação e valida a ordem dos desafios,
  salas e pirâmides; o navegador não envia XP nem informa se acertou.
- As conquistas são calculadas a partir do progresso validado no servidor.
- A sequência usa dias no fuso `America/Sao_Paulo`.

### Confirmação de e-mail e recuperação de senha

No painel do Supabase, em **Authentication → URL Configuration**, configure
o **Site URL** com o endereço publicado e adicione `/login` à lista de URLs
de redirecionamento permitidas. Para testes locais, inclua também
`http://127.0.0.1:3000/login` e `http://localhost:3000/login` (ajuste a porta se
necessário). Sem essa configuração, os links de confirmação e recuperação
podem levar ao endereço padrão configurado no Supabase.

### Acesso de professor

Todo cadastro começa como aluno. A autorização de professor é administrada
no banco, na tabela privada `game_private.teacher_allowlist`; o usuário não
pode escolher ou alterar esse papel no navegador. Cadastre os e-mails
autorizados em letras minúsculas. O papel só é liberado após confirmar o
e-mail e carregar a conta. Para revogar, remova o e-mail dessa lista e altere
`public.usuarios.tipo` para `aluno` usando uma conexão administrativa.

O e-mail informado nesta sessão já foi autorizado no projeto existente.
Nenhuma conta ou senha foi criada em nome da professora.

### Migrações e verificação

As migrações em `supabase/migrations` já foram aplicadas ao projeto existente.
Elas complementam as nove tabelas originais, que precisam existir antes de
aplicar estas migrações em outro banco. As tabelas privadas não são expostas
pela Data API. O frontend só pode consultar o próprio progresso; o painel
usa `classroom_action`, que verifica a propriedade das turmas.

```sh
npm test
npx tsc --noEmit
npm run build
```

O teste de integração `supabase/tests/backend.sql` deve ser executado por uma
conexão administrativa no banco já migrado. Ele cria contas temporárias
**dentro de uma transação encerrada com ROLLBACK** e verifica os 45 desafios,
portas, pontuação, sequência, isolamento entre turmas e permissões. Não gera
cadastros permanentes nem envia e-mails.

O progresso antigo do `localStorage` não é importado como pontuação válida:
ele era editável no navegador. A primeira entrada começa uma nova expedição
associada à conta, sem apagar os dados antigos do navegador.

## Estrutura do projeto

```
src/
  game/
    data.ts        # enunciados e modelos 3D; sem respostas ou códigos
    store.ts       # estado do jogo sincronizado com game_action no Supabase
  lib/
    auth.tsx       # sessão, perfil e proteção de telas
    supabase.ts    # cliente com chave publicável
  components/
    Solid3D.tsx    # modelo 3D interativo (Three.js / React Three Fiber)
    GameHeader.tsx # cabeçalho do jogo
  app/             # App Router do Next.js: páginas, layouts e metadados
  views/           # telas interativas do jogo, login e turmas
  styles.css       # tema visual (deserto + ouro)
```

## Built with

- Next.js 16 (App Router) e React 19
- TypeScript
- Tailwind CSS v4
- Three.js + React Three Fiber + Drei
- Vitest (testes)
- Supabase (Auth, Postgres, RLS e funções transacionais)

## Estrutura Next.js

As páginas ficam em `src/app`. O grupo `(game)` compartilha o layout que
exige login, sem alterar os endereços das telas. As rotas dinâmicas usam
`[pid]` e `[sid]`, validam os identificadores no servidor e retornam 404 para
pirâmides ou salas inexistentes. `src/views` contém os componentes de cliente
com interações do jogo e modelos 3D. O CSS global é processado com Tailwind
via PostCSS.

Os comandos principais são `npm run dev`, `npm run build` e `npm start`.
O Vite permanece apenas como dependência do Vitest para executar os testes;
o aplicativo é desenvolvido e compilado pelo Next.js.

## Nota

Este projeto foi criado com o [Lovable](https://lovable.dev). Para continuar
editando aqui na plataforma, descreva o que quer mudar em linguagem natural.
