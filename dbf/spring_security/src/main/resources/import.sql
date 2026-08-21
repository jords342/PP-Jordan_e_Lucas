-- ============================
-- USUÁRIOS
-- ============================

INSERT INTO tb_usuario (id, login, senha, perfil) VALUES (1, 'admin', '123456', 'ADMINISTRADOR');
INSERT INTO tb_usuario (id, login, senha, perfil) VALUES (2, 'joao', '123456', 'TREINADOR');
INSERT INTO tb_usuario (id, login, senha, perfil) VALUES (3, 'maria', '123456', 'TREINADOR');
INSERT INTO tb_usuario (id, login, senha, perfil) VALUES (4, 'gestor', '123456', 'ADMINISTRADOR');

-- ============================
-- MODALIDADES
-- ============================

INSERT INTO tb_modalidade (id, descricao, limite_jogadores) VALUES (1, 'Futebol', 23);
INSERT INTO tb_modalidade (id, descricao, limite_jogadores) VALUES (2, 'Basquete', 15);
INSERT INTO tb_modalidade (id, descricao, limite_jogadores) VALUES (3, 'Voleibol', 14);
INSERT INTO tb_modalidade (id, descricao, limite_jogadores) VALUES (4, 'Handebol', 16);

-- ============================
-- EQUIPES
-- ============================

INSERT INTO tb_equipe (id, nome, modalidade_id, usuario_id) VALUES (1, 'DS1', 1, 2);
INSERT INTO tb_equipe (id, nome, modalidade_id, usuario_id) VALUES (2, 'DS2', 2, 3);
INSERT INTO tb_equipe (id, nome, modalidade_id, usuario_id) VALUES (3, 'DS3', 3, 2);
INSERT INTO tb_equipe (id, nome, modalidade_id, usuario_id) VALUES (4, 'DS4', 4, 3);


-- ============================
-- JOGADORES
-- ============================

INSERT INTO tb_jogador (id, nome, numero, equipe_id, url_imagem) VALUES (1, 'Carlos Silva', 10, 1, 'https://img.cdndsgni.com/preview/13786137-m.jpg');
INSERT INTO tb_jogador (id, nome, numero, equipe_id, url_imagem) VALUES (2, 'Pedro Souza', 8, 2, 'https://img.cdndsgni.com/preview/13786137-m.jpg');
INSERT INTO tb_jogador (id, nome, numero, equipe_id, url_imagem) VALUES (3, 'Lucas Oliveira', 7, 3, 'https://img.cdndsgni.com/preview/13786137-m.jpg');
INSERT INTO tb_jogador (id, nome, numero, equipe_id, url_imagem) VALUES (4, 'Rafael Santos', 9, 4, 'https://img.cdndsgni.com/preview/13786137-m.jpg');

