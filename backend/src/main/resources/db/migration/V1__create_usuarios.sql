-- =================================================================
-- V1__create_usuarios.sql
-- Cria a tabela principal de usuários do SAGRES (alunos e monitores)
-- =================================================================

CREATE TYPE role_usuario AS ENUM ('ALUNO', 'MONITOR');

CREATE TABLE usuarios (
    id                   UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_completo        VARCHAR(150)  NOT NULL,
    email_institucional  VARCHAR(100)  NOT NULL UNIQUE,
    senha_hash           VARCHAR(255)  NOT NULL,
    email_confirmado     BOOLEAN       NOT NULL DEFAULT FALSE,
    role                 role_usuario  NOT NULL DEFAULT 'ALUNO',
    data_cadastro        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usuarios_email ON usuarios (email_institucional);
