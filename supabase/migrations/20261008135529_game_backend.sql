create schema if not exists game_private;
revoke all on schema game_private from public, anon, authenticated;
create table game_private.rooms (
 room_key text primary key, room_id bigint not null references public.salas(id), pyramid text not null,
 position integer not null, code text not null, previous_room text, previous_pyramid text
);
create table game_private.challenges (
 slug text primary key, challenge_id bigint not null references public.desafios(id), room_key text not null references game_private.rooms(room_key),
 position integer not null, answer numeric not null, tolerance numeric not null, xp integer not null, hints text[] not null, explanation text not null
);
alter table game_private.rooms enable row level security;
alter table game_private.challenges enable row level security;
create index challenges_room_idx on game_private.challenges(room_key);
do $seed$ declare pid bigint; sid bigint; cid bigint; begin
 insert into public.piramides(nome,descricao) values('Pirâmide do Iniciante','Areia dourada, céu claro e os primeiros mecanismos.') returning id into pid;
insert into public.salas(piramide_id,nome,descricao,ordem,dificuldade) values(pid,'Câmara dos Cubos','Cubo e paralelepípedo',1,1) returning id into sid;
insert into public.codigos(sala_id,codigo) values(sid,'RA-17');
insert into game_private.rooms values('iniciante/s1',sid,'iniciante',1,'RA-17',null,null);
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O bloco de calcário','Um cubo tem aresta de 4 cm. Qual é o seu volume?','64',10,1) returning id into cid;
insert into game_private.challenges values('iniciante-s1-d1',cid,'iniciante/s1',1,64,0.01,10,array['Volume do cubo: V = a³','V = 4 × 4 × 4'],'V = a³ = 4³ = 64 cm³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Volume do cubo: V = a³');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'V = 4 × 4 × 4');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O baú do escriba','Um paralelepípedo mede 5 cm × 3 cm × 2 cm. Qual é o seu volume?','30',10,2) returning id into cid;
insert into game_private.challenges values('iniciante-s1-d2',cid,'iniciante/s1',2,30,0.01,10,array['V = comprimento × largura × altura','V = 5 × 3 × 2'],'V = 5 · 3 · 2 = 30 cm³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'V = comprimento × largura × altura');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'V = 5 × 3 × 2');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O revestimento de ouro','Qual é a área total de um cubo de aresta 3 cm?','54',10,3) returning id into cid;
insert into game_private.challenges values('iniciante-s1-d3',cid,'iniciante/s1',3,54,0.01,10,array['O cubo tem 6 faces quadradas: A = 6a²','A = 6 × 9'],'A = 6a² = 6 · 3² = 54 cm².');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'O cubo tem 6 faces quadradas: A = 6a²');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'A = 6 × 9');
insert into public.salas(piramide_id,nome,descricao,ordem,dificuldade) values(pid,'Galeria dos Prismas','Prismas',2,1) returning id into sid;
insert into public.codigos(sala_id,codigo) values(sid,'SET-42');
insert into game_private.rooms values('iniciante/s2',sid,'iniciante',2,'SET-42','iniciante/s1',null);
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A base triangular','A base de um prisma é um triângulo retângulo de catetos 6 cm e 8 cm. Qual é a área da base?','24',10,1) returning id into cid;
insert into game_private.challenges values('iniciante-s2-d1',cid,'iniciante/s2',1,24,0.01,10,array['Área do triângulo = (base × altura) / 2','Os catetos são base e altura: (6 × 8)/2'],'Ab = 6 · 8 / 2 = 24 cm².');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Área do triângulo = (base × altura) / 2');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'Os catetos são base e altura: (6 × 8)/2');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O pilar triangular','O mesmo prisma (base: triângulo retângulo de catetos 6 cm e 8 cm) tem altura 10 cm. Qual é o volume?','240',10,2) returning id into cid;
insert into game_private.challenges values('iniciante-s2-d2',cid,'iniciante/s2',2,240,0.01,10,array['V = Área da base × altura','V = 24 × 10'],'V = Ab · h = 24 · 10 = 240 cm³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'V = Área da base × altura');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'V = 24 × 10');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'As paredes pintadas','Um prisma reto de base quadrada tem lado da base 4 cm e altura 7 cm. Qual é a área lateral?','112',10,3) returning id into cid;
insert into game_private.challenges values('iniciante-s2-d3',cid,'iniciante/s2',3,112,0.01,10,array['Área lateral = perímetro da base × altura','Perímetro = 4 × 4 = 16; 16 × 7'],'Al = 16 · 7 = 112 cm².');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Área lateral = perímetro da base × altura');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'Perímetro = 4 × 4 = 16; 16 × 7');
insert into public.salas(piramide_id,nome,descricao,ordem,dificuldade) values(pid,'Templo das Pirâmides','Pirâmides',3,1) returning id into sid;
insert into public.codigos(sala_id,codigo) values(sid,'KHU-08');
insert into game_private.rooms values('iniciante/s3',sid,'iniciante',3,'KHU-08','iniciante/s2',null);
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O chão do templo','A base quadrada de uma pirâmide tem lado 6 cm. Qual é a área da base?','36',10,1) returning id into cid;
insert into game_private.challenges values('iniciante-s3-d1',cid,'iniciante/s3',1,36,0.01,10,array['Área do quadrado = lado²','6 × 6'],'Ab = 6² = 36 cm².');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Área do quadrado = lado²');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'6 × 6');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O volume sagrado','A pirâmide de base quadrada de lado 6 cm tem altura 4 cm. Qual é o volume?','48',10,2) returning id into cid;
insert into game_private.challenges values('iniciante-s3-d2',cid,'iniciante/s3',2,48,0.01,10,array['V = (Área da base × altura) / 3','V = 36 × 4 / 3'],'V = 36 · 4 / 3 = 48 cm³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'V = (Área da base × altura) / 3');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'V = 36 × 4 / 3');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'Altura ou apótema?','Na pirâmide de base 6 cm e altura 4 cm, o segmento que vai do vértice ao ponto médio de uma aresta da base mede 5 cm. Esse segmento é:','1',10,3) returning id into cid;
insert into game_private.challenges values('iniciante-s3-d3',cid,'iniciante/s3',3,1,0,10,array['A altura cai perpendicularmente no centro da base.','O segmento até o meio da aresta da base fica na face lateral: √(4² + 3²) = 5.'],'É o apótema da pirâmide: hipotenusa do triângulo com altura 4 e apótema da base 3.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'A altura cai perpendicularmente no centro da base.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'O segmento até o meio da aresta da base fica na face lateral: √(4² + 3²) = 5.');
insert into public.salas(piramide_id,nome,descricao,ordem,dificuldade) values(pid,'Câmara dos Cilindros','Cilindros',4,1) returning id into sid;
insert into public.codigos(sala_id,codigo) values(sid,'NUT-63');
insert into game_private.rooms values('iniciante/s4',sid,'iniciante',4,'NUT-63','iniciante/s3',null);
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A tampa do jarro','Um cilindro tem raio 3 cm. Qual é a área da base? Use π = 3,14.','28.26',10,1) returning id into cid;
insert into game_private.challenges values('iniciante-s4-d1',cid,'iniciante/s4',1,28.26,0.01,10,array['Área do círculo = π·r²','3,14 × 9'],'Ab = 3,14 · 3² = 28,26 cm².');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Área do círculo = π·r²');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'3,14 × 9');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O óleo das tochas','O cilindro de raio 3 cm tem altura 10 cm. Qual é o volume? Use π = 3,14.','282.6',10,2) returning id into cid;
insert into game_private.challenges values('iniciante-s4-d2',cid,'iniciante/s4',2,282.6,0.01,10,array['V = π·r²·h','28,26 × 10'],'V = 28,26 · 10 = 282,6 cm³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'V = π·r²·h');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'28,26 × 10');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O papiro enrolado','Qual é a área lateral do cilindro de raio 3 cm e altura 10 cm? Use π = 3,14.','188.4',10,3) returning id into cid;
insert into game_private.challenges values('iniciante-s4-d3',cid,'iniciante/s4',3,188.4,0.01,10,array['Al = 2·π·r·h','2 × 3,14 × 3 × 10'],'Al = 2 · 3,14 · 3 · 10 = 188,4 cm².');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Al = 2·π·r·h');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'2 × 3,14 × 3 × 10');
insert into public.salas(piramide_id,nome,descricao,ordem,dificuldade) values(pid,'Salão dos Sólidos','Cones e esferas',5,1) returning id into sid;
insert into public.codigos(sala_id,codigo) values(sid,'ANK-91');
insert into game_private.rooms values('iniciante/s5',sid,'iniciante',5,'ANK-91','iniciante/s4',null);
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O cone de incenso','Um cone tem raio 3 cm e altura 4 cm. Qual é o volume? Use π = 3,14.','37.68',10,1) returning id into cid;
insert into game_private.challenges values('iniciante-s5-d1',cid,'iniciante/s5',1,37.68,0.01,10,array['V = (π·r²·h) / 3','3,14 × 9 × 4 / 3'],'V = 3,14 · 9 · 4 / 3 = 37,68 cm³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'V = (π·r²·h) / 3');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'3,14 × 9 × 4 / 3');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A esfera dourada','Qual é a área da superfície de uma esfera de raio 5 cm? Use π = 3,14.','314',10,2) returning id into cid;
insert into game_private.challenges values('iniciante-s5-d2',cid,'iniciante/s5',2,314,0.01,10,array['A = 4·π·r²','4 × 3,14 × 25'],'A = 4 · 3,14 · 25 = 314 cm².');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'A = 4·π·r²');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'4 × 3,14 × 25');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O olho de Rá','Qual é o volume de uma esfera de raio 3 cm? Use π = 3,14.','113.04',10,3) returning id into cid;
insert into game_private.challenges values('iniciante-s5-d3',cid,'iniciante/s5',3,113.04,0.01,10,array['V = (4/3)·π·r³','4/3 × 3,14 × 27'],'V = 4/3 · 3,14 · 27 = 113,04 cm³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'V = (4/3)·π·r³');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'4/3 × 3,14 × 27');
end; $seed$;
do $seed$ declare pid bigint; sid bigint; cid bigint; begin
 insert into public.piramides(nome,descricao) values('Pirâmide dos Enigmas','Sombras longas, enigmas em várias etapas.') returning id into pid;
insert into public.salas(piramide_id,nome,descricao,ordem,dificuldade) values(pid,'Câmara das Superfícies','Área lateral e total de prismas',1,2) returning id into sid;
insert into public.codigos(sala_id,codigo) values(sid,'HOR-25');
insert into game_private.rooms values('enigmas/s1',sid,'enigmas',1,'HOR-25',null,'iniciante');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O sarcófago selado','Um paralelepípedo mede 8 cm × 5 cm × 3 cm. Qual é a área total?','158',20,1) returning id into cid;
insert into game_private.challenges values('enigmas-s1-d1',cid,'enigmas/s1',1,158,0.01,20,array['At = 2(ab + ac + bc)','2(40 + 24 + 15)'],'At = 2(40 + 24 + 15) = 158 cm².');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'At = 2(ab + ac + bc)');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'2(40 + 24 + 15)');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A coluna hexagonal','Um prisma hexagonal regular tem aresta da base 2 cm e altura 10 cm. Qual é a área lateral?','120',20,2) returning id into cid;
insert into game_private.challenges values('enigmas-s1-d2',cid,'enigmas/s1',2,120,0.01,20,array['São 6 retângulos laterais iguais.','6 × (2 × 10)'],'Al = 6 · 2 · 10 = 120 cm².');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'São 6 retângulos laterais iguais.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'6 × (2 × 10)');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O cubo perdido','Um cubo tem área total de 150 cm². Qual é a medida da sua aresta?','5',20,3) returning id into cid;
insert into game_private.challenges values('enigmas-s1-d3',cid,'enigmas/s1',3,5,0.01,20,array['6a² = 150','a² = 25'],'6a² = 150 ⇒ a² = 25 ⇒ a = 5 cm.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'6a² = 150');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'a² = 25');
insert into public.salas(piramide_id,nome,descricao,ordem,dificuldade) values(pid,'Galeria dos Apótemas','Pirâmides regulares',2,2) returning id into sid;
insert into public.codigos(sala_id,codigo) values(sid,'ISI-34');
insert into game_private.rooms values('enigmas/s2',sid,'enigmas',2,'ISI-34','enigmas/s1','iniciante');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A face inclinada','Uma pirâmide quadrangular regular tem aresta da base 10 cm e altura 12 cm. Qual é o apótema da pirâmide?','13',20,1) returning id into cid;
insert into game_private.challenges values('enigmas-s2-d1',cid,'enigmas/s2',1,13,0.01,20,array['Apótema da base = metade do lado = 5','g² = 12² + 5²'],'ap = √(144 + 25) = √169 = 13 cm.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Apótema da base = metade do lado = 5');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'g² = 12² + 5²');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'As quatro faces','Com aresta da base 10 cm e apótema 13 cm, qual é a área lateral da pirâmide?','260',20,2) returning id into cid;
insert into game_private.challenges values('enigmas-s2-d2',cid,'enigmas/s2',2,260,0.01,20,array['Cada face: (10 × 13)/2','4 × 65'],'Al = 4 · (10 · 13 / 2) = 260 cm².');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Cada face: (10 × 13)/2');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'4 × 65');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O revestimento completo','Qual é a área total dessa pirâmide (aresta da base 10 cm, apótema 13 cm)?','360',20,3) returning id into cid;
insert into game_private.challenges values('enigmas-s2-d3',cid,'enigmas/s2',3,360,0.01,20,array['At = Al + Ab','260 + 10²'],'At = 260 + 100 = 360 cm².');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'At = Al + Ab');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'260 + 10²');
insert into public.salas(piramide_id,nome,descricao,ordem,dificuldade) values(pid,'Templo dos Reservatórios','Cilindros',3,2) returning id into sid;
insert into public.codigos(sala_id,codigo) values(sid,'NIL-50');
insert into game_private.rooms values('enigmas/s3',sid,'enigmas',3,'NIL-50','enigmas/s2','iniciante');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A cisterna do templo','A cisterna tem raio 2 m e altura 5 m. Qual é o volume? Use π = 3,14.','62.8',20,1) returning id into cid;
insert into game_private.challenges values('enigmas-s3-d1',cid,'enigmas/s3',1,62.8,0.01,20,array['V = π·r²·h','3,14 × 4 × 5'],'V = 3,14 · 4 · 5 = 62,8 m³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'V = π·r²·h');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'3,14 × 4 × 5');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'Litros do Nilo','Quantos litros cabem na cisterna de 62,8 m³?','62800',20,2) returning id into cid;
insert into game_private.challenges values('enigmas-s3-d2',cid,'enigmas/s3',2,62800,1,20,array['1 m³ = 1000 L','62,8 × 1000'],'62,8 m³ = 62 800 L.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'1 m³ = 1000 L');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'62,8 × 1000');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A impermeabilização','Qual é a área total da cisterna (r = 2 m, h = 5 m)? Use π = 3,14.','87.92',20,3) returning id into cid;
insert into game_private.challenges values('enigmas-s3-d3',cid,'enigmas/s3',3,87.92,0.01,20,array['At = 2πr² + 2πrh','25,12 + 62,8'],'At = 2·3,14·4 + 2·3,14·2·5 = 25,12 + 62,8 = 87,92 m².');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'At = 2πr² + 2πrh');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'25,12 + 62,8');
insert into public.salas(piramide_id,nome,descricao,ordem,dificuldade) values(pid,'Câmara das Geratrizes','Cones e Pitágoras',4,2) returning id into sid;
insert into public.codigos(sala_id,codigo) values(sid,'MUT-77');
insert into game_private.rooms values('enigmas/s4',sid,'enigmas',4,'MUT-77','enigmas/s3','iniciante');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A rampa cônica','Um cone tem raio 6 cm e altura 8 cm. Qual é a geratriz?','10',20,1) returning id into cid;
insert into game_private.challenges values('enigmas-s4-d1',cid,'enigmas/s4',1,10,0.01,20,array['g² = r² + h²','g² = 36 + 64'],'g = √100 = 10 cm.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'g² = r² + h²');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'g² = 36 + 64');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O manto do cone','Qual é a área lateral desse cone (r = 6 cm, g = 10 cm)? Use π = 3,14.','188.4',20,2) returning id into cid;
insert into game_private.challenges values('enigmas-s4-d2',cid,'enigmas/s4',2,188.4,0.01,20,array['Al = π·r·g','3,14 × 6 × 10'],'Al = 3,14 · 60 = 188,4 cm².');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Al = π·r·g');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'3,14 × 6 × 10');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A altura escondida','Um cone tem geratriz 13 cm e raio 5 cm. Qual é a altura?','12',20,3) returning id into cid;
insert into game_private.challenges values('enigmas-s4-d3',cid,'enigmas/s4',3,12,0.01,20,array['h² = g² − r²','h² = 169 − 25'],'h = √144 = 12 cm.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'h² = g² − r²');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'h² = 169 − 25');
insert into public.salas(piramide_id,nome,descricao,ordem,dificuldade) values(pid,'Salão das Esferas','Esferas e semiesferas',5,2) returning id into sid;
insert into public.codigos(sala_id,codigo) values(sid,'BES-19');
insert into game_private.rooms values('enigmas/s5',sid,'enigmas',5,'BES-19','enigmas/s4','iniciante');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A cúpula','Qual é o volume de uma semiesfera de raio 6 m? Use π = 3,14.','452.16',20,1) returning id into cid;
insert into game_private.challenges values('enigmas-s5-d1',cid,'enigmas/s5',1,452.16,0.01,20,array['V = (2/3)·π·r³','2/3 × 3,14 × 216'],'V = 2/3 · 3,14 · 216 = 452,16 m³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'V = (2/3)·π·r³');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'2/3 × 3,14 × 216');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A tigela ritual','Qual é a área total de uma semiesfera maciça de raio 4 cm? Use π = 3,14.','150.72',20,2) returning id into cid;
insert into game_private.challenges values('enigmas-s5-d2',cid,'enigmas/s5',2,150.72,0.01,20,array['Curva: 2πr²; base plana: πr²','Total = 3πr² = 3 × 3,14 × 16'],'At = 3 · 3,14 · 16 = 150,72 cm².');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Curva: 2πr²; base plana: πr²');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'Total = 3πr² = 3 × 3,14 × 16');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O raio oculto','Uma esfera tem volume 288π cm³. Qual é o raio?','6',20,3) returning id into cid;
insert into game_private.challenges values('enigmas-s5-d3',cid,'enigmas/s5',3,6,0.01,20,array['(4/3)·π·r³ = 288π','r³ = 216'],'r³ = 288 · 3 / 4 = 216 ⇒ r = 6 cm.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'(4/3)·π·r³ = 288π');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'r³ = 216');
end; $seed$;
do $seed$ declare pid bigint; sid bigint; cid bigint; begin
 insert into public.piramides(nome,descricao) values('Pirâmide do Guardião','Céu escuro, mecanismos complexos e o Guardião final.') returning id into pid;
insert into public.salas(piramide_id,nome,descricao,ordem,dificuldade) values(pid,'Câmara dos Sólidos Compostos','Combinação de sólidos',1,3) returning id into sid;
insert into public.codigos(sala_id,codigo) values(sid,'AMN-03');
insert into game_private.rooms values('guardiao/s1',sid,'guardiao',1,'AMN-03',null,'enigmas');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O silo de grãos','Cilindro de raio 3 m e altura 10 m, com cone de mesmo raio e altura 4 m no topo. Qual o volume total? Use π = 3,14.','320.28',30,1) returning id into cid;
insert into game_private.challenges values('guardiao-s1-d1',cid,'guardiao/s1',1,320.28,0.01,30,array['Some os volumes: πr²h + πr²h/3','282,6 + 37,68'],'V = 282,6 + 37,68 = 320,28 m³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Some os volumes: πr²h + πr²h/3');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'282,6 + 37,68');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O bloco perfurado','Cubo de aresta 6 cm com um furo cilíndrico de raio 1 cm atravessando-o de face a face. Qual é o volume restante? Use π = 3,14.','197.16',30,2) returning id into cid;
insert into game_private.challenges values('guardiao-s1-d2',cid,'guardiao/s1',2,197.16,0.01,30,array['Volume do cubo − volume do cilindro (h = 6)','216 − 3,14 × 1 × 6'],'V = 216 − 18,84 = 197,16 cm³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Volume do cubo − volume do cilindro (h = 6)');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'216 − 3,14 × 1 × 6');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A torre do vigia','Cubo de aresta 4 m com uma pirâmide de base 4 m × 4 m e altura 3 m no topo. Qual é o volume total?','80',30,3) returning id into cid;
insert into game_private.challenges values('guardiao-s1-d3',cid,'guardiao/s1',3,80,0.01,30,array['64 + (16 × 3)/3','Pirâmide: 16'],'V = 64 + 16 = 80 m³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'64 + (16 × 3)/3');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'Pirâmide: 16');
insert into public.salas(piramide_id,nome,descricao,ordem,dificuldade) values(pid,'Galeria dos Volumes','Relações entre volumes',2,3) returning id into sid;
insert into public.codigos(sala_id,codigo) values(sid,'SEK-66');
insert into game_private.rooms values('guardiao/s2',sid,'guardiao',2,'SEK-66','guardiao/s1','enigmas');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'Cones e cilindros','Quantos cones cheios são necessários para encher um cilindro de mesma base e mesma altura?','1',30,1) returning id into cid;
insert into game_private.challenges values('guardiao-s2-d1',cid,'guardiao/s2',1,1,0,30,array['Compare πr²h com πr²h/3.','O cone tem 1/3 do volume.'],'Vcone = Vcil / 3 ⇒ 3 cones.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Compare πr²h com πr²h/3.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'O cone tem 1/3 do volume.');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A esfera presa','Uma esfera está inscrita em um cubo de aresta 6 cm. Qual é o volume do espaço vazio? Use π = 3,14.','102.96',30,2) returning id into cid;
insert into game_private.challenges values('guardiao-s2-d2',cid,'guardiao/s2',2,102.96,0.01,30,array['Raio = 3 cm','216 − 4/3 × 3,14 × 27'],'V = 216 − 113,04 = 102,96 cm³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Raio = 3 cm');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'216 − 4/3 × 3,14 × 27');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O dobro do raio','Se o raio de uma esfera dobra, seu volume fica multiplicado por quanto?','8',30,3) returning id into cid;
insert into game_private.challenges values('guardiao-s2-d3',cid,'guardiao/s2',3,8,0.01,30,array['V depende de r³.','2³ = ?'],'(2r)³ = 8r³ ⇒ 8 vezes.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'V depende de r³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'2³ = ?');
insert into public.salas(piramide_id,nome,descricao,ordem,dificuldade) values(pid,'Templo das Alturas','Pitágoras no espaço',3,3) returning id into sid;
insert into public.codigos(sala_id,codigo) values(sid,'PTA-58');
insert into game_private.rooms values('guardiao/s3',sid,'guardiao',3,'PTA-58','guardiao/s2','enigmas');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A lança do faraó','Qual é a diagonal de um paralelepípedo de 3 cm × 4 cm × 12 cm?','13',30,1) returning id into cid;
insert into game_private.challenges values('guardiao-s3-d1',cid,'guardiao/s3',1,13,0.01,30,array['D = √(a² + b² + c²)','√(9 + 16 + 144)'],'D = √169 = 13 cm.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'D = √(a² + b² + c²)');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'√(9 + 16 + 144)');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A altura apagada','Pirâmide quadrangular regular com aresta da base 8 cm e apótema 5 cm. Qual é o volume?','64',30,2) returning id into cid;
insert into game_private.challenges values('guardiao-s3-d2',cid,'guardiao/s3',2,64,0.01,30,array['h² = 5² − 4² ⇒ h = 3','V = 64 × 3 / 3'],'h = 3; V = 8² · 3 / 3 = 64 cm³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'h² = 5² − 4² ⇒ h = 3');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'V = 64 × 3 / 3');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O cone do oráculo','Qual é o volume desse cone? Use π = 3,14.','1004.8',30,3) returning id into cid;
insert into game_private.challenges values('guardiao-s3-d3',cid,'guardiao/s3',3,1004.8,0.01,30,array['h = √(17² − 8²) = 15','V = 3,14 × 64 × 15 / 3'],'V = 3,14 · 64 · 5 = 1004,8 cm³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'h = √(17² − 8²) = 15');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'V = 3,14 × 64 × 15 / 3');
insert into public.salas(piramide_id,nome,descricao,ordem,dificuldade) values(pid,'Câmara dos Mecanismos','Problemas de área e volume',4,3) returning id into sid;
insert into public.codigos(sala_id,codigo) values(sid,'OSR-12');
insert into game_private.rooms values('guardiao/s4',sid,'guardiao',4,'OSR-12','guardiao/s3','enigmas');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O tanque de contrapeso','Tanque cilíndrico de raio 1 m e altura 2 m, com água até 75% da capacidade. Quantos litros há no tanque? Use π = 3,14.','4710',30,1) returning id into cid;
insert into game_private.challenges values('guardiao-s4-d1',cid,'guardiao/s4',1,4710,1,30,array['V = 3,14 × 1 × 2 = 6,28 m³','75% de 6,28 m³, em litros'],'0,75 · 6,28 = 4,71 m³ = 4710 L.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'V = 3,14 × 1 × 2 = 6,28 m³');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'75% de 6,28 m³, em litros');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A caixa sem tampa','Uma caixa sem tampa mede 10 cm × 6 cm de base e 4 cm de altura. Quanto material (área) é necessário?','188',30,2) returning id into cid;
insert into game_private.challenges values('guardiao-s4-d2',cid,'guardiao/s4',2,188,0.01,30,array['Base + 4 laterais (sem tampa)','60 + 2(40) + 2(24)'],'A = 60 + 80 + 48 = 188 cm².');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Base + 4 laterais (sem tampa)');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'60 + 2(40) + 2(24)');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'As três esferas','Um cilindro de raio 3 cm e altura 18 cm contém 3 esferas de raio 3 cm. Qual é o volume livre? Use π = 3,14.','169.56',30,3) returning id into cid;
insert into game_private.challenges values('guardiao-s4-d3',cid,'guardiao/s4',3,169.56,0.01,30,array['Cilindro: 3,14 × 9 × 18 = 508,68','Esferas: 3 × 113,04'],'508,68 − 339,12 = 169,56 cm³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Cilindro: 3,14 × 9 × 18 = 508,68');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'Esferas: 3 × 113,04');
insert into public.salas(piramide_id,nome,descricao,ordem,dificuldade) values(pid,'Salão do Guardião','Desafios integrados',5,3) returning id into sid;
insert into public.codigos(sala_id,codigo) values(sid,'GRD-99');
insert into game_private.rooms values('guardiao/s5',sid,'guardiao',5,'GRD-99','guardiao/s4','enigmas');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'A cápsula do tempo','Cilindro de raio 2 cm e altura 6 cm com uma semiesfera de raio 2 cm em cada ponta. Qual é o volume total? Use π = 3,14. (arredonde para duas casas)','108.85',30,1) returning id into cid;
insert into game_private.challenges values('guardiao-s5-d1',cid,'guardiao/s5',1,108.85,0.1,30,array['Duas semiesferas = uma esfera','75,36 + 4/3 × 3,14 × 8'],'V = 75,36 + 33,49 ≈ 108,85 cm³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Duas semiesferas = uma esfera');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'75,36 + 4/3 × 3,14 × 8');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'Fundição do ouro','Uma esfera de raio 6 cm é derretida e transformada em um cone de raio 6 cm. Qual é a altura do cone?','24',30,2) returning id into cid;
insert into game_private.challenges values('guardiao-s5-d2',cid,'guardiao/s5',2,24,0.01,30,array['(4/3)π·216 = (1/3)π·36·h','288 = 12h'],'288π = 12πh ⇒ h = 24 cm.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'(4/3)π·216 = (1/3)π·36·h');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'288 = 12h');
insert into public.desafios(sala_id,titulo,enunciado,resposta_correta,pontos,ordem) values(sid,'O coração da pirâmide','Cubo de aresta 6 m. Uma pirâmide com base igual a uma face e altura 6 m é retirada. Qual é o volume restante?','144',30,3) returning id into cid;
insert into game_private.challenges values('guardiao-s5-d3',cid,'guardiao/s5',3,144,0.01,30,array['Pirâmide: 36 × 6 / 3 = 72','216 − 72'],'V = 216 − 72 = 144 m³.');
insert into public.dicas(desafio_id,nivel,texto) values(cid,1,'Pirâmide: 36 × 6 / 3 = 72');
insert into public.dicas(desafio_id,nivel,texto) values(cid,2,'216 − 72');
end; $seed$;
-- This file is included in the generated migration after the content seed.
create schema if not exists game_private;
revoke all on schema game_private from public, anon, authenticated;
create table game_private.teacher_allowlist (email text primary key check(email=lower(email)));
alter table game_private.teacher_allowlist enable row level security;
revoke all on game_private.teacher_allowlist from public, anon, authenticated;

-- Profiles may edit names, never their authorization role.
revoke all on public.usuarios, public.piramides, public.salas, public.desafios, public.dicas, public.codigos, public.pontuacoes, public.tentativas, public.progresso_salas from anon, authenticated;
grant select on public.usuarios, public.piramides, public.salas, public.pontuacoes, public.tentativas, public.progresso_salas to authenticated;
alter policy "usuario le proprio perfil" on public.usuarios to authenticated using (id = (select auth.uid()));
alter policy "usuario le tentativas" on public.tentativas to authenticated using (usuario_id = (select auth.uid()));
alter policy "usuario le pontuacoes" on public.pontuacoes to authenticated using (usuario_id = (select auth.uid()));
alter policy "usuario le progresso" on public.progresso_salas to authenticated using (usuario_id = (select auth.uid()));
revoke execute on function public.eh_professor() from public, anon;
grant execute on function public.eh_professor() to authenticated;
revoke update on public.usuarios from anon, authenticated;
grant update (nome) on public.usuarios to authenticated;
revoke insert, update, delete on public.pontuacoes, public.tentativas, public.progresso_salas from anon, authenticated;
-- Answers and room codes are released only by the game API.
revoke select on public.desafios, public.codigos from anon, authenticated;
grant select (id, sala_id, titulo, enunciado, pontos, ordem, ativo, criado_em) on public.desafios to authenticated;

create table public.game_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.game_states enable row level security;
revoke all on public.game_states from anon, authenticated;
grant select on public.game_states to authenticated;
revoke insert, update, delete on public.game_states from anon, authenticated;
create policy own_game on public.game_states for select to authenticated using (user_id = (select auth.uid()));

create table public.turmas (
  id uuid primary key default gen_random_uuid(),
  professor_id uuid not null references public.usuarios(id) on delete cascade,
  nome text not null check (length(trim(nome)) between 1 and 100),
  codigo text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
  criada_em timestamptz not null default now()
);
create table public.turma_alunos (
  turma_id uuid not null references public.turmas(id) on delete cascade,
  aluno_id uuid not null references public.usuarios(id) on delete cascade,
  primary key(turma_id, aluno_id)
);
create index turma_alunos_aluno_idx on public.turma_alunos(aluno_id);
create index turmas_professor_idx on public.turmas(professor_id);
alter table public.turmas enable row level security;
alter table public.turma_alunos enable row level security;
revoke all on public.turmas, public.turma_alunos from anon, authenticated;
grant select, insert on public.turmas to authenticated;
grant select on public.turma_alunos to authenticated;
create policy professor_turmas on public.turmas for select to authenticated using (professor_id = (select auth.uid()));
create policy criar_turma on public.turmas for insert to authenticated with check (
  professor_id = (select auth.uid()) and exists(select 1 from public.usuarios where id = (select auth.uid()) and tipo = 'professor')
);
create policy own_membership on public.turma_alunos for select to authenticated using (aluno_id = (select auth.uid()));

create function game_private.empty_state(p_name text) returns jsonb language sql immutable set search_path = '' as $$
 select jsonb_build_object('name',p_name,'xp',0,'records','{}'::jsonb,'rooms','[]'::jsonb,'codes','{}'::jsonb,'pyramids','[]'::jsonb,'startedAt',null,'finishedAt',null,'streak',0,'lastPlayed',null);
$$;

create function game_private.ensure_player() returns void language plpgsql security definer set search_path = '' as $$
begin
 if auth.uid() is null then raise exception 'Entre na sua conta para jogar.'; end if;
 insert into public.usuarios(id,nome,tipo) values(auth.uid(),coalesce(nullif(trim((select raw_user_meta_data->>'nome' from auth.users where id=auth.uid())),''),'Explorador'),'aluno') on conflict(id) do nothing;
 -- Administrator-maintained allowlist; authorization never trusts user metadata.
 update public.usuarios set tipo='professor' where id=auth.uid() and exists(
   select 1 from auth.users u join game_private.teacher_allowlist t on t.email=lower(u.email)
   where u.id=auth.uid() and u.email_confirmed_at is not null
 );
 insert into public.game_states(user_id,state) select auth.uid(),game_private.empty_state(nome) from public.usuarios where id=auth.uid() on conflict(user_id) do nothing;
end;
$$;

create function game_private.play(p_action text, p_id text default '', p_answer text default '') returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
 s jsonb; rec jsonb; c game_private.challenges%rowtype; r game_private.rooms%rowtype;
 v numeric; ok boolean := false; gain integer := 0; attempts integer; hints integer;
 room_done boolean := false; wrong jsonb; today text := (now() at time zone 'America/Sao_Paulo')::date::text;
begin
 perform game_private.ensure_player();
 select state into s from public.game_states where user_id=auth.uid() for update;
 s := jsonb_set(s,'{name}',to_jsonb((select nome from public.usuarios where id=auth.uid())));
 if p_action = 'load' then return jsonb_build_object('state',s); end if;
 if p_action = 'reset' then
   s := game_private.empty_state(s->>'name');
   delete from public.tentativas where usuario_id=auth.uid();
   delete from public.pontuacoes where usuario_id=auth.uid();
   delete from public.progresso_salas where usuario_id=auth.uid();
 elsif p_action = 'door' then
   if not exists(select 1 from game_private.rooms where pyramid=p_id) then raise exception 'Pirâmide inválida.'; end if;
   if exists(select 1 from game_private.rooms where pyramid=p_id and not (s->'rooms' ? room_key)) then raise exception 'Conclua todas as salas primeiro.'; end if;
   select jsonb_agg(upper(trim(coalesce((p_answer::jsonb)->> (position-1),''))) <> code order by position) into wrong from game_private.rooms where pyramid=p_id;
   if wrong @> '[true]'::jsonb then return jsonb_build_object('state',s,'wrong',wrong); end if;
   if not(s->'pyramids' ? p_id) then
     s := jsonb_set(s,'{pyramids}',(s->'pyramids') || to_jsonb(p_id)); gain := 150;
     insert into public.pontuacoes(usuario_id,pontos,motivo) values(auth.uid(),gain,'Pirâmide '||p_id);
     if jsonb_array_length(s->'pyramids') = 3 then s := jsonb_set(s,'{finishedAt}',to_jsonb(floor(extract(epoch from now())*1000))); end if;
   end if;
 elsif p_action in ('answer','hint') then
   select * into c from game_private.challenges where slug=p_id;
   if not found then raise exception 'Desafio inválido.'; end if;
   select * into r from game_private.rooms where room_key=c.room_key;
   if r.previous_pyramid is not null and not(s->'pyramids' ? r.previous_pyramid) then raise exception 'Pirâmide bloqueada.'; end if;
   if r.previous_room is not null and not(s->'rooms' ? r.previous_room) then raise exception 'Sala bloqueada.'; end if;
   if exists(select 1 from game_private.challenges x where x.room_key=c.room_key and x.position<c.position and not coalesce((s->'records'->x.slug->>'done')::boolean,false)) then raise exception 'Resolva o desafio anterior.'; end if;
   rec := coalesce(s->'records'->p_id,'{"attempts":0,"hints":0,"done":false,"firstTry":false}'::jsonb);
   if (rec->>'done')::boolean then return jsonb_build_object('state',s,'correct',true,'gain',0); end if;
   attempts := (rec->>'attempts')::integer; hints := (rec->>'hints')::integer;
   if p_action = 'hint' then
     hints := least(2,hints+1); rec := jsonb_set(rec,'{hints}',to_jsonb(hints));
   else
     if length(p_answer)>100 or trim(p_answer)='' then raise exception 'Informe uma resposta válida.'; end if;
     begin v := replace(regexp_replace(p_answer,'\s','','g'),',','.')::numeric; exception when invalid_text_representation or numeric_value_out_of_range then v := null; end;
     ok := coalesce(v::text not in ('NaN','Infinity','-Infinity') and abs(v-c.answer) <= c.tolerance+0.000000001,false);
     attempts := attempts+1;
     gain := case when ok then c.xp + case when attempts=1 then 10 else 0 end else 0 end;
     rec := rec || jsonb_build_object('attempts',attempts,'done',ok,'firstTry',ok and attempts=1);
     if ok then rec := rec || jsonb_build_object('answer',c.answer,'explanation',c.explanation); end if;
     insert into public.tentativas(usuario_id,desafio_id,resposta,correta) values(auth.uid(),c.challenge_id,p_answer,ok);
     if gain>0 then insert into public.pontuacoes(usuario_id,desafio_id,pontos,motivo) values(auth.uid(),c.challenge_id,gain,'Desafio resolvido'); end if;
   end if;
   rec := rec || jsonb_build_object('revealedHints',to_jsonb(c.hints[1:hints]));
   s := jsonb_set(s,array['records',p_id],rec);
   if not exists(select 1 from game_private.challenges x where x.room_key=c.room_key and not coalesce((s->'records'->x.slug->>'done')::boolean,false)) and not(s->'rooms' ? c.room_key) then
     s := jsonb_set(s,'{rooms}',(s->'rooms') || to_jsonb(c.room_key));
     s := jsonb_set(s,array['codes',c.room_key],to_jsonb(r.code));
     gain := gain+50; room_done := true;
     insert into public.pontuacoes(usuario_id,pontos,motivo) values(auth.uid(),50,'Sala '||c.room_key);
   end if;
   insert into public.progresso_salas(usuario_id,sala_id,status,iniciado_em,concluido_em,tentativas_total,dicas_usadas)
   values(auth.uid(),r.room_id,case when s->'rooms' ? c.room_key then 'concluida'::public.status_progresso else 'em_andamento'::public.status_progresso end,now(),case when room_done then now() end,attempts,hints)
   on conflict(usuario_id,sala_id) do update set status=excluded.status,concluido_em=coalesce(public.progresso_salas.concluido_em,excluded.concluido_em),
   tentativas_total=(select coalesce(sum((s->'records'->x.slug->>'attempts')::integer),0) from game_private.challenges x where x.room_key=c.room_key),
   dicas_usadas=(select coalesce(sum((s->'records'->x.slug->>'hints')::integer),0) from game_private.challenges x where x.room_key=c.room_key);
 else raise exception 'Ação inválida.';
 end if;
 s := jsonb_set(s,'{xp}',to_jsonb((s->>'xp')::integer+gain));
 if p_action <> 'reset' then
   if s->>'startedAt' is null then s := jsonb_set(s,'{startedAt}',to_jsonb(floor(extract(epoch from now())*1000))); end if;
   if s->>'lastPlayed' is distinct from today then
     s := jsonb_set(s,'{streak}',to_jsonb(case when s->>'lastPlayed'=((now() at time zone 'America/Sao_Paulo')::date-1)::text then coalesce((s->>'streak')::integer,0)+1 else 1 end));
     s := jsonb_set(s,'{lastPlayed}',to_jsonb(today));
   end if;
 end if;
 update public.game_states set state=s,updated_at=now() where user_id=auth.uid();
 return jsonb_build_object('state',s,'correct',ok,'gain',gain,'roomDone',room_done,'wrong',null);
end;
$$;
-- Exposed wrappers are invokers; the private implementations enforce identity and ownership.
grant usage on schema game_private to authenticated;
revoke all on function game_private.empty_state(text), game_private.ensure_player(), game_private.play(text,text,text) from public, anon, authenticated;
grant execute on function game_private.play(text,text,text) to authenticated;
create function public.game_action(p_action text,p_id text default '',p_answer text default '') returns jsonb language sql security invoker set search_path = '' as $$ select game_private.play(p_action,p_id,p_answer); $$;
revoke all on function public.game_action(text,text,text) from public, anon;
grant execute on function public.game_action(text,text,text) to authenticated;

create function game_private.classroom(p_action text,p_value text default '') returns jsonb language plpgsql security definer set search_path = '' as $$
declare t public.turmas%rowtype; result jsonb;
begin
 perform game_private.ensure_player();
 if p_action='join' then
   if (select tipo from public.usuarios where id=auth.uid())<>'aluno' then raise exception 'Apenas alunos entram nas turmas.'; end if;
   select * into t from public.turmas where codigo=upper(trim(p_value));
   if not found then raise exception 'Código de turma inválido.'; end if;
   insert into public.turma_alunos(turma_id,aluno_id) values(t.id,auth.uid()) on conflict do nothing;
 elsif p_action='create' then
   if (select tipo from public.usuarios where id=auth.uid())<>'professor' then raise exception 'Acesso exclusivo do professor.'; end if;
   insert into public.turmas(professor_id,nome) values(auth.uid(),trim(p_value));
 elsif p_action<>'list' then raise exception 'Ação inválida.';
 end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',q.id,'nome',q.nome,'codigo',case when q.professor_id=auth.uid() then q.codigo else null end,
 'alunos',(select coalesce(jsonb_agg(jsonb_build_object('id',u.id,'nome',u.nome,'xp',coalesce((g.state->>'xp')::integer,0),'acertos',coalesce((select count(*) from jsonb_each(g.state->'records') x where (x.value->>'done')::boolean),0),
 'salas',coalesce(jsonb_array_length(g.state->'rooms'),0),'streak',coalesce((g.state->>'streak')::integer,0),'updatedAt',g.updated_at) order by coalesce((g.state->>'xp')::integer,0) desc,u.nome),'[]'::jsonb)
 from public.turma_alunos m join public.usuarios u on u.id=m.aluno_id left join public.game_states g on g.user_id=u.id
 where m.turma_id=q.id and (q.professor_id=auth.uid() or m.aluno_id=auth.uid())))),'[]'::jsonb) into result
 from public.turmas q where q.professor_id=auth.uid() or exists(select 1 from public.turma_alunos m where m.turma_id=q.id and m.aluno_id=auth.uid());
 return result;
end;
$$;
revoke all on function game_private.classroom(text,text) from public, anon;
grant execute on function game_private.classroom(text,text) to authenticated;
create function public.classroom_action(p_action text,p_value text default '') returns jsonb language sql security invoker set search_path = '' as $$ select game_private.classroom(p_action,p_value); $$;
revoke all on function public.classroom_action(text,text) from public, anon;
grant execute on function public.classroom_action(text,text) to authenticated;
