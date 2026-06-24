# SAGRES Monitoria

Plataforma web para conexão entre alunos e monitores da UFG.

> **Stack:** React.js (frontend) + Spring Boot / Java (backend) + PostgreSQL

---

## Estrutura do Repositório (Monorepo)

```
sagres/
├── .editorconfig          # Estilo de código universal
├── .gitignore             # Ignora secrets, builds e node_modules
├── .husky/
│   └── pre-commit         # Hook: lint-staged antes de cada commit
├── docker-compose.yml     # PostgreSQL 16 + Mailpit
├── backend/
│   └── src/main/resources/
│       ├── application.properties          # ✅ commitado (sem secrets)
│       └── application-dev.properties      # ❌ gitignored (com secrets)
└── frontend/
    ├── .env.example       # ✅ commitado (template)
    ├── .env               # ❌ gitignored (valores reais)
    ├── .eslintrc.cjs
    ├── .prettierrc
    ├── .prettierignore
    └── package.json
├── backlog
```

---

## Branches

| Branch | Finalidade |
|---|---|
| `main` | Produção — protegida, só via PR aprovado |
| `develop` | Integração contínua dos devs |
| `feat/landing` | Feature: landing page |
| `feat/auth-backend` | Feature: autenticação backend |
| `feat/auth-frontend` | Feature: autenticação frontend |

---

## Setup — Feito UMA VEZ pelo líder (todos clonam depois)

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU_ORG/sagres-monitoria.git
cd sagres-monitoria
```

### 2. Subir os serviços Docker

```bash
docker compose up -d
```

Verificar se estão rodando:

```bash
docker compose ps
```

Serviços esperados:
- **sagres_postgres** → porta `5432`
- **sagres_mailpit** → SMTP `1025` | Interface web: [http://localhost:8025](http://localhost:8025)

### 3. Configurar variáveis de ambiente do Backend

O arquivo `backend/src/main/resources/application-dev.properties` está no `.gitignore`.
Crie-o localmente com o conteúdo abaixo (já versionado como template neste README):

```properties
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/sagres_db
spring.datasource.username=sagres_user
spring.datasource.password=sagres_pass
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

spring.mail.host=localhost
spring.mail.port=1025
spring.mail.properties.mail.smtp.auth=false
spring.mail.properties.mail.smtp.starttls.enable=false

spring.profiles.active=dev
```

### 4. Configurar variáveis de ambiente do Frontend

```bash
cp frontend/.env.example frontend/.env
```

O arquivo `.env` gerado contém:
```env
VITE_API_BASE_URL=http://localhost:8080
```

### 5. Instalar dependências do Frontend e ativar Husky

```bash
cd frontend
npm install
cd ..
```

O Husky é ativado automaticamente via `npm install` (script `prepare`).

---

## Desenvolvimento

### Backend (Spring Boot)

```bash
# Na raiz do projeto backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
# ou via IDE: IntelliJ IDEA → Run com profile 'dev'
```

### Frontend (React + Vite)

```bash
cd frontend
npm run dev
# Acesse: http://localhost:5173
```

---

## Build de Release

Para gerar os artefatos liberáveis (JAR do backend, bundle do frontend, SBOM,
checksums e manifesto) de forma **reprodutível** e **versionada (SemVer)**:

```bash
./build.sh            # build completo → dist/
./build.sh --help     # todas as opções
```

Detalhes de uso, determinismo e reprodutibilidade em [BUILD.md](BUILD.md).

---

## Lint e Formatação

```bash
cd frontend

npm run lint          # Verifica erros ESLint
npm run lint:fix      # Corrige automaticamente
npm run format        # Formata com Prettier
npm run format:check  # Apenas verifica formatação
```

O **Husky** executa `lint-staged` automaticamente em todo `git commit`,
garantindo que código fora do padrão não entre no repositório.

---

## ⚠️ Regras de Segurança

- **NUNCA** commitar `application-dev.properties`, `application-prod.properties` ou `.env`
- Todos os secrets ficam apenas na máquina local ou em variáveis de ambiente de CI/CD
- Em caso de commit acidentado com secret: rotacione a credencial imediatamente