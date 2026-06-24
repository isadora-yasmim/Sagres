# Relatório Técnico — Gerência de Configuração de Software
## Etapa 2: SBOM, VDD e Script de Build

**Projeto:** SAGRES Monitoria — Plataforma de Monitoria Acadêmica da UFG
**Baseline:** `v1.0.0` (BL-MVP) · commit `506137595e3b3d884f9c8eb30aa635bb0b2dadc4`
**Repositório:** https://github.com/isadora-yasmim/Sagres
**Disciplina:** Gerência de Configuração de Software — 2026/1 · INF/UFG
**Professora:** Sofia Costa Paiva
**Grupo:**
- Isadora Yasmin da Silva
- Júlia de Souza Nascimento
- Verônica Ribeiro Oliveira Palmeira
- Ana Luísa Pereira dos Santos

**Data:** 2026-06-24

---

## 1. Introdução

Este relatório documenta os três artefatos produzidos na Etapa 2 do Plano de Gerência de Configuração do projeto SAGRES Monitoria: o SBOM (*Software Bill of Materials*), o VDD (*Version Description Document*) e o Script de Build automatizado. O objetivo é demonstrar que a baseline `v1.0.0` foi construída, identificada e documentada seguindo práticas modernas de GCS, com rastreabilidade, integridade e reprodutibilidade verificáveis.

---

## 2. Artefato 1 — SBOM (Software Bill of Materials)

### 2.1 Descrição

O SBOM foi gerado com a ferramenta **Trivy 0.71.1** no formato **CycloneDX 1.7 (JSON)**, padrão adotado por grandes empresas e referenciado no enunciado da disciplina. O arquivo resultante (`sbom.json`) representa o inventário completo de dependências da baseline `v1.0.0`.

**Comando utilizado:**
```bash
trivy fs --format cyclonedx --output sbom.json --offline-scan .
```

### 2.2 Composição

O repositório é um monorepo com dois ecossistemas, ambos escaneados simultaneamente:

| Ecossistema | Manifesto | Dependências |
|-------------|-----------|:------------:|
| npm (frontend) | `frontend/package.json` + `package-lock.json` | 35 |
| Maven (backend) | `backend/pom.xml` | 12 |
| **Total** | — | **49 componentes** |

### 2.3 Estrutura do SBOM

O arquivo CycloneDX gerado contém:

- **`metadata`**: timestamp de geração, dados da ferramenta (`name=trivy`, `version=0.71.1`, `group=aquasecurity`) e componente-raiz do projeto.
- **`components`**: 49 entradas com campos `bom-ref`, `name`, `version`, `type` e `purl` por componente. Exemplos: `pkg:npm/agent-base@6.0.2`, `pkg:maven/br.ufg/sagres@0.0.1-SNAPSHOT`.
- **`licenses`**: presente em 35 dos 49 componentes (majoritariamente npm, licença `MIT`). Os componentes Maven não tiveram licença populada por limitação do scan sem build.
- **`dependencies`**: grafo de 50 nós descrevendo relações entre componentes.
- **`hashes`**: não populado (esperado para scan de manifestos; a integridade da baseline é garantida pelos hashes SHA-256 registrados em `gcs/hashes.txt`).

### 2.4 Limitações conhecidas

- Dependências transitivas do Maven não capturadas (versões herdadas do `spring-boot-starter-parent` não resolvidas sem build completo).
- Campo `vulnerabilities` vazio pois o Trivy foi executado sem `--scanners vuln` (análise de vulnerabilidades consolidada no VDD, Seção 4).
- Dependências de desenvolvimento/teste suprimidas por padrão pelo Trivy.

---

## 3. Artefato 2 — VDD (Version Description Document)

### 3.1 Descrição

O VDD (`VDD.md`) foi consolidado a partir dos insumos produzidos ao longo da prática: inventário de ICs, SBOM, nota de análise e relatório de auditoria. O documento descreve formalmente a baseline `v1.0.0` e está estruturado em quatro seções obrigatórias.

### 3.2 Seções do VDD

**Seção 1 — Identificação da Baseline**

Registra o identificador único da versão com todos os metadados rastreáveis:

| Campo | Valor |
|-------|-------|
| Identificador | `v1.0.0` (BL-MVP) |
| Commit hash | `506137595e3b3d884f9c8eb30aa635bb0b2dadc4` |
| Data | 2026-06-10 |
| Branch | `main` |
| Ambiente de build | Java 21 · Node.js 18 · PostgreSQL 16 · Docker |

**Seção 2 — Inventário de Modificações**

Contém a matriz de rastreabilidade cruzando as 5 Issues abertas no GitHub com os commits da release, além de tabelas separadas de funcionalidades (feat) e mudanças de infraestrutura/segurança.

**Seção 3 — Composição do Software/SBOM**

Referencia o `sbom.json`, integra a nota de análise da estrutura CycloneDX e a tabela completa de hashes SHA-256, incluindo o hash do próprio `VDD.md`.

**Seção 4 — Problemas Conhecidos e Limitações**

Lista funcionalidades pendentes para releases futuras (US-05, US-10, US-26, US-34), a vulnerabilidade npm identificada e as não-conformidades de configuração (NC-01, NC-02) documentadas no relatório de auditoria.

### 3.3 Integridade do VDD

O hash SHA-256 do `VDD.md` foi gerado após sua finalização e registrado tanto no próprio documento quanto no `gcs/hashes.txt`, garantindo verificação de integridade independente do Git.

| Artefato | SHA-256 |
|----------|---------|
| `VDD.md` | `41966B6A7C15A8CACC7CACF8C4E66E594D7EB94710C5AAE27A778BC87E51ECBF` |

---

## 4. Artefato 3 — Script de Build (`build.sh`)

### 4.1 Descrição

O script de build automatiza a construção reprodutível e versionada de todos os artefatos liberáveis do monorepo. É compatível com **Bash** (Git Bash / WSL no Windows, Linux e macOS).

**Uso básico:**
```bash
./build.sh                          # build completo
./build.sh --version 1.0.0          # forçando versão SemVer
./build.sh --frontend-only --skip-sbom --version 1.0.0
./build.sh --backend-only --skip-tests --version 1.0.0
```

### 4.2 Artefatos gerados (pasta `dist/`)

| Artefato | Descrição |
|----------|-----------|
| `sagres-backend-<versão>.jar` | JAR executável Spring Boot |
| `sagres-frontend-<versão>.tar.gz` | Bundle estático Vite/React |
| `sbom.json` | SBOM CycloneDX regenerado pelo Trivy |
| `build-info.json` | Manifesto com versão, commit, ferramentas e SHA-256 |
| `SHA256SUMS.txt` | Checksums SHA-256 (compatível com `sha256sum -c`) |

### 4.3 Versionamento SemVer 2.0.0

A versão é derivada automaticamente do Git e validada por expressão regular contra o padrão SemVer 2.0.0. A lógica de precedência é:

1. `--version` / `SAGRES_VERSION` (se informado, validado por regex)
2. **Tag exata no HEAD** → `X.Y.Z` (ex.: `v1.0.0` → `1.0.0`)
3. **Tag + distância** → `X.Y.Z-dev.N+gSHA` (ex.: `1.0.0-dev.22+ga8e6316`)
4. **Sem tags** → `0.0.0-dev+gSHA`

Árvore de trabalho suja acrescenta `.dirty` ao build metadata, sinalizando que o build não corresponde a um commit limpo.

---

## 5. Determinismo do Build

O build do SAGRES Monitoria é **determinístico**: dado o mesmo commit, o mesmo toolchain e as mesmas condições de ambiente, o script produz **bytes idênticos**.

### 5.1 Práticas adotadas

