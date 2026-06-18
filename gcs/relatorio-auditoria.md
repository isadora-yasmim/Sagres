# Relatório de Auditoria de Configuração — SAGRES Monitoria

**Documento:** Relatório de Auditoria Física de Configuração (FCA)
**Baseline:** `v1.0.0` (BL-MVP)
**Norma de referência:** IEEE 828-2012 · ISO/IEC/IEEE 12207 (Auditoria de Configuração)
**Auditor responsável:** Verônica Ribeiro Oliveira Palmeira
**Data da auditoria:** 18/06/2026
**Disciplina:** Gerência de Configuração de Software — 2026/1 · INF/UFG · Profª Sofia Costa Paiva

---

## 1. Identificação da Baseline

A baseline auditada é a versão candidata à release identificada de forma única pela
tag anotada do Git, conforme registrado no controle de versão do repositório.

| Campo | Valor |
|-------|-------|
| Identificador da baseline | `v1.0.0` (rótulo simbólico: BL-MVP) |
| Hash do commit (curto) | `5061375` |
| Hash do commit (completo) | `506137595e3b3d884f9c8eb30aa635bb0b2dadc4` |
| Data/hora do commit | 2026-06-10 16:30:23 -0300 |
| Mensagem do commit | `Merge branch 'develop' into main — release v1.0.0` |
| Branch de origem da release | `main` |
| Repositório | github.com/isadora-yasmim/Sagres |
| Total de arquivos versionados na tag | 123 |
| Responsável pela GC / criação da tag | Isadora Yasmin da Silva (Release Manager) |
| Ambiente de build | Java 21 (Spring Boot) · Node.js 18 (Vite/React) · PostgreSQL 16 · Docker |

> **Evidências de identificação (comandos executados):**
> - `git rev-parse v1.0.0` → `506137595e3b3d884f9c8eb30aa635bb0b2dadc4`
> - `git log -1 --format='%H %ai %s' v1.0.0` → confirma data, autor e mensagem acima
> - `git ls-tree -r --name-only v1.0.0 | wc -l` → 123 arquivos

---

## 2. Escopo da Auditoria

Esta auditoria é **física (FCA — Functional/Physical Configuration Audit)** e tem por
objetivo verificar a **proveniência e a integridade** do produto entregue na baseline
`v1.0.0`, assegurando que o conteúdo efetivamente versionado corresponde ao conjunto de
Itens de Configuração (ICs) previstos no Plano de Gerência de Configuração (PGC).

São objetos desta auditoria:

1. **Conferência de presença dos ICs** — cruzamento do catálogo de ICs do PGC com os
   arquivos efetivamente presentes na tag `v1.0.0` (insumo entregue por Isadora Yasmin da
   Silva em `gcs/auditoria_ICs.md` e reverificado de forma independente por Verônica Ribeiro
   Oliveira Palmeira via `git ls-tree`).
2. **Integridade do checkout** — confirmação de que nenhum arquivo da árvore de trabalho
   foi alterado após a recuperação da baseline (`git status`).
3. **Geração de hashes criptográficos SHA-256** dos artefatos de configuração, garantindo
   a verificação de integridade independente do Git (`gcs/hashes.txt`).

**Fora do escopo:** auditoria funcional dinâmica (execução de testes/aceitação) e análise
de vulnerabilidades de dependências (tratada separadamente no SBOM por Júlia de Souza
Nascimento e consolidada na seção "Problemas Conhecidos" do VDD por Ana Luísa Pereira dos
Santos). A inspeção da estrutura do SBOM está documentada em `gcs/nota-analise-sbom.md`
(Júlia de Souza Nascimento).

---

## 3. Resultado da Auditoria Física (Catálogo de ICs)

Cruzamento do catálogo de ICs do PGC com os arquivos reais da tag `v1.0.0`. A coluna
"Presente" foi **reverificada de forma independente** por Verônica Ribeiro Oliveira Palmeira contra a árvore da tag
(`git ls-tree -r v1.0.0`).

