-- V3__seed_monitores_ranking.sql
-- 5 monitores de seed para popular o ranking público desde o início.
-- Todas as senhas: Monitor@123
-- Hash BCrypt gerado com strength 12.

INSERT INTO usuarios (id, email_institucional, nome_completo, senha_hash, role, email_confirmado) VALUES
(
    gen_random_uuid(),
    'carlos.solrac@discente.ufg.br',
    'Carlos Solrac',
    '$2a$12$pEUPb7rwZVcK8pDX3.MrjuEXS8SHPkpTvDCp0xUj/FdKz5Hzaz1Ei',
    'MONITOR',
    TRUE
),
(
    gen_random_uuid(),
    'ana.beatriz@discente.ufg.br',
    'Ana Beatriz Rocha',
    '$2a$12$pEUPb7rwZVcK8pDX3.MrjuEXS8SHPkpTvDCp0xUj/FdKz5Hzaz1Ei',
    'MONITOR',
    TRUE
),
(
    gen_random_uuid(),
    'pedro.henrique@discente.ufg.br',
    'Pedro Henrique Lima',
    '$2a$12$pEUPb7rwZVcK8pDX3.MrjuEXS8SHPkpTvDCp0xUj/FdKz5Hzaz1Ei',
    'MONITOR',
    TRUE
),
(
    gen_random_uuid(),
    'camila.souza@discente.ufg.br',
    'Camila Souza',
    '$2a$12$pEUPb7rwZVcK8pDX3.MrjuEXS8SHPkpTvDCp0xUj/FdKz5Hzaz1Ei',
    'MONITOR',
    TRUE
),
(
    gen_random_uuid(),
    'jose.bezerra@discente.ufg.br',
    'José Bezerra',
    '$2a$12$pEUPb7rwZVcK8pDX3.MrjuEXS8SHPkpTvDCp0xUj/FdKz5Hzaz1Ei',
    'MONITOR',
    TRUE
)
ON CONFLICT (email_institucional) DO NOTHING;
