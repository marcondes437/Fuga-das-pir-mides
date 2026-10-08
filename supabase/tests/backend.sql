-- Transactional integration tests: every fixture is rolled back.
begin;
create temporary table test_ids(label text primary key, id uuid not null default gen_random_uuid());
insert into test_ids(label) values('aluno'),('outro'),('professor'),('outro_professor'),('autorizado'),('nao_confirmado');
insert into auth.users(id,aud,role,email,email_confirmed_at,raw_app_meta_data,raw_user_meta_data)
select id,'authenticated','authenticated',id::text||'@example.invalid',case when label<>'nao_confirmado' then now() end,'{}'::jsonb,
 jsonb_build_object('nome','Teste backend','tipo','professor') from test_ids;
insert into public.usuarios(id,nome,tipo) select id,label,case when label like '%professor' then 'professor'::public.tipo_usuario else 'aluno'::public.tipo_usuario end from test_ids where label<>'aluno';
insert into game_private.teacher_allowlist(email) select id::text||'@example.invalid' from test_ids where label in ('autorizado','nao_confirmado');
select set_config('request.jwt.claim.sub',(select id::text from test_ids where label='autorizado'),true);
select public.game_action('load');
do $test$ begin if (select tipo from public.usuarios where id=auth.uid())<>'professor' then raise exception 'Verified authorized teacher not promoted'; end if;end;$test$;
select set_config('request.jwt.claim.sub',(select id::text from test_ids where label='nao_confirmado'),true);
select public.game_action('load');
do $test$ begin if (select tipo from public.usuarios where id=auth.uid())<>'aluno' then raise exception 'Unverified email granted professor'; end if;end;$test$;
select set_config('request.jwt.claim.sub',(select id::text from test_ids where label='aluno'),true);
do $test$ declare result jsonb; rejected boolean; begin
 result:=public.game_action('load');
 if (select tipo from public.usuarios where id=auth.uid()) <> 'aluno' then raise exception 'User metadata granted professor'; end if;
 if (result->'state'->>'xp')::integer<>0 then raise exception 'New state is not empty'; end if;
 begin perform public.game_action('answer','iniciante-s2-d1','24'); raise exception 'Accepted locked room'; exception when raise_exception then if sqlerrm <> 'Sala bloqueada.' then raise; end if; end;
 begin perform public.game_action('answer','enigmas-s1-d1','158'); raise exception 'Accepted locked pyramid'; exception when raise_exception then if sqlerrm <> 'Pirâmide bloqueada.' then raise; end if; end;
 begin perform public.game_action('answer','iniciante-s1-d2','30'); raise exception 'Accepted locked challenge'; exception when raise_exception then if sqlerrm <> 'Resolva o desafio anterior.' then raise; end if; end;
 begin perform public.game_action('door','iniciante','[]'); raise exception 'Opened unfinished pyramid'; exception when raise_exception then if sqlerrm <> 'Conclua todas as salas primeiro.' then raise; end if; end;
 result:=public.game_action('hint','iniciante-s1-d1');
 if (result->'state'->'records'->'iniciante-s1-d1'->>'hints')::integer<>1 then raise exception 'Hint not recorded'; end if;
 if result->'state'->'records'->'iniciante-s1-d1' ? 'answer' then raise exception 'Hint leaked answer'; end if;
 result:=public.game_action('answer','iniciante-s1-d1','0');
 if (result->>'correct')::boolean or (result->'state'->>'xp')::integer<>0 then raise exception 'Wrong answer granted XP'; end if;
 result:=public.game_action('answer','iniciante-s1-d1','64,00');
 if not (result->>'correct')::boolean or (result->'state'->>'xp')::integer<>10 then raise exception 'Decimal answer failed'; end if;
 if result->'state'->'codes' ? 'iniciante/s1' or result->'state'->'rooms' ? 'iniciante/s1' then raise exception 'Code released after only the first answer'; end if;
 result:=public.game_action('answer','iniciante-s1-d1','64');
 if (result->'state'->>'xp')::integer<>10 or (result->>'gain')::integer<>0 then raise exception 'Replay granted duplicate XP'; end if;
 result:=public.game_action('answer','iniciante-s1-d2','30');
 if result->'state'->'codes' ? 'iniciante/s1' or result->'state'->'rooms' ? 'iniciante/s1' then raise exception 'Code released before the third answer'; end if;
 result:=public.game_action('answer','iniciante-s1-d3','54');
 if not (result->>'roomDone')::boolean or (result->'state'->>'xp')::integer<>100 or result->'state'->'codes'->>'iniciante/s1'<>'RA-17' then raise exception 'Room reward failed'; end if;
 if (select tentativas_total from public.progresso_salas where usuario_id=auth.uid())<>4 then raise exception 'Attempt aggregate failed'; end if;
 if (result->'state'->>'streak')::integer<>1 then raise exception 'Daily streak incremented more than once'; end if;