| Medida | Implementação |
|--------|---------------|
| Âncora temporal | `SOURCE_DATE_EPOCH` = timestamp do commit (`git log -1 --pretty=%ct`) |
| Timestamps do JAR | `-Dproject.build.outputTimestamp` (normaliza entradas do JAR Spring Boot) |
| Ambiente neutro | `TZ=UTC` e `LC_ALL=C` durante todo o build |
| Dependências travadas | `npm ci` (lockfile obrigatório) no frontend; `mvn -B` no backend |
| Empacotamento estável | `tar --sort=name --mtime=@EPOCH --owner=0 --group=0` + `gzip -n` |

### 5.2 Verificação do determinismo

Para verificar que dois builds a partir do mesmo commit produzem bytes idênticos:

```bash
./build.sh --frontend-only --skip-sbom --output-dir /tmp/build-a
./build.sh --frontend-only --skip-sbom --output-dir /tmp/build-b
sha256sum /tmp/build-a/*.tar.gz /tmp/build-b/*.tar.gz
# hashes idênticos → build determinístico ✓
```

---

## 6. Análise de Reprodutibilidade

### 6.1 Definição

Um build é **reprodutível** quando qualquer pessoa, a partir do mesmo commit e do mesmo toolchain, consegue reconstruir exatamente os mesmos artefatos — verificável por comparação de hash SHA-256.

### 6.2 Avaliação por artefato

| Artefato | Reprodutível? | Condição |
|----------|:-------------:|---------|
| `sagres-frontend-<versão>.tar.gz` | ✅ Bit-a-bit | Mesmo commit + Node.js ≥ 18 + `npm ci` |
| `sagres-backend-<versão>.jar` | ✅ Com toolchain fixo | Mesmo commit + mesma versão de Maven/JDK 21 |
| `sbom.json` | ✅ Estruturalmente | Mesmo commit + Trivy 0.71.x |
| `build-info.json` | ✅ | Determinado pelos artefatos acima |
| `SHA256SUMS.txt` | ✅ | Determinado pelos artefatos acima |

### 6.3 Limitações de reprodutibilidade

- **JAR do backend**: a garantia mais forte de reprodução exige a mesma versão de Maven e JDK. O uso da imagem Docker (`maven:3.9-eclipse-temurin-21`) oferece essa garantia por fixar o toolchain.
- **SBOM**: depende da versão do Trivy (0.71.x) e do comportamento de resolução de manifestos sem build — comportamento documentado e consistente dentro da mesma versão da ferramenta.
- **Builds sujos** (`.dirty`): árvore de trabalho com alterações não commitadas **não** oferece garantia de reprodutibilidade.

### 6.4 Evidência de reprodutibilidade

O build foi executado localmente com sucesso em ambiente Windows (Git Bash) com Java 21.0.11 e Node.js 22.13.1, produzindo os seguintes artefatos verificados:

| Artefato | SHA-256 (primeiros 12 caracteres) |
|----------|----------------------------------|
| `sagres-frontend-1.0.0.tar.gz` | `d92cb84f0f33…` |
| `sagres-backend-1.0.0.jar` | `aa9161753f48…` |

Checksums completos registrados em `dist/SHA256SUMS.txt` e `dist/build-info.json`.

---

## 7. Conclusão

Os três artefatos entregues — SBOM, VDD e Script de Build — cobrem integralmente os requisitos da Etapa 2 do Plano de GCS:

- O **SBOM** provê inventário completo e rastreável das dependências da baseline `v1.0.0` no formato CycloneDX 1.7, padrão adotado pela indústria.
- O **VDD** consolida a identificação única da baseline, a matriz de rastreabilidade Issues × Commits, a composição do software e os problemas conhecidos, com integridade garantida por hash SHA-256.
- O **Script de Build** automatiza a construção reprodutível e versionada de todos os artefatos, aplicando as práticas de *reproducible builds* e versionamento SemVer 2.0.0, com determinismo verificável por comparação de hashes.

Em conjunto, esses artefatos demonstram que a Gerência de Configuração do SAGRES Monitoria atende aos princípios de **proveniência**, **integridade** e **rastreabilidade** exigidos pela disciplina e pelos padrões IEEE 828-2012 e ISO/IEC/IEEE 12207.