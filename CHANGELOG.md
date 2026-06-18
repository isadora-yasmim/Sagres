# Changelog

Todas as mudanças relevantes deste projeto são documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [1.0.0] - 2026-06-10

Primeira versão do SAGRES Monitoria — plataforma web para conexão entre alunos
e monitores da UFG. Esta release corresponde à baseline **BL-MVP** do Plano de
Gerência de Configuração (PGC) e entrega o fluxo completo de autenticação,
landing page pública e dashboard do usuário.

**Tag:** `v1.0.0` · **Commit:** `5061375` · **Branch:** `main`

### Added (Adicionado)

#### Backend — Autenticação e Cadastro (#1)
- Cadastro de usuários com validação de e-mail institucional UFG (`@discente.ufg.br` / `@ufg.br`)
- Confirmação de e-mail via token UUID com expiração de 24h
- Login com autenticação JWT e verificação de senha via BCrypt
- Recuperação e redefinição de senha com token de validade de 1h
- Reenvio de e-mail de confirmação com invalidação de tokens anteriores
- Integração de envio de e-mail via Spring Mail + Mailpit
- Migrações de banco de dados versionadas com Flyway (`V1`, `V2`, `V3`)
- Endpoint público `GET /api/public/ranking-semana` (top 5 monitores)
- Testes unitários com JUnit 5 + Mockito

#### Frontend — Design System e Autenticação (#2)
- Design system com tokens CSS (cores, tipografia Bricolage Grotesque + Mulish)
- Componentes reutilizáveis: Button, Input, PasswordStrengthBar, Alert, AuthLayout
- Telas de cadastro, confirmação de e-mail, login, esqueci-senha e nova-senha
- Validação client-side de e-mail UFG e senha forte
- Contexto de autenticação (`AuthContext`) com persistência de JWT
- Roteamento protegido via `PrivateRoute`
- Cliente HTTP (`authService.js`) com interceptors de autenticação e tratamento de 401

#### Frontend — Landing Page e Ranking (#3)
- Landing page pública com seções Hero, Como Funciona, Para Monitores e Footer
- Ranking dinâmico de monitores integrado à API pública
- Loading skeleton e tratamento de erro de rede no ranking
- Scroll suave para âncoras internas
- Layout responsivo (mobile 375px, tablet 768px, desktop 1280px)

#### Dashboard do Usuário (#5)
- Dashboard do aluno com KPIs (próximas monitorias, pendentes, avaliações, nota média)
- Dashboard do monitor com solicitações recebidas e ações rápidas
- Alternância de visão Aluno/Monitor
- Resumo de desempenho do monitor (ranking, ganhos, monitorias realizadas)

#### Infraestrutura (#4)
- Estrutura de monorepo (`/backend` + `/frontend`)
- `docker-compose.yml` com PostgreSQL 16 e Mailpit
- Configuração de variáveis de ambiente (`application-dev.properties`, `.env.example`)
- ESLint, Prettier e `.editorconfig` para padronização de código
- Husky + lint-staged para verificação no pre-commit
- Proteção da branch `main` (merge apenas via Pull Request)

### Security (Segurança)
- Spring Security configurado com filtro JWT (`JwtAuthFilter`)
- Rotas públicas restritas a `/api/auth/**` e `/api/public/**`
- Senhas armazenadas com hash BCrypt
- Feedback genérico na recuperação de senha (não revela se o e-mail existe)
- Secrets mantidos fora do controle de versão (`.gitignore`)
- CORS restrito a `http://localhost:5173` em ambiente de desenvolvimento

### Known Issues (Problemas Conhecidos)
- Persistência de sessão entre reaberturas (refresh token) ainda não implementada (US-05)
- Onboarding guiado no primeiro acesso pendente (US-10)
- Funcionalidades de busca, agendamento, pagamento, chat e avaliação previstas
  para releases futuras (Épicos 3 a 9 do backlog)

---

<!--
  GUIA DE MANUTENÇÃO (remover em produção, se desejar)

  Ao preparar uma nova release, adicione uma nova seção [X.Y.Z] - AAAA-MM-DD
  no TOPO do arquivo, acima da versão anterior. Use os tipos:

  - Added       → para novas funcionalidades
  - Changed     → para mudanças em funcionalidades existentes
  - Deprecated  → para funcionalidades que serão removidas em breve
  - Removed     → para funcionalidades removidas
  - Fixed       → para correção de bugs
  - Security    → para correções de vulnerabilidades

  Sempre referencie o número da Issue (#N) ou Pull Request entre parênteses
  para manter a rastreabilidade exigida pelo PGC (seção 4.1.3 — Status Accounting).
-->

[1.0.0]: https://github.com/isadora-yasmim/Sagres/releases/tag/v1.0.0
