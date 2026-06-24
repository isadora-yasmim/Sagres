#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# SAGRES Monitoria — Script de Build (Plano de Gerência de Configuração — Parte 2)
#
# Constrói, de forma reprodutível, os artefatos liberáveis do monorepo:
#   • backend  → JAR executável Spring Boot (Maven)
#   • frontend → bundle estático Vite/React (.tar.gz determinístico)
#   • sbom     → CycloneDX (Trivy), coerente com a baseline v1.0.0
#   • integridade → SHA256SUMS.txt + build-info.json (manifesto do build)
#
# Boas práticas adotadas:
#   • Versão derivada de tag Git no padrão SemVer 2.0.0 (validada por regex).
#   • Build determinístico: SOURCE_DATE_EPOCH + project.build.outputTimestamp,
#     TZ=UTC, LC_ALL=C, `npm ci` (lockfile), tar/gzip com metadados normalizados.
#   • Instalação reprodutível de dependências (mvn -B / npm ci).
#   • Detecção de ferramentas com mensagens de erro acionáveis.
#   • Não sobrescreve o `sbom.json` da baseline (use --update-sbom).
#
# Uso:   ./build.sh [opções]      (veja `./build.sh --help`)
# ──────────────────────────────────────────────────────────────────────────────

set -Eeuo pipefail

# ── Localização do projeto (funciona a partir de qualquer diretório) ──────────
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd -P)"
ROOT_DIR="$SCRIPT_DIR"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

# ── Configuração padrão (sobrescrevível por flag/env) ─────────────────────────
OUTPUT_DIR="${SAGRES_OUTPUT_DIR:-$ROOT_DIR/dist}"
MAVEN_IMAGE="${SAGRES_MAVEN_IMAGE:-maven:3.9-eclipse-temurin-21}"
PROJECT_NAME="sagres"

BUILD_BACKEND=true
BUILD_FRONTEND=true
GENERATE_SBOM=true
RUN_TESTS=true
DO_CLEAN=false
UPDATE_SBOM=false
ALLOW_DOCKER_MAVEN=true
STRICT=false
VERSION_OVERRIDE=""

# ── Logging ───────────────────────────────────────────────────────────────────
if [[ -t 1 && -z "${NO_COLOR:-}" ]]; then
    C_RESET=$'\033[0m'; C_BOLD=$'\033[1m'; C_DIM=$'\033[2m'
    C_RED=$'\033[31m'; C_GREEN=$'\033[32m'; C_YELLOW=$'\033[33m'; C_BLUE=$'\033[34m'
else
    C_RESET=''; C_BOLD=''; C_DIM=''; C_RED=''; C_GREEN=''; C_YELLOW=''; C_BLUE=''
fi

log()    { printf '%s[ %s ]%s %s\n' "$C_BLUE"  "BUILD" "$C_RESET" "$*"; }
step()   { printf '\n%s▸ %s%s\n' "$C_BOLD$C_BLUE" "$*" "$C_RESET"; }
ok()     { printf '%s✓%s %s\n' "$C_GREEN" "$C_RESET" "$*"; }
warn()   { printf '%s⚠ %s%s\n' "$C_YELLOW" "$*" "$C_RESET" >&2; }
err()    { printf '%s✗ %s%s\n' "$C_RED" "$*" "$C_RESET" >&2; }
die()    { err "$*"; exit 1; }

on_error() {
    local exit_code=$?
    err "Falha na linha ${BASH_LINENO[0]} (comando: '${BASH_COMMAND}'). Código: ${exit_code}."
    exit "$exit_code"
}
trap on_error ERR

# ── Ajuda ─────────────────────────────────────────────────────────────────────
usage() {
    cat <<EOF
${C_BOLD}SAGRES Monitoria — Script de Build${C_RESET}

Uso: ./build.sh [opções]

Opções:
  --version <X.Y.Z>   Força a versão (deve ser SemVer válida). Padrão: derivada do Git.
  --output-dir <dir>  Diretório de saída dos artefatos. Padrão: ./dist
  --backend-only      Constrói apenas o backend.
  --frontend-only     Constrói apenas o frontend.
  --skip-sbom         Não gera o SBOM (Trivy).
  --skip-tests        Não executa os testes do backend (não recomendado).
  --clean             Limpa o diretório de saída antes de construir.
  --update-sbom       Também atualiza o ./sbom.json da raiz (baseline).
  --no-docker         Não usar Maven via Docker como fallback (exige mvn/mvnw).
  --strict            Trata avisos (ex.: SBOM/tree sujo) como erro.
  -h, --help          Mostra esta ajuda.

Variáveis de ambiente:
  SAGRES_VERSION       Equivale a --version.
  SAGRES_OUTPUT_DIR    Equivale a --output-dir.
  SAGRES_MAVEN_IMAGE   Imagem Docker do Maven (padrão: $MAVEN_IMAGE).
  NO_COLOR             Desativa cores na saída.

Exemplos:
  ./build.sh                       # build completo e reprodutível
  ./build.sh --clean --version 1.0.0
  ./build.sh --frontend-only --skip-sbom
EOF
}

# ── Parsing de argumentos ─────────────────────────────────────────────────────
parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --version)     VERSION_OVERRIDE="${2:?--version requer um valor}"; shift 2 ;;
            --output-dir)  OUTPUT_DIR="${2:?--output-dir requer um valor}"; shift 2 ;;
            --backend-only)  BUILD_FRONTEND=false; shift ;;
            --frontend-only) BUILD_BACKEND=false; shift ;;
            --skip-sbom)   GENERATE_SBOM=false; shift ;;
            --skip-tests)  RUN_TESTS=false; shift ;;
            --clean)       DO_CLEAN=true; shift ;;
            --update-sbom) UPDATE_SBOM=true; shift ;;
            --no-docker)   ALLOW_DOCKER_MAVEN=false; shift ;;
            --strict)      STRICT=true; shift ;;
            -h|--help)     usage; exit 0 ;;
            *)             die "Opção desconhecida: '$1' (use --help)." ;;
        esac
    done
    if [[ "$BUILD_BACKEND" == false && "$BUILD_FRONTEND" == false ]]; then
        die "--backend-only e --frontend-only são mutuamente exclusivos."
    fi
}

# ── Utilidades ────────────────────────────────────────────────────────────────
have() { command -v "$1" >/dev/null 2>&1; }

# Calcula SHA-256 de um arquivo (sha256sum no Linux, shasum no macOS).
sha256_of() {
    if have sha256sum; then sha256sum "$1" | awk '{print $1}'
    elif have shasum;   then shasum -a 256 "$1" | awk '{print $1}'
    else die "Nem 'sha256sum' nem 'shasum' encontrados para calcular integridade."
    fi
}

# Validação de SemVer 2.0.0 (ERE compatível com Bash).
SEMVER_ERE='^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$'
is_semver() { [[ "$1" =~ $SEMVER_ERE ]]; }

# ── Resolução da versão (SemVer derivada do Git) ──────────────────────────────
# Regras:
#   1. --version / SAGRES_VERSION, se informado (validado).
#   2. Tag exata no HEAD  → X.Y.Z          (ex.: v1.0.0 → 1.0.0)
#   3. Tag + distância    → X.Y.Z-dev.N+sha (ex.: 1.0.0-dev.22+ga8e6316)
#   4. Sem tags           → 0.0.0-dev+sha
# Árvore suja acrescenta `.dirty` ao build metadata.
resolve_version() {
    local v
    if [[ -n "$VERSION_OVERRIDE" ]]; then
        v="$VERSION_OVERRIDE"
    elif [[ -n "${SAGRES_VERSION:-}" ]]; then
        v="$SAGRES_VERSION"
    elif ! have git || ! git -C "$ROOT_DIR" rev-parse --git-dir >/dev/null 2>&1; then
        warn "Git indisponível; usando versão padrão 0.0.0-dev."
        v="0.0.0-dev"
    else
        local sha dirty=""
        sha="$(git -C "$ROOT_DIR" rev-parse --short=7 HEAD)"
        [[ -n "$(git -C "$ROOT_DIR" status --porcelain)" ]] && dirty=".dirty"

        if git -C "$ROOT_DIR" describe --tags --exact-match HEAD >/dev/null 2>&1; then
            local tag; tag="$(git -C "$ROOT_DIR" describe --tags --exact-match HEAD)"
            v="${tag#v}"
            [[ -n "$dirty" ]] && v="${v}+g${sha}${dirty}"
        elif git -C "$ROOT_DIR" describe --tags --abbrev=0 >/dev/null 2>&1; then
            local base count
            base="$(git -C "$ROOT_DIR" describe --tags --abbrev=0)"
            count="$(git -C "$ROOT_DIR" rev-list "${base}..HEAD" --count)"
            v="${base#v}-dev.${count}+g${sha}${dirty}"
        else
            v="0.0.0-dev+g${sha}${dirty}"
        fi
    fi

    if ! is_semver "$v"; then
        die "Versão '$v' não é SemVer 2.0.0 válida. Use --version X.Y.Z."
    fi
    printf '%s' "$v"
}

# ── Determinismo: âncora temporal a partir do commit ─────────────────────────
setup_reproducibility() {
    export TZ=UTC
    export LC_ALL="${LC_ALL:-C}"

    if [[ -z "${SOURCE_DATE_EPOCH:-}" ]] && have git \
        && git -C "$ROOT_DIR" rev-parse --git-dir >/dev/null 2>&1; then
        SOURCE_DATE_EPOCH="$(git -C "$ROOT_DIR" log -1 --pretty=%ct 2>/dev/null || true)"
    fi
    if [[ -z "${SOURCE_DATE_EPOCH:-}" ]]; then
        warn "SOURCE_DATE_EPOCH ausente; usando epoch 0. Reprodutibilidade reduzida."
        SOURCE_DATE_EPOCH=0
    fi
    export SOURCE_DATE_EPOCH

    # Timestamp ISO-8601 UTC usado pelo Maven (project.build.outputTimestamp).
    if date -u -d "@$SOURCE_DATE_EPOCH" +%Y-%m-%dT%H:%M:%SZ >/dev/null 2>&1; then
        BUILD_TS="$(date -u -d "@$SOURCE_DATE_EPOCH" +%Y-%m-%dT%H:%M:%SZ)"   # GNU
    else
        BUILD_TS="$(date -u -r "$SOURCE_DATE_EPOCH" +%Y-%m-%dT%H:%M:%SZ)"     # BSD/macOS
    fi
    export BUILD_TS
}

# ── Resolução do Maven (mvnw → mvn → docker) ──────────────────────────────────
MVN_MODE=""
resolve_maven() {
    if [[ -x "$BACKEND_DIR/mvnw" ]]; then
        MVN_MODE="wrapper"; ok "Maven: wrapper do projeto (./mvnw)."
    elif have mvn; then
        MVN_MODE="native"; ok "Maven: binário do sistema ($(mvn -v 2>/dev/null | head -1))."
    elif [[ "$ALLOW_DOCKER_MAVEN" == true ]] && have docker; then
        MVN_MODE="docker"; ok "Maven: via Docker ($MAVEN_IMAGE)."
    else
        die "Maven não encontrado. Instale o Maven, gere o wrapper (mvn -N wrapper:wrapper) ou use Docker."
    fi
}

# Executa o Maven no modo resolvido, sempre a partir de $BACKEND_DIR.
run_maven() {
    case "$MVN_MODE" in
        wrapper) ( cd "$BACKEND_DIR" && ./mvnw "$@" ) ;;
        native)  ( cd "$BACKEND_DIR" && mvn "$@" ) ;;
        docker)
            docker run --rm \
                -v "$BACKEND_DIR":/work \
                -v "${HOME}/.m2":/root/.m2 \
                -w /work \
                -e TZ=UTC -e LC_ALL=C \
                "$MAVEN_IMAGE" mvn "$@"
            ;;
    esac
}

# ── Build do backend ──────────────────────────────────────────────────────────
build_backend() {
    step "Backend (Spring Boot / Maven)"
    [[ -f "$BACKEND_DIR/pom.xml" ]] || die "pom.xml não encontrado em $BACKEND_DIR."
    resolve_maven

    local goals=(-B -ntp clean package "-Dproject.build.outputTimestamp=${BUILD_TS}")
    [[ "$RUN_TESTS" == false ]] && goals+=(-DskipTests) || true

    log "mvn ${goals[*]}"
    run_maven "${goals[@]}"

    # Seleciona o JAR executável (boot), ignorando o *.original do repackage.
    local jar=""
    while IFS= read -r f; do jar="$f"; break; done < <(
        find "$BACKEND_DIR/target" -maxdepth 1 -name '*.jar' ! -name '*.original' 2>/dev/null | sort
    )
    [[ -n "$jar" && -f "$jar" ]] || die "JAR do backend não encontrado em backend/target."

    local dest="$OUTPUT_DIR/${PROJECT_NAME}-backend-${VERSION}.jar"
    cp -f "$jar" "$dest"
    ARTIFACTS+=("$dest")
    ok "Backend: $(basename "$dest")"
}

# ── Build do frontend ─────────────────────────────────────────────────────────
build_frontend() {
    step "Frontend (Vite / React)"
    [[ -f "$FRONTEND_DIR/package.json" ]] || die "package.json não encontrado em $FRONTEND_DIR."
    have node || die "Node.js não encontrado (requerido para o frontend)."
    have npm  || die "npm não encontrado (requerido para o frontend)."

    # Instalação reprodutível: npm ci exige package-lock.json.
    if [[ -f "$FRONTEND_DIR/package-lock.json" ]]; then
        log "npm ci (instalação determinística a partir do lockfile)"
        ( cd "$FRONTEND_DIR" && npm ci --no-audit --no-fund )
    else
        warn "package-lock.json ausente; usando 'npm install' (menos determinístico)."
        [[ "$STRICT" == true ]] && die "Modo --strict: lockfile do frontend é obrigatório."
        ( cd "$FRONTEND_DIR" && npm install --no-audit --no-fund )
    fi

    log "npm run build (vite build)"
    ( cd "$FRONTEND_DIR" && npm run build )
    [[ -d "$FRONTEND_DIR/dist" ]] || die "Saída do Vite (frontend/dist) não foi gerada."

    # Empacota o bundle de forma determinística (ordem, mtime, owner normalizados).
    local dest="$OUTPUT_DIR/${PROJECT_NAME}-frontend-${VERSION}.tar.gz"
    tar --sort=name \
        --mtime="@${SOURCE_DATE_EPOCH}" \
        --owner=0 --group=0 --numeric-owner \
        --format=gnu \
        -C "$FRONTEND_DIR" -cf - dist \
        | gzip -9 -n > "$dest"
    ARTIFACTS+=("$dest")
    ok "Frontend: $(basename "$dest")"
}

# ── Geração do SBOM (CycloneDX via Trivy) ─────────────────────────────────────
generate_sbom() {
    step "SBOM (CycloneDX / Trivy)"
    if ! have trivy; then
        warn "Trivy não encontrado; SBOM não será gerado. (instale: https://trivy.dev)"
        [[ "$STRICT" == true ]] && die "Modo --strict: Trivy é obrigatório para o SBOM."
        return 0
    fi

    local sbom_out="$OUTPUT_DIR/sbom.json"
    # Mesmo comando registrado na baseline v1.0.0 (VDD §3.1 / nota-analise-sbom).
    log "trivy fs --format cyclonedx --offline-scan ."
    trivy fs --format cyclonedx --output "$sbom_out" --offline-scan "$ROOT_DIR" \
        || { warn "Trivy retornou erro ao gerar o SBOM."; [[ "$STRICT" == true ]] && exit 1; return 0; }

    ARTIFACTS+=("$sbom_out")
    ok "SBOM: $(basename "$sbom_out")"

    if [[ "$UPDATE_SBOM" == true ]]; then
        cp -f "$sbom_out" "$ROOT_DIR/sbom.json"
        ok "sbom.json da raiz (baseline) atualizado."
    else
        log "sbom.json da raiz preservado (use --update-sbom para sobrescrever)."
    fi
}

# ── Manifesto do build (build-info.json) ──────────────────────────────────────
json_str() { printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'; }

git_field() {
    if have git && git -C "$ROOT_DIR" rev-parse --git-dir >/dev/null 2>&1; then
        git -C "$ROOT_DIR" "$@" 2>/dev/null || true
    fi
}

write_build_info() {
    step "Manifesto e integridade"
    local info="$OUTPUT_DIR/build-info.json"

    local commit branch describe dirty="false"
    commit="$(git_field rev-parse HEAD)"
    branch="$(git_field rev-parse --abbrev-ref HEAD)"
    describe="$(git_field describe --tags --always --dirty)"
    [[ -n "$(git_field status --porcelain)" ]] && dirty="true"

    local java_v node_v npm_v trivy_v mvn_v
    java_v="$(java -version 2>&1 | head -1 | sed -E 's/.*version "([^"]+)".*/\1/' || echo '')"
    node_v="$(have node && node --version 2>/dev/null || echo '')"
    npm_v="$(have npm && npm --version 2>/dev/null || echo '')"
    trivy_v="$(have trivy && trivy --version 2>/dev/null | head -1 | awk '{print $2}' || echo '')"
    case "$MVN_MODE" in
        docker) mvn_v="docker:$MAVEN_IMAGE" ;;
        "")     mvn_v="" ;;
        *)      mvn_v="$(run_maven -v 2>/dev/null | head -1 || echo "$MVN_MODE")" ;;
    esac

    # Lista de artefatos com SHA-256 e tamanho.
    local artifacts_json="" first=true a name hash size
    for a in "${ARTIFACTS[@]}"; do
        [[ -f "$a" ]] || continue
        name="$(basename "$a")"
        hash="$(sha256_of "$a")"
        size="$(wc -c < "$a" | tr -d ' ')"
        [[ "$first" == true ]] && first=false || artifacts_json+=","
        artifacts_json+=$'\n    {'
        artifacts_json+="\"name\":\"$(json_str "$name")\",\"sha256\":\"$hash\",\"bytes\":$size"
        artifacts_json+='}'
    done

    cat > "$info" <<EOF
{
  "project": "$(json_str "$PROJECT_NAME") — SAGRES Monitoria",
  "version": "$(json_str "$VERSION")",
  "semver": true,
  "buildTimestampUtc": "$(json_str "$BUILD_TS")",
  "sourceDateEpoch": ${SOURCE_DATE_EPOCH},
  "reproducible": {
    "tz": "UTC",
    "lcAll": "$(json_str "${LC_ALL:-}")",
    "mavenOutputTimestamp": "$(json_str "$BUILD_TS")",
    "deterministicTar": true,
    "lockedInstall": true
  },
  "git": {
    "commit": "$(json_str "$commit")",
    "branch": "$(json_str "$branch")",
    "describe": "$(json_str "$describe")",
    "dirty": ${dirty}
  },
  "tools": {
    "java": "$(json_str "$java_v")",
    "maven": "$(json_str "$mvn_v")",
    "node": "$(json_str "$node_v")",
    "npm": "$(json_str "$npm_v")",
    "trivy": "$(json_str "$trivy_v")"
  },
  "artifacts": [${artifacts_json}
  ]
}
EOF
    ok "Manifesto: $(basename "$info")"

    # SHA256SUMS.txt — compatível com `sha256sum -c` (executado dentro do dist).
    local sums="$OUTPUT_DIR/SHA256SUMS.txt"
    : > "$sums"
    ( cd "$OUTPUT_DIR" && for a in "${ARTIFACTS[@]}"; do
        [[ -f "$a" ]] && sha256_of "$(basename "$a")" | sed "s|$| *$(basename "$a")|"
      done ) > "$sums"
    ok "Checksums: $(basename "$sums")"
}

# ── Resumo final ──────────────────────────────────────────────────────────────
print_summary() {
    step "Resumo do build"
    printf '%s  Projeto:%s   %s\n' "$C_BOLD" "$C_RESET" "SAGRES Monitoria"
    printf '%s  Versão:%s    %s%s%s  %s(SemVer ✓)%s\n' \
        "$C_BOLD" "$C_RESET" "$C_GREEN" "$VERSION" "$C_RESET" "$C_DIM" "$C_RESET"
    printf '%s  Saída:%s     %s\n' "$C_BOLD" "$C_RESET" "$OUTPUT_DIR"
    printf '%s  Determinismo:%s SOURCE_DATE_EPOCH=%s (UTC %s)\n' \
        "$C_BOLD" "$C_RESET" "$SOURCE_DATE_EPOCH" "$BUILD_TS"
    echo
    printf '%s  Artefatos:%s\n' "$C_BOLD" "$C_RESET"
    local a
    for a in "${ARTIFACTS[@]}"; do
        [[ -f "$a" ]] && printf '    • %-44s %s\n' "$(basename "$a")" "$(sha256_of "$a" | cut -c1-12)…"
    done
    echo
    ok "Build concluído com sucesso."
}

# ── Orquestração ──────────────────────────────────────────────────────────────
main() {
    parse_args "$@"

    printf '%s╭───────────────────────────────────────────────╮%s\n' "$C_BLUE" "$C_RESET"
    printf '%s│  SAGRES Monitoria — Build (GC · Prática 12)    │%s\n' "$C_BLUE" "$C_RESET"
    printf '%s╰───────────────────────────────────────────────╯%s\n' "$C_BLUE" "$C_RESET"

    setup_reproducibility
    VERSION="$(resolve_version)"
    ARTIFACTS=()

    log "Versão resolvida: ${C_GREEN}${VERSION}${C_RESET}"
    log "Âncora temporal:  ${BUILD_TS} (epoch ${SOURCE_DATE_EPOCH})"

    if have git && git -C "$ROOT_DIR" rev-parse --git-dir >/dev/null 2>&1 && [[ -n "$(git -C "$ROOT_DIR" status --porcelain)" ]]; then
        warn "Árvore de trabalho suja; este build não corresponde a um commit limpo."
        [[ "$STRICT" == true ]] && die "Modo --strict: a árvore de trabalho deve estar limpa."
    fi
    if [[ "$DO_CLEAN" == true && -d "$OUTPUT_DIR" ]]; then
        log "Limpando $OUTPUT_DIR"
        find "$OUTPUT_DIR" -mindepth 1 -exec rm -rf -- {} +
    mkdir -p "$OUTPUT_DIR"

    [[ "$BUILD_BACKEND"  == true ]] && build_backend
    [[ "$BUILD_FRONTEND" == true ]] && build_frontend
    [[ "$GENERATE_SBOM"  == true ]] && generate_sbom

    write_build_info
    print_summary
}

main "$@"