| ID do IC | Descrição (PGC) | Evidência na tag v1.0.0 | Situação |
|----------|-----------------|--------------------------|:--------:|
| IC-DOC-001 | Termo de Abertura (TAP) | fora do repositório (Drive) | ❌ Ausente |
| IC-DOC-002 | Plano de Gerência de Configuração (PGC) | fora do repositório (Drive) | ❌ Ausente |
| IC-DOC-003 | Documento de Detalhamento (Atividade 1) | fora do repositório (Drive) | ❌ Ausente |
| IC-DOC-004 | Especificação de Requisitos | `backlog.md` (histórias de usuário) | ⚠️ Parcial |
| IC-DOC-005 | Projeto Conceitual — Modelo de Dados | fora do repositório (Drive) | ❌ Ausente |
| IC-DOC-006 | Diagrama Entidade-Relacionamento (DER) | fora do repositório (Drive) | ❌ Ausente |
| IC-DOC-007 | Modelo Relacional (SQL) | `backend/.../db/migration/V1,V2,V3` | ⚠️ Parcial |
| IC-DOC-008 | Planos e Casos de Teste | só testes em código (ver IC-TST-001) | ❌ Ausente |
| IC-DOC-009 | Atas de reunião do CCC | fora do repositório (Drive) | ❌ Ausente |
| IC-PROTO-001 | Protótipo Figma | hospedado no Figma (não versionável em Git) | ❌ Ausente |
| IC-PROTO-002 | Guia de Identidade Visual | `frontend/src/styles/tokens.css` | ⚠️ Parcial |
| IC-FE-001 | Projeto React — componentes e páginas | `frontend/src/components/`, `frontend/src/pages/` | ✅ Presente |
| IC-FE-002 | `package.json` / lockfile | `frontend/package.json`, `frontend/package-lock.json` | ✅ Presente |
| IC-FE-003 | Estilos globais (CSS) | `frontend/src/styles/globals.css`, `tokens.css`, `*.module.css` | ✅ Presente |
| IC-BE-001 | Projeto Spring Boot — módulos/serviços | `backend/src/main/java/com/sagres/...` | ✅ Presente |
| IC-BE-002 | `pom.xml` (Maven) | `backend/pom.xml` | ✅ Presente |
| IC-BE-003 | Integração de pagamentos (Mercado Pago) | não implementado na v1.0.0 (US-26) | ❌ Ausente |
| IC-BE-004 | Autenticação (e-mail / JWT) | `infrastructure/security/Jwt*.java`, `SecurityConfig.java`, `UsuarioDetailsService.java` | ✅ Presente |
| IC-BE-005 | Chat em tempo real (WebSocket) | não implementado na v1.0.0 (US-34) | ❌ Ausente |
| IC-DB-001 | Scripts DDL de criação | `db/migration/V1__create_usuarios.sql`, `V2__create_tokens_email.sql` | ✅ Presente |
| IC-DB-002 | Scripts DML / seeds | `db/migration/V3__seed_monitores_ranking.sql` | ✅ Presente |
| IC-DB-003 | Migrações (Flyway) | `db/migration/V1`, `V2`, `V3` | ✅ Presente |
| IC-INF-001 | Docker / docker-compose | `docker-compose.yml` | ✅ Presente |
| IC-INF-002 | Config. de ambiente (templates) | `frontend/.env.example`, `backend/src/main/resources/application.properties` | ✅ Presente |
| IC-INF-003 | Pipelines CI/CD (GitHub Actions) | `.github/workflows/` ausente (há apenas `.husky/pre-commit`) | ❌ Ausente |
| IC-TST-001 | Suite de testes unitários | `AuthControllerTest`, `UsuarioServiceTest`, `EmailInstitucionalTest`, `JwtServiceTest` | ✅ Presente |
| IC-TST-002 | Relatórios de testes por sprint | não versionado | ❌ Ausente |

**Legenda:** ✅ Presente · ⚠️ Parcial (existe como código/dados, não como documento formal) · ❌ Ausente

### 3.1 Resumo quantitativo

| Situação | Quantidade | ICs |
|----------|:----------:|-----|
| ✅ Presentes | 12 | IC-FE-001/002/003, IC-BE-001/002/004, IC-DB-001/002/003, IC-INF-001/002, IC-TST-001 |
| ⚠️ Parciais | 3 | IC-DOC-004, IC-DOC-007, IC-PROTO-002 |
| ❌ Ausentes | 12 | IC-DOC-001/002/003/005/006/008/009, IC-PROTO-001, IC-BE-003/005, IC-INF-003, IC-TST-002 |
| **Total catalogado** | **27** | — |

### 3.2 Observações de auditoria (não-conformidades)

- **OBS-01 — Reconciliação de contagem do catálogo.** O enunciado/PGC referencia
  nominalmente **26 ICs**, enquanto o catálogo consolidado entregue por Isadora Yasmin da Silva enumera **27
  IDs distintos**. Recomenda-se reconciliar a contagem oficial do PGC com o catálogo
  consolidado (provável diferença na inclusão das categorias IC-PROTO-* e/ou IC-TST-*).
  *Impacto: documental; sem efeito sobre a integridade funcional do produto.*
- **NC-01 — Ausência de pipeline CI/CD (IC-INF-003).** Não há `.github/workflows/` na
  baseline; o controle de qualidade ocorre apenas localmente via `.husky/pre-commit`.
  Divergência entre o planejado no PGC e o implementado.
- **NC-02 — Documentos de engenharia fora do Git.** TAP, DER, modelo de dados e atas do
  CCC residem no Drive. Coerente com o PGC (documentos não versionados em Git), mas
  registra-se como decisão de arquitetura documental para rastreabilidade.
