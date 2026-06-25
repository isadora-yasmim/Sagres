# VDD — Version Description Document
## Projeto SAGRES Monitoria — v1.0.0

**Documento:** Version Description Document (VDD)
**Baseline:** `v1.0.0` (BL-MVP)
**Responsável:** Ana Luísa Pereira dos Santos
**Data de consolidação:** 18-06-2026
**Disciplina:** Gerência de Configuração de Software — 2026/1 · INF/UFG · Profª Sofia Costa Paiva

---

## 1. Identificação da Baseline

| Campo | Valor |
|-------|-------|
| Identificador da baseline | `v1.0.0` (rótulo simbólico: BL-MVP) |
| Hash do commit (curto) | `5061375` |
| Hash do commit (completo) | `506137595e3b3d884f9c8eb30aa635bb0b2dadc4` |
| Data/hora do commit | 2026-06-10 16:30:23 -0300 |
| Mensagem do commit | `Merge branch 'develop' into main — release v1.0.0` |
| Branch de origem | `main` |
| Repositório | https://github.com/isadora-yasmim/Sagres |
| Total de arquivos versionados | 123 |
| Responsável pela GC / criação da tag | Isadora Yasmin da Silva  |
| Ambiente de build | Java 21 (Spring Boot 3.3.0) · Node.js 18 (Vite/React) · PostgreSQL 16 · Docker |

---

## 2. Inventário de Modificações

### 2.1 Matriz de Rastreabilidade (Issues × Commits)

| Issue # | Tipo | Descrição | Commits referenciados | Status |
|---------|------|-----------|----------------------|--------|
| #1 | feat | Backend — Autenticação e Cadastro (cadastro, login JWT, confirmação de e-mail, recuperação de senha, Flyway, testes unitários) | `5061375` (merge release) | ✅ Fechada |
| #2 | feat | Frontend — Design System e Autenticação (tokens CSS, componentes, telas de auth, AuthContext, PrivateRoute, authService.js) | `5061375` (merge release) | ✅ Fechada |
| #3 | feat | Frontend — Landing Page e Ranking (hero, seções públicas, ranking dinâmico, skeleton, responsividade) | `5061375` (merge release) | ✅ Fechada |
| #4 | feat | Infraestrutura (monorepo, Docker, variáveis de ambiente, ESLint, Prettier, Husky, proteção da branch main) | `5061375` (merge release) | ✅ Fechada |
| #5 | feat | Dashboard do Usuário (KPIs aluno/monitor, alternância de visão, resumo de desempenho) | `5061375` (merge release) | ✅ Fechada |

### 2.2 Novas Funcionalidades (feat)

| Tipo | Descrição | Referência |
|------|-----------|------------|
| feat | Cadastro de usuários com validação de e-mail institucional UFG | Issue #1 |
| feat | Confirmação de e-mail via token UUID com expiração de 24h | Issue #1 |
| feat | Login com autenticação JWT e verificação de senha via BCrypt | Issue #1 |
| feat | Recuperação e redefinição de senha com token de validade de 1h | Issue #1 |
| feat | Reenvio de e-mail de confirmação com invalidação de tokens anteriores | Issue #1 |
| feat | Integração de envio de e-mail via Spring Mail + Mailpit | Issue #1 |
| feat | Migrações de banco de dados versionadas com Flyway (V1, V2, V3) | Issue #1 |
| feat | Endpoint público `GET /api/public/ranking-semana` (top 5 monitores) | Issue #1 |
| feat | Testes unitários com JUnit 5 + Mockito | Issue #1 |
| feat | Design system com tokens CSS (cores, tipografia Bricolage Grotesque + Mulish) | Issue #2 |
| feat | Componentes reutilizáveis: Button, Input, PasswordStrengthBar, Alert, AuthLayout | Issue #2 |
| feat | Telas de cadastro, confirmação, login, esqueci-senha e nova-senha | Issue #2 |
| feat | Contexto de autenticação (AuthContext) com persistência de JWT | Issue #2 |
| feat | Roteamento protegido via PrivateRoute | Issue #2 |
| feat | Landing page pública com seções Hero, Como Funciona, Para Monitores e Footer | Issue #3 |
| feat | Ranking dinâmico integrado à API pública com skeleton e tratamento de erro | Issue #3 |
| feat | Layout responsivo (mobile 375px, tablet 768px, desktop 1280px) | Issue #3 |
| feat | Dashboard do aluno com KPIs e dashboard do monitor com solicitações | Issue #5 |
| feat | Alternância de visão Aluno/Monitor no dashboard | Issue #5 |
| feat | Estrutura de monorepo (/backend + /frontend) com Docker e Mailpit | Issue #4 |
| feat | ESLint, Prettier, .editorconfig e Husky + lint-staged | Issue #4 |