end; $test$;
select set_config('request.jwt.claim.sub',(select id::text from test_ids where label='professor'),true);
select public.classroom_action('create','Turma de teste');
select set_config('test.turma_codigo',(select codigo from public.turmas where professor_id=auth.uid()),true);
select set_config('request.jwt.claim.sub',(select id::text from test_ids where label='aluno'),true);
select public.classroom_action('join',current_setting('test.turma_codigo'));
select public.classroom_action('join',current_setting('test.turma_codigo'));
do $test$ declare result jsonb; begin
 result:=public.classroom_action('list');
 if jsonb_array_length(result)<>1 or result->0->>'codigo' is not null then raise exception 'Membership or privacy failed'; end if;
 begin perform public.classroom_action('create','Invadida');raise exception 'Student created class';exception when raise_exception then if sqlerrm<>'Acesso exclusivo do professor.' then raise;end if;end;
end; $test$;
select set_config('request.jwt.claim.sub',(select id::text from test_ids where label='outro_professor'),true);
do $test$ begin if public.classroom_action('list')<>'[]'::jsonb then raise exception 'Teacher sees another class'; end if; end; $test$;
select set_config('request.jwt.claim.sub',(select id::text from test_ids where label='professor'),true);
do $test$ declare result jsonb;begin
 result:=public.classroom_action('list');
 if jsonb_array_length(result->0->'alunos')<>1 or (result->0->'alunos'->0->>'xp')::integer<>100 then raise exception 'Teacher dashboard incorrect'; end if;
end;$test$;
select set_config('request.jwt.claim.sub',(select id::text from test_ids where label='aluno'),true);
set local role authenticated;
do $test$ begin
 if (select count(*) from public.usuarios)<>1 then raise exception 'Profile RLS failed'; end if;
 if (select count(*) from public.game_states)<>1 then raise exception 'State RLS failed'; end if;
 if has_table_privilege(current_user,'public.pontuacoes','INSERT') or has_table_privilege(current_user,'public.pontuacoes','TRUNCATE') then raise exception 'Client can award XP or truncate data'; end if;
 if has_column_privilege(current_user,'public.usuarios','tipo','UPDATE') then raise exception 'Client can promote itself'; end if;
 if has_column_privilege(current_user,'public.desafios','resposta_correta','SELECT') or has_table_privilege(current_user,'public.codigos','SELECT') then raise exception 'Client can read secrets'; end if;
 if has_table_privilege(current_user,'game_private.challenges','SELECT') then raise exception 'Private schema accessible'; end if;
 perform public.game_action('load');
 perform public.classroom_action('list');
end;$test$;
reset role;
select set_config('request.jwt.claim.sub',(select id::text from test_ids where label='aluno'),true);
do $test$ declare c record; result jsonb; codes text;begin
 -- Complete all 45 challenges and all three doors through the public API.
 for c in select x.*,r.pyramid,r.position as room_position from game_private.challenges x join game_private.rooms r using(room_key)
 order by case r.pyramid when 'iniciante' then 1 when 'enigmas' then 2 else 3 end,r.position,x.position loop
   result:=public.game_action('answer',c.slug,c.answer::text);
   if not (result->>'correct')::boolean then raise exception 'Challenge rejected %',c.slug;end if;
   if c.room_position=5 and c.position=3 then
     select jsonb_agg(code order by position)::text into codes from game_private.rooms where pyramid=c.pyramid;
     result:=public.game_action('door',c.pyramid,'["wrong","wrong","wrong","wrong","wrong"]');
     if not(result->'wrong' @> '[true]'::jsonb) then raise exception 'Door accepted wrong codes'; end if;
     result:=public.game_action('door',c.pyramid,codes);
   end if;
 end loop;
 if jsonb_array_length(result->'state'->'pyramids')<>3 or jsonb_array_length(result->'state'->'rooms')<>15 or result->'state'->>'finishedAt' is null then raise exception 'Full game did not complete'; end if;
 if (result->'state'->>'xp')::integer<>(select sum(pontos) from public.pontuacoes where usuario_id=auth.uid()) then raise exception 'XP ledger disagrees with state'; end if;
 result:=public.game_action('reset');
 if (result->'state'->>'xp')::integer<>0 or result->'state'->'records'<>'{}'::jsonb then raise exception 'Reset failed'; end if;
 if exists(select 1 from public.tentativas where usuario_id=auth.uid()) then raise exception 'Reset left attempts behind';end if;
end;$test$;
select set_config('request.jwt.claim.sub','',true);
do $test$ begin
 begin perform game_private.play('load');raise exception 'Unauthenticated access succeeded';exception when raise_exception then if sqlerrm<>'Entre na sua conta para jogar.' then raise;end if;end;
end;$test$;
rollback;
