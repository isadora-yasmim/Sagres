# Como executar o SAGRES Monitoria

## Modo completo (frontend + backend + banco)

### Pré-requisitos

- Java 21+
- Docker e Docker Compose
- Node.js 18+

### 1. Suba o banco de dados e o servidor de e-mail

```bash
docker compose up -d
```

Serviços que sobem:
- **PostgreSQL** → `localhost:5432`
- **Mailpit** (caixa de e-mail local) → **http://localhost:8025**

### 2. Configure o backend

Crie o arquivo `backend/src/main/resources/application-dev.properties` (não versionado):

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

### 3. Inicie o backend

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Backend disponível em: **http://localhost:8080**

### 4. Configure e inicie o frontend

```bash
cp frontend/.env.example frontend/.env
# Deixe VITE_USE_MOCK sem definir (ou = false) para bater no backend real
```

```bash
cd frontend
npm install
npm run dev
```

Acesse: **http://localhost:5173**

---

## Resumo das portas

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8080 |
| PostgreSQL | localhost:5432 |
| Mailpit (e-mails) | http://localhost:8025 |
