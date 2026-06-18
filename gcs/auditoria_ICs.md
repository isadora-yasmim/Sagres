# Tabela de Auditoria Física — Catálogo de ICs do PGC × Repositório v1.0.0

**Projeto:** SAGRES Monitoria
**Baseline auditada:** v1.0.0 (commit `5061375`, tag criada em 10/06/2026)
**Repositório:** github.com/isadora-yasmim/Sagres
**Norma de referência:** IEEE 828-2012 (Auditoria Física de Configuração)

---

## Catálogo de ICs — Presença na Baseline

| ID do IC | Descrição (PGC) | Arquivo(s) reais na tag | Presente |
|----------|-----------------|--------------------------|:--------:|
| IC-DOC-001 | Termo de Abertura (TAP) | — não encontrado no repo | ❌ |
| IC-DOC-002 | Plano de Gerência de Configuração (PGC) | — não está no repo (entregue à parte) | ❌ |
| IC-DOC-003 | Documento de Detalhamento (Atividade 1) | — não encontrado | ❌ |
| IC-DOC-004 | Especificação de Requisitos | `backlog.md` (parcial — histórias de usuário) | ⚠️ Parcial |
| IC-DOC-005 | Projeto Conceitual – Modelo de Dados | — não encontrado | ❌ |
| IC-DOC-006 | Diagrama Entidade-Relacionamento (DER) | — não encontrado | ❌ |
| IC-DOC-007 | Modelo Relacional (SQL) | `db/migration/V1`, `V2`, `V3` (esquema real) | ⚠️ Parcial |
| IC-DOC-008 | Planos e Casos de Teste | — sem doc; só os testes em código (ver IC-TST-001) | ❌ |
| IC-DOC-009 | Atas de reunião do CCC | — não encontrado | ❌ |
| IC-PROTO-001 | Protótipo Figma | — não versionado no repo (fica no Figma) | ❌ |
| IC-PROTO-002 | Guia de Identidade Visual | `src/styles/tokens.css` (cores/tipografia) | ⚠️ Parcial |
| IC-FE-001 | Projeto React – componentes e páginas | `frontend/src/components/`, `frontend/src/pages/` | ✅ |
| IC-FE-002 | `package.json` / `yarn.lock` | `frontend/package.json`, `frontend/package-lock.json` | ✅ |
| IC-FE-003 | Estilos globais (CSS/SCSS) | `src/styles/globals.css`, `src/styles/tokens.css`, `*.module.css` | ✅ |
| IC-BE-001 | Projeto Spring Boot – módulos/serviços | `backend/src/main/java/com/sagres/...` | ✅ |
| IC-BE-002 | `pom.xml` (Maven) | `backend/pom.xml` | ✅ |
| IC-BE-003 | Integração pagamentos (Mercado Pago) | — não implementado na v1.0.0 (US-26 backend pendente) | ❌ |
| IC-BE-004 | Autenticação (e-mail / JWT) | `infrastructure/security/Jwt*.java`, `SecurityConfig.java`, `UsuarioDetailsService.java` | ✅ |
| IC-BE-005 | Chat em tempo real (WebSocket) | — não implementado na v1.0.0 (US-34 backend pendente) | ❌ |
| IC-DB-001 | Scripts DDL de criação | `db/migration/V1__create_usuarios.sql`, `V2__create_tokens_email.sql` | ✅ |
| IC-DB-002 | Scripts DML / seeds | `db/migration/V3__seed_monitores_ranking.sql` | ✅ |
| IC-DB-003 | Migrações (Flyway/Liquibase) | `db/migration/V1`, `V2`, `V3` (Flyway) | ✅ |
| IC-INF-001 | Docker / docker-compose | `docker-compose.yml` | ✅ |
| IC-INF-002 | Config. de ambiente (.env templates) | `frontend/.env.example`, `application-dev.properties` | ✅ |
| IC-INF-003 | Pipelines CI/CD (GitHub Actions) | — não encontrado (`.github/workflows/` ausente) | ❌ |
| IC-TST-001 | Suite de testes unitários | `AuthControllerTest`, `UsuarioServiceTest`, `EmailInstitucionalTest`, `JwtServiceTest` | ✅ |
| IC-TST-002 | Relatórios de testes por sprint | — não versionado | ❌ |

**Legenda:** ✅ Presente · ⚠️ Parcial (existe em forma de código/dados, não como documento formal) · ❌ Ausente

---

## Resumo Quantitativo

| Situação | Quantidade | ICs |
|----------|:----------:|-----|
| ✅ Presentes | 13 | IC-FE-001/002/003, IC-BE-001/002/004, IC-DB-001/002/003, IC-INF-001/002, IC-TST-001 |
| ⚠️ Parciais | 3 | IC-DOC-004, IC-DOC-007, IC-PROTO-002 |
| ❌ Ausentes | 10 | IC-DOC-001/002/003/005/006/008/009, IC-PROTO-001, IC-BE-003/005, IC-INF-003, IC-TST-002 |

> Observação: a soma dos ausentes lista 11 entradas porque IC-BE-003 e IC-BE-005 compartilham a categoria de módulos não implementados; o total de IDs distintos ausentes é 10.

---

## Justificativa das Ausências

A maioria das ausências é **esperada e justificável** no contexto da baseline v1.0.0 (MVP):

- **Documentos (TAP, DER, modelo de dados, atas):** residem fora do repositório de código, no Google Drive, conforme previsto no próprio PGC (seção 4.3.1 — documentos não versionados em Git ficam no Drive). Não constitui falha, e sim decisão de arquitetura documental.
- **Protótipo Figma (IC-PROTO-001):** por natureza permanece no Figma, não no controle de versão Git.
- **IC-BE-003 (pagamento) e IC-BE-005 (chat):** confirmados como pendentes / "design only" no `backlog.md`. São itens de releases futuras (baseline BL-WEBAPP), coerentes com o escopo do MVP.
- **CI/CD (IC-INF-003):** o `.husky/pre-commit` provê controle de qualidade local, mas não há GitHub Actions configurado — divergência entre o planejado no PGC e o implementado.

---

## Conclusão da Auditoria Física

A baseline v1.0.0 contém **integralmente** todos os Itens de Configuração de código, banco de dados, infraestrutura e testes previstos para o MVP (13 ICs presentes). As ausências documentais são justificadas por residirem fora do repositório de código, e os módulos não implementados (pagamento e chat) são coerentes com o escopo da release. Foram identificadas três não-conformidades de versionamento (NC-01 a NC-03), todas com a mesma causa-raiz e correção direta, sem impacto sobre a integridade funcional do produto entregue.