- **OBS-02 — Módulos de escopo futuro.** IC-BE-003 (pagamentos) e IC-BE-005 (chat) estão
  ausentes por serem itens de releases futuras, confirmados como pendentes em `backlog.md`.
  Coerente com o escopo do MVP (BL-MVP).

---

## 4. Conclusão de Integridade

### 4.1 Verificação de integridade do checkout

A árvore de trabalho recuperada a partir da baseline foi verificada com `git status`,
retornando **`nothing to commit, working tree clean`**, o que confirma que **nenhum
arquivo foi alterado após a recuperação da baseline**. A correspondência entre o rótulo
simbólico e o objeto do Git foi confirmada: `git rev-parse v1.0.0` resolve para o commit
`506137595e3b3d884f9c8eb30aa635bb0b2dadc4`, idêntico ao identificador registrado na Seção 1.

### 4.2 Verificação de integridade por hashes SHA-256

Foram gerados hashes criptográficos SHA-256 dos artefatos de configuração da baseline,
registrados em `gcs/hashes.txt`. Estes hashes permitem verificação de integridade
**independente do Git** (qualquer alteração de byte nos artefatos altera o hash):

| Artefato | SHA-256 (resumo) |
|----------|------------------|
| `sbom.json` | `FEB8F46E…A8C41C97` |
| `frontend/package.json` | `8C9C54AC…3EAD6B9B` |
| `backend/pom.xml` | `6FBD0FC8…132DC1AC` |
| `CHANGELOG.md` | `4B8B005C…48228036` |
| `gcs/auditoria_ICs.md` | `1F7AED79…6ADD8874` |
| `gcs/nota-analise-sbom.md` | `5E7B661D…664ABDE8` |

Valores completos em `gcs/hashes.txt`. O hash de `VDD.md` será acrescentado por Ana Luísa
Pereira dos Santos após a finalização do documento (Prática 12, tarefa 7 da responsável pelo
VDD), pois o VDD é gerado posteriormente.

### 4.3 Parecer final

A baseline `v1.0.0` (commit `5061375`) está **íntegra e rastreável**: o checkout
encontra-se limpo (sem modificações), o identificador simbólico corresponde ao commit
esperado, e os artefatos de configuração possuem hashes SHA-256 registrados para
verificação futura.

Quanto à completude, a baseline contém **integralmente** todos os ICs de código, banco de
dados, infraestrutura e testes previstos para o MVP (12 presentes + 3 parciais). As
ausências são, em sua maioria, **esperadas e justificadas**: documentos de engenharia que
residem fora do Git e módulos (pagamento e chat) planejados para releases futuras. Foram
registradas duas não-conformidades de versionamento (NC-01, NC-02) e duas observações
(OBS-01 de contagem, OBS-02 de escopo), nenhuma delas com impacto sobre a integridade
funcional do produto entregue.

**Conclusão:** a baseline `v1.0.0` é **APROVADA** na auditoria física de configuração, com
as ressalvas documentais registradas na Seção 3.2 para tratamento em release futura.

---

### Apêndice A — Comandos de auditoria executados

```powershell
# Identificação da baseline
git rev-parse v1.0.0
# -> 506137595e3b3d884f9c8eb30aa635bb0b2dadc4
git log -1 --format='%H %ai %s' v1.0.0
# -> 506137595e3b... 2026-06-10 16:30:23 -0300 Merge branch 'develop' into main release v1.0.0

# Contagem de arquivos da baseline (auditoria física)
git ls-tree -r --name-only v1.0.0 | Measure-Object -Line   # -> 123

# Integridade do checkout
git status   # -> nothing to commit, working tree clean

# Hashes SHA-256 (ver gcs/hashes.txt)
Get-FileHash -Algorithm SHA256 sbom.json, frontend/package.json, backend/pom.xml
```

### Apêndice B — Artefatos relacionados

| Artefato | Responsável | Localização |
|----------|-------------|-------------|
| Catálogo de ICs (insumo) | Isadora Yasmin da Silva | `gcs/auditoria_ICs.md` |
| CHANGELOG da release | Isadora Yasmin da Silva | `CHANGELOG.md` |
| SBOM (CycloneDX) | Júlia de Souza Nascimento | `sbom.json` |
| Nota de análise do SBOM | Júlia de Souza Nascimento | `gcs/nota-analise-sbom.md` |
| **Relatório de Auditoria (este documento)** | **Verônica Ribeiro Oliveira Palmeira** | `gcs/relatorio-auditoria.md` |
| **Hashes SHA-256** | **Verônica Ribeiro Oliveira Palmeira** | `gcs/hashes.txt` |
| VDD consolidado | Ana Luísa Pereira dos Santos | `VDD.md` (pendente) |




