-- =================================================================
-- V2__create_tokens_email.sql
-- Cria a tabela de tokens para confirmação de e-mail e redefinição
-- de senha. Relacionada à tabela usuarios por FK.
-- =================================================================

CREATE TYPE tipo_token AS ENUM ('CONFIRMAR_EMAIL', 'REDEFINIR_SENHA');

CREATE TABLE tokens_email (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id  UUID        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token       UUID        NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    tipo        tipo_token  NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    usado       BOOLEAN     NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_tokens_email_token     ON tokens_email (token);
CREATE INDEX idx_tokens_email_usuario   ON tokens_email (usuario_id);
