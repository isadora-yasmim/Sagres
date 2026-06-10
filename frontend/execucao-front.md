# SAGRES Monitoria — Teste do Frontend

Guia rápido para testar apenas o frontend do SAGRES Monitoria.

## Pré-requisitos

É necessário ter **Node.js** e **npm** instalados.

Não é necessário subir Docker para este teste, pois o frontend está usando dados simulados (mock).

## 1. Atualizar o projeto

```bash
git checkout develop
git pull origin develop
```

## 2. Entrar no frontend

```bash
cd frontend
```

## 3. Instalar dependências

Na primeira execução:

```bash
npm install
```

## 4. Rodar o frontend

```bash
npm run dev
```

Abra no navegador a URL exibida no terminal, geralmente:

```text
http://localhost:5173
```

## Rotas para testar

```text
/                         Landing Page
/ranking                  Ranking público
/cadastro                 Cadastro
/confirmar-email          Confirmação de e-mail
/login                    Login
/esqueci-senha            Recuperação de senha
/link-enviado             Link enviado
/nova-senha/token-demo    Criar nova senha
/link-expirado            Link expirado
/termos                   Termos de Uso
/privacidade              Política de Privacidade
```

## Contas de teste

### Login válido

Use qualquer e-mail institucional válido com uma senha forte.

Exemplo:

```text
ana@discente.ufg.br
Teste@123
```

### Conta não validada

Existem três contas mockadas para demonstração:

```text
cleide@discente.ufg.br
Teste@123
```

```text
julia@discente.ufg.br
Teste@123
```

```text
stella@discente.ufg.br
Teste@123
```
Não é necessário testar todas elas, teste preferencialmente apenas a primeira.

As demais contas mockadas ficam como reserva para demonstração.


## O que validar

* Navegação entre telas;
* Layout e responsividade;
* Formulários de cadastro e login;
* Fluxo de recuperação de senha;
* Links da Landing Page;
* Ranking;
* Termos de Uso e Política de Privacidade.

## Observação

Este teste é focado no frontend. Algumas funcionalidades ainda usam mocks até a integração final com o backend.
