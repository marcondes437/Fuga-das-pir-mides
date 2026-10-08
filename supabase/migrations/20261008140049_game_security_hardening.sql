-- The browser reads only its own profile and public challenge presentation.
drop policy "professor gerencia piramides" on public.piramides;
drop policy "professor gerencia salas" on public.salas;
drop policy "professor gerencia desafios" on public.desafios;
drop policy "professor gerencia dicas" on public.dicas;
drop policy "professor gerencia codigos" on public.codigos;
drop policy "usuario insere pontuacoes" on public.pontuacoes;
drop policy "aluno insere tentativas" on public.tentativas;
drop policy "usuario atualiza progresso" on public.progresso_salas;
drop policy "usuario insere progresso" on public.progresso_salas;
alter policy "usuario atualiza proprio perfil" on public.usuarios to authenticated using (id=(select auth.uid())) with check (id=(select auth.uid()));
create or replace function public.eh_professor() returns boolean language sql stable security invoker set search_path='' as $$
 select exists(select 1 from public.usuarios where id=(select auth.uid()) and tipo='professor');
$$;
-- These tables deliberately deny direct access, including to authenticated users.
create policy deny_direct on game_private.challenges for select to authenticated using(false);
create policy deny_direct on game_private.rooms for select to authenticated using(false);
create policy deny_direct on game_private.teacher_allowlist for select to authenticated using(false);
create index challenges_challenge_idx on game_private.challenges(challenge_id);
create index rooms_room_idx on game_private.rooms(room_id);
create index pontuacoes_desafio_idx on public.pontuacoes(desafio_id);
create index progresso_salas_sala_idx on public.progresso_salas(sala_id);
