CREATE DATABASE sistema_quadra;
USE sistema_quadra;

-- =========================
-- Tabela usuario
-- =========================
CREATE TABLE usuario (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nomeUsuario VARCHAR(200) NOT NULL,
    banido BOOLEAN DEFAULT FALSE
);

-- =========================
-- Subtipos (herança)
-- =========================
CREATE TABLE administrador (
    usuario_id INT PRIMARY KEY,
    FOREIGN KEY (usuario_id) REFERENCES usuario(idUsuario)
        ON DELETE CASCADE
);

CREATE TABLE usuarioComum (
    usuario_id INT PRIMARY KEY,
    FOREIGN KEY (usuario_id) REFERENCES usuario(idUsuario)
        ON DELETE CASCADE
);

CREATE TABLE proprietarioQuadra (
    usuario_id INT PRIMARY KEY,
    CPF VARCHAR(14) UNIQUE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(idUsuario)
        ON DELETE CASCADE
);

-- =========================
-- Amizade (sem duplicidade)
-- =========================
CREATE TABLE amizade (
    usuario1_id INT,
    usuario2_id INT,
    PRIMARY KEY (usuario1_id, usuario2_id),

    FOREIGN KEY (usuario1_id) REFERENCES usuario(idUsuario)
        ON DELETE CASCADE,
    FOREIGN KEY (usuario2_id) REFERENCES usuario(idUsuario)
        ON DELETE CASCADE,

    -- Garante que (1,2) e (2,1) nao coexistam
    CHECK (usuario1_id < usuario2_id)
);

-- =========================
-- Quadra (corrigida)
-- =========================
CREATE TABLE quadra (
    idQuadra INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    endereco VARCHAR(100) NOT NULL,

    proprietario_id INT,
    FOREIGN KEY (proprietario_id)
        REFERENCES proprietarioQuadra(usuario_id)
        ON DELETE SET NULL
);