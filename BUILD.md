# Script de Build — SAGRES Monitoria

Documentação do `build.sh`, entregue como parte do **Plano de Gerência de
Configuração — Parte 2** (Prática 12). O script constrói, de forma **reprodutível**
e **versionada (SemVer)**, todos os artefatos liberáveis do monorepo e gera os
metadados de integridade da baseline.

> Pré-requisitos: **Bash**, **Java 21**, **Node.js ≥ 18** (testado em 22), **Trivy**
> (para o SBOM) e **Maven** — via `mvn`, wrapper `./mvnw` ou **Docker** (fallback).

---

## 1. Uso

```bash
./build.sh                       # build completo (backend + frontend + SBOM)
./build.sh --clean               # limpa a saída antes de construir
./build.sh --version 1.0.0       # força a versão (deve ser SemVer válida)
./build.sh --frontend-only       # apenas o frontend (+ SBOM)
./build.sh --backend-only        # apenas o backend
./build.sh --skip-tests          # pula os testes do backend (não recomendado)
./build.sh --help                # todas as opções
```

| Opção | Efeito |
|-------|--------|
| `--version <X.Y.Z>` | Força a versão (validada como SemVer). Padrão: derivada do Git. |
| `--output-dir <dir>` | Diretório de saída. Padrão: `./dist`. |
| `--backend-only` / `--frontend-only` | Restringe o escopo do build. |
| `--skip-sbom` | Não gera o SBOM. |
| `--skip-tests` | Não executa os testes do backend. |
| `--clean` | Limpa o diretório de saída antes de construir. |
| `--update-sbom` | Sobrescreve também o `sbom.json` da raiz (baseline). |
| `--no-docker` | Desativa o fallback de Maven via Docker. |
| `--strict` | Trata avisos (lockfile/SBOM ausentes, árvore suja) como erro. |

Variáveis de ambiente equivalentes: `SAGRES_VERSION`, `SAGRES_OUTPUT_DIR`,
`SAGRES_MAVEN_IMAGE`, `NO_COLOR`.

> **Windows:** execute via **Git Bash** ou **WSL** (o script requer Bash; não é POSIX `sh`).

---

## 2. Artefatos gerados (`dist/`)

| Artefato | Descrição |
|----------|-----------|
| `sagres-backend-<versão>.jar` | JAR executável Spring Boot (Maven `package`). |
| `sagres-frontend-<versão>.tar.gz` | Bundle estático do Vite, empacotado de forma determinística. |
| `sbom.json` | SBOM CycloneDX (Trivy), regerado a partir do código. |
| `build-info.json` | Manifesto do build: versão, commit, ferramentas e SHA-256 dos artefatos. |
| `SHA256SUMS.txt` | Checksums SHA-256 (compatível com `sha256sum -c`). |

Verificação de integridade:

```bash
cd dist && sha256sum -c SHA256SUMS.txt
```

---

## 3. Versionamento — SemVer 2.0.0

A versão é derivada do Git e **validada por expressão regular** contra o padrão
[SemVer 2.0.0](https://semver.org). A precedência é:

1. `--version` / `SAGRES_VERSION` (se informado);
2. **tag exata** no `HEAD` → `X.Y.Z` (ex.: `v1.0.0` → `1.0.0`);
3. **tag + distância** → `X.Y.Z-dev.N+g<sha>` (ex.: `1.0.0-dev.22+ga8e6316`);
4. sem tags → `0.0.0-dev+g<sha>`.

Uma árvore de trabalho suja (alterações não commitadas) acrescenta `.dirty` ao
*build metadata*, sinalizando que aquele build **não** corresponde a um commit limpo.

---

## 4. Determinismo e reprodutibilidade

O script aplica as práticas de *reproducible builds* para que o **mesmo commit**
produza **bytes idênticos**:

| Medida | Como |
|--------|------|
| Âncora temporal | `SOURCE_DATE_EPOCH` = timestamp do commit (`git log -1 %ct`). |
| Timestamps do JAR | `-Dproject.build.outputTimestamp` (normaliza entradas do JAR Spring Boot). |
| Ambiente neutro | `TZ=UTC` e `LC_ALL=C` durante todo o build. |
| Dependências travadas | `npm ci` (lockfile) no frontend; `mvn -B` no backend. |
| Empacotamento estável | `tar --sort=name --mtime=@$SOURCE_DATE_EPOCH --owner=0 --group=0 --numeric-owner` + `gzip -n`. |

### Verificação de reprodutibilidade

Construir o frontend duas vezes a partir do mesmo commit e comparar o hash:

```bash
./build.sh --frontend-only --skip-sbom --output-dir /tmp/a
./build.sh --frontend-only --skip-sbom --output-dir /tmp/b
sha256sum /tmp/a/*.tar.gz /tmp/b/*.tar.gz   # hashes idênticos → reprodutível
```

**Notas e limites conhecidos:**

- O **bundle do frontend** (`.tar.gz`) é **bit-a-bit reprodutível** entre execuções,
  pois o Vite gera nomes por *content hash* e o empacotamento é normalizado.
- O **JAR do backend** torna-se reprodutível pela fixação de `outputTimestamp`; a
  reprodução exata pressupõe a **mesma versão de Maven/JDK** (registrada em
  `build-info.json`). Builds via a mesma imagem Docker (`SAGRES_MAVEN_IMAGE`) dão a
  garantia mais forte por fixarem o toolchain.
- O **SBOM** depende da versão do Trivy (0.71.x) e, por escanear manifestos sem build,
  não resolve transitivas Maven — comportamento já documentado na
  [nota de análise do SBOM](gcs/nota-analise-sbom.md) e no [VDD](VDD.md).
- Builds com a árvore suja (`.dirty`) **não** oferecem garantia de reprodutibilidade.

---

## 5. SBOM

O SBOM é regerado com o **mesmo comando** registrado na baseline `v1.0.0`
(VDD §3.1), mantendo coerência com o artefato auditado:

```bash
trivy fs --format cyclonedx --output dist/sbom.json --offline-scan .
```

Por padrão, o `sbom.json` da **raiz** (artefato da baseline, com hash registrado em
[`gcs/hashes.txt`](gcs/hashes.txt)) é **preservado**; o build escreve uma cópia
fresca apenas em `dist/`. Use `--update-sbom` para promover a versão regerada à raiz.

---

## 6. Relação com a baseline

- O build **não modifica** os artefatos versionados da baseline (`sbom.json`,
  `VDD.md`, `pom.xml`, `package.json`), preservando os hashes SHA-256 registrados.
- Saídas do build (`dist/`, `target/`, `node_modules/`, `*.jar`, `*.tar.gz`) já estão
  no [`.gitignore`](.gitignore) e **não** são versionadas.