### 2.3 Mudanças de Infraestrutura e Segurança (chore/security)

| Tipo | Descrição | Referência |
|------|-----------|------------|
| security | Spring Security com filtro JWT (JwtAuthFilter) | Issue #1/#4 |
| security | Senhas armazenadas com hash BCrypt | Issue #1 |
| security | Feedback genérico na recuperação de senha | Issue #1 |
| security | CORS restrito a `http://localhost:5173` em dev | Issue #4 |
| security | Secrets mantidos fora do controle de versão (.gitignore) | Issue #4 |
| chore | Proteção da branch main (merge apenas via Pull Request) | Issue #4 |
| docs | CHANGELOG.md criado e commitado na raiz | `9191e54` |
| docs | Tabela de auditoria de ICs (auditoria_ICs.md) | `d443fd5` |
| docs | Nota de análise do SBOM (nota-analise-sbom.md) | `b88d7fa` |
| docs | Relatório de Auditoria Física e hashes SHA-256 | `fe3cf2a` |

---

## 3. Composição do Software / SBOM

### 3.1 Referência ao SBOM

O inventário completo de dependências da baseline `v1.0.0` está registrado no arquivo
`sbom.json` (raiz do repositório), gerado por **Júlia de Souza Nascimento** com a ferramenta
**Trivy 0.71.1** no formato **CycloneDX 1.7 (JSON)**:

```
trivy fs --format cyclonedx --output sbom.json --offline-scan .
```

**Identificação do SBOM:**
- `serialNumber`: URN/UUID único do documento
- `version`: versão do documento CycloneDX
- `metadata.timestamp`: data/hora de geração (UTC)
- `metadata.tools.components`: `name=trivy`, `version=0.71.1`, `group=aquasecurity`
- `metadata.component`: componente-raiz (diretório auditado)

### 3.2 Composição das Dependências

O repositório é um **monorepo** com dois ecossistemas escaneados simultaneamente pelo Trivy:

| Ecossistema | Manifesto | Dependências encontradas |
|-------------|-----------|:------------------------:|
| npm (frontend) | `frontend/package.json` + `package-lock.json` | 35 |
| Maven (backend) | `backend/pom.xml` | 12 |
| **Total** | — | **47 libraries + 2 applications** = **49 componentes** |

Cada componente contém os campos `bom-ref`, `name`, `version`, `type` e `purl`
(ex.: `pkg:npm/agent-base@6.0.2`, `pkg:maven/br.ufg/sagres@0.0.1-SNAPSHOT`).
O campo `licenses` está presente em 35 dos 49 componentes (majoritariamente npm, ex.: `MIT`).
A seção `dependencies` (50 nós) descreve o grafo de relacionamento entre os componentes.

**Limitações do SBOM gerado:**
- Campo `hashes` por componente não populado (esperado para scan de manifestos sem build)
- Dependências transitivas do Maven não capturadas (versões herdadas do parent `spring-boot-starter-parent` não resolvidas sem build)
- Campo `vulnerabilities` vazio (Trivy executado sem `--scanners vuln`; análise na Seção 4)
- Dependências de desenvolvimento/teste suprimidas por padrão

### 3.3 Hashes SHA-256 dos Artefatos da Baseline

Gerados por **Verônica Ribeiro Oliveira Palmeira** (Auditora de Configuração) via
`Get-FileHash -Algorithm SHA256` (PowerShell). Arquivo completo em `gcs/hashes.txt`.

| Artefato | SHA-256 |
|----------|---------|
| `sbom.json` | `FEB8F46E99F4FFDA0144DE49065710B7D73EA1A6B2FE45D9340E42E2A8C41C97` |
| `frontend/package.json` | `8C9C54ACA1B49B7467C1113839341ABCECE6654E049CA1D8618CC1FB3EAD6B9B` |
| `backend/pom.xml` | `6FBD0FC8083DCA2C11FBBD400EBA2EFE6828084C77D9947549413563132DC1AC` |
| `CHANGELOG.md` | `4B8B005CB267AB5819E4531D5D42AB9AAFAAA79A6C2D69184E703A6048228036` |
| `gcs/auditoria_ICs.md` | `1F7AED797620628AB1EEA46DDA70FD089C707972E279D2DD8CB000FD6ADD8874` |
| `gcs/nota-analise-sbom.md` | `5E7B661D16E36DF2EA261830B290B35FCC328EBD6E080B29A154B3D5664ABDE8` |
| `gcs/relatorio-auditoria.md` | `CADC39FF99197C0060CD1B06C407CBE319A5E3C15E03C96E32B3D437B4276F87` |
| `gcs/VDD.md` (este documento) | `41966B6A7C15A8CACC7CACF8C4E66E594D7EB94710C5AAE27A778BC87E51ECBF` |

### 3.4 Hash SHA-256 do VDD.md

Após a finalização deste documento, o hash foi gerado e adicionado ao `gcs/hashes.txt`:

```powershell
Get-FileHash VDD.md -Algorithm SHA256
```

| Artefato | SHA-256 |
|----------|---------|
| `gcs/VDD.md` | *41966B6A7C15A8CACC7CACF8C4E66E594D7EB94710C5AAE27A778BC87E51ECBF* |

---

## 4. Problemas Conhecidos e Limitações

### 4.1 Funcionalidades Pendentes para Releases Futuras

As seguintes funcionalidades estavam previstas no backlog mas **não foram implementadas
na v1.0.0**, sendo coerentes com o escopo do MVP:

| ID | Funcionalidade | Motivo da ausência |
|----|---------------|-------------------|
| US-05 | Persistência de sessão entre reaberturas (refresh token) | Escopo de release futura |
| US-10 | Onboarding guiado no primeiro acesso | Escopo de release futura |
| US-26 (IC-BE-003) | Integração de pagamentos — Mercado Pago | Escopo de release futura |
| US-34 (IC-BE-005) | Chat em tempo real — WebSocket | Escopo de release futura |
| — | Busca e filtro de monitores | Escopo de release futura (Épicos 3–9) |
| — | Agendamento de monitorias | Escopo de release futura |
| — | Sistema de avaliações | Escopo de release futura |

### 4.2 Vulnerabilidades Conhecidas nas Dependências

O SBOM gerado pelo Trivy foi executado sem a flag `--scanners vuln`, portanto o campo
`vulnerabilities` do `sbom.json` está vazio. A vulnerabilidade identificada na auditoria
do npm (`1 high severity vulnerability` reportada por `npm audit`) permanece na v1.0.0
pelos seguintes motivos:

| Situação | Justificativa |
|----------|---------------|
| Dependência transitiva identificada pelo npm audit | Depende de uma versão específica fixada por outra biblioteca; atualização unilateral pode quebrar compatibilidade |
| Sem patch disponível no momento da release | A correção está pendente no pacote upstream |
| Risco aceito para o MVP | O ambiente de desenvolvimento não expõe a vulnerabilidade ao público; será tratada antes de qualquer deploy em produção |

### 4.3 Não-Conformidades de Configuração

Conforme registrado no Relatório de Auditoria Física (`gcs/relatorio-auditoria.md`):

| ID | Descrição | Impacto |
|----|-----------|---------|
| NC-01 | Ausência de pipeline CI/CD (IC-INF-003) — `.github/workflows/` não presente; controle de qualidade apenas local via Husky | Documental; sem impacto funcional |
| NC-02 | Documentos de engenharia (TAP, DER, modelo de dados, atas do CCC) fora do Git, no Drive | Decisão arquitetural documentada no PGC; sem impacto na integridade do código |
| OBS-01 | Catálogo lista 27 ICs distintos; enunciado/PGC referencia 26 | Discrepância documental; recomenda-se reconciliação em release futura |

---

## Apêndice — Responsáveis por Artefato

| Artefato | Responsável | Papel |
|----------|-------------|-------|
| Clone, checkout da tag, Issues, CHANGELOG.md, auditoria_ICs.md | Isadora Yasmin da Silva | Release Manager |
| sbom.json, nota-analise-sbom.md | Júlia de Souza Nascimento | Engenheira de SBOM |
| relatorio-auditoria.md, hashes.txt | Verônica Ribeiro Oliveira Palmeira | Auditora de Configuração |
| **VDD.md (este documento)** | **Ana Luísa Pereira dos Santos** | **Gerente de Documentação** |