CREATE DATABASE IF NOT EXISTS quadraFacil
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE quadrafacil;

-- =========================
-- Tabela base: usuario
-- =========================
CREATE TABLE usuario (
    idUsuario    INT AUTO_INCREMENT PRIMARY KEY,
    nomeUsuario  VARCHAR(20)  NOT NULL,
    email        VARCHAR(100) NOT NULL UNIQUE,
    senha        VARCHAR(50) NOT NULL,
    fotoPerfil  VARCHAR(255),
    situacao       ENUM('ativo', 'banido') NOT NULL DEFAULT 'ativo',
    criadoEm    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- Subtipos (herança)
-- =========================

CREATE TABLE moderador (
    usuario_id INT PRIMARY KEY,
    FOREIGN KEY (usuario_id) REFERENCES usuario(idUsuario) ON DELETE CASCADE
);

CREATE TABLE usuarioComum (
    usuario_id  INT PRIMARY KEY,
    FOREIGN KEY (usuario_id) REFERENCES usuario(idUsuario) ON DELETE CASCADE
);

CREATE TABLE proprietarioQuadra (
    usuario_id INT PRIMARY KEY,
    CPF        VARCHAR(14)  NOT NULL UNIQUE,
    telefone   VARCHAR(20),
    FOREIGN KEY (usuario_id) REFERENCES usuario(idUsuario) ON DELETE CASCADE
);

-- =========================
-- Amizade
-- =========================
CREATE TABLE amizade (
    usuario1_id INT NOT NULL,
    usuario2_id INT NOT NULL,
    criadaEm   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario1_id, usuario2_id),
    FOREIGN KEY (usuario1_id) REFERENCES usuario(idUsuario) ON DELETE CASCADE,
    FOREIGN KEY (usuario2_id) REFERENCES usuario(idUsuario) ON DELETE CASCADE,
    CHECK (usuario1_id != usuario2_id)
);

-- =========================
-- Esporte (tabela de tags)
-- =========================
CREATE TABLE esporte (
    idEsporte INT AUTO_INCREMENT PRIMARY KEY,
    nome      VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO esporte (nome) VALUES
    ('Futsal'),
    ('Basquete'),
    ('Vôlei'),
    ('Handebol'),
    ('Beach Tennis');

-- =========================
-- Quadra
-- =========================
CREATE TABLE quadra (
    idQuadra INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(150) NOT NULL,
    horario VARCHAR(100) NOT NULL,
    precoAluguel DECIMAL(8, 2),
    tipoAcesso ENUM('publica', 'privada') NOT NULL DEFAULT 'privada',
    situacao ENUM('pendente', 'aprovada', 'recusada', 'banida') NOT NULL DEFAULT 'pendente',
    proprietario_id INT,
    criadaEm TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proprietario_id)
        REFERENCES proprietarioQuadra(usuario_id)
        ON DELETE SET NULL
);

-- =========================
-- Quadra x Esporte (N:N)
-- =========================
CREATE TABLE quadra_esporte (
    quadra_id INT NOT NULL,
    esporte_id INT NOT NULL,
    PRIMARY KEY (quadra_id, esporte_id),
    FOREIGN KEY (quadra_id)  REFERENCES quadra(idQuadra)  ON DELETE CASCADE,
    FOREIGN KEY (esporte_id) REFERENCES esporte(idEsporte) ON DELETE CASCADE
);

-- =========================
-- Fotos da quadra
-- =========================
CREATE TABLE foto (
    idFoto INT AUTO_INCREMENT PRIMARY KEY,
    quadra_id INT NOT NULL,
    urlFoto VARCHAR(255) NOT NULL,
    FOREIGN KEY (quadra_id) REFERENCES quadra(idQuadra) ON DELETE CASCADE
);

-- =========================
-- Avaliação (nota + comentário)
-- =========================
CREATE TABLE avaliacao (
    idAvaliacao INT AUTO_INCREMENT PRIMARY KEY,
    quadra_id   INT NOT NULL,
    usuario_id  INT NOT NULL,
    nota        TINYINT NOT NULL,
    comentario  TEXT,
    criadaEm   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_avaliacao (quadra_id, usuario_id),
    CONSTRAINT chk_nota CHECK (nota BETWEEN 1 AND 5),
    FOREIGN KEY (quadra_id)  REFERENCES quadra(idQuadra)   ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuario(idUsuario) ON DELETE CASCADE
);

-- =========================
-- Denúncia / Inconsistência
-- =========================
CREATE TABLE denuncia (
    idDenuncia  INT AUTO_INCREMENT PRIMARY KEY,
    quadra_id   INT NOT NULL,
    usuario_id  INT NOT NULL,
    descricao   TEXT NOT NULL,
    situacao      ENUM('em_analise', 'resolvida', 'ignorada')
                NOT NULL DEFAULT 'em_analise',
    criadaEm   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quadra_id)  REFERENCES quadra(idQuadra)   ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuario(idUsuario) ON DELETE CASCADE
);

-- =========================
-- Lista de presença
-- =========================
 CREATE TABLE lista_presenca (
    idPresenca     INT AUTO_INCREMENT PRIMARY KEY,
    quadra_id      INT NOT NULL,
    usuario_id     INT NOT NULL,
    horarioMarcado TIMESTAMP NOT NULL,
    UNIQUE KEY unique_presenca (quadra_id, usuario_id, horarioMarcado),
    FOREIGN KEY (quadra_id)  REFERENCES quadra(idQuadra)   ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuario(idUsuario) ON DELETE CASCADE
); 