update public.piramides p
set nome = case r.pyramid
  when 'iniciante' then 'Pirâmide de Miquerinos'
  when 'enigmas' then 'Pirâmide de Quéfren'
  when 'guardiao' then 'Pirâmide de Quéops'
end
from public.salas s
join game_private.rooms r on r.room_id = s.id
where p.id = s.piramide_id
  and r.pyramid in ('iniciante', 'enigmas', 'guardiao');