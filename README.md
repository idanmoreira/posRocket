# posRocket

Encurtador de URLs FullStack desenvolvido como projeto da pós-graduação Rocketseat. Permite cadastrar, listar, deletar links encurtados, redirecionar para a URL original incrementando o contador de acessos e exportar um CSV via CDN (Cloudflare R2).

## Estrutura do repositório

```
posRocket/
├── server/   # API Fastify + Drizzle + PostgreSQL (back-end + DevOps)
├── web/      # SPA React + Vite + React Query (front-end)
└── docs/     # Notas e materiais de apoio
```

## Stack

**Back-end (`server/`)**

- Fastify 5
- Drizzle ORM + PostgreSQL
- Zod para validação
- @aws-sdk/client-s3 para upload em Cloudflare R2
- Vitest para testes
- Suporte opcional a `pg-mem` para rodar sem Postgres (modo `USE_PGMEM=true`)

**Front-end (`web/`)**

- React 19 + Vite (SPA)
- React Router DOM v7
- TanStack Query v5
- React Hook Form + Zod
- Vitest + Testing Library

## Pré-requisitos

- Node.js 20+
- npm 10+
- (Opcional) Docker, para rodar Postgres ou empacotar o server
- (Opcional) Conta Cloudflare R2 para a exportação real de CSV

## Configuração

### Back-end

```bash
cd server
cp .env.example .env
npm install
```

Variáveis em `.env`:

| Variável | Descrição |
|---|---|
| `PORT` | Porta da API (padrão: 3333) |
| `DATABASE_URL` | URL de conexão com o Postgres |
| `USE_PGMEM` | (Opcional) `true` para rodar com banco em memória, sem Postgres real |
| `CLOUDFLARE_ACCOUNT_ID` | ID da conta Cloudflare |
| `CLOUDFLARE_ACCESS_KEY_ID` | Access key do R2 |
| `CLOUDFLARE_SECRET_ACCESS_KEY` | Secret key do R2 |
| `CLOUDFLARE_BUCKET` | Nome do bucket R2 |
| `CLOUDFLARE_PUBLIC_URL` | URL pública (CDN) do bucket |

> Em modo `USE_PGMEM=true` o export `POST /links/export` retorna um data URL `data:text/csv;...` em vez de subir para o R2, então as variáveis Cloudflare podem ser preenchidas com qualquer valor não vazio.

### Front-end

```bash
cd web
cp .env.example .env
npm install
```

Variáveis em `.env`:

| Variável | Descrição |
|---|---|
| `VITE_FRONTEND_URL` | URL pública da SPA (ex.: `http://localhost:5173`) |
| `VITE_BACKEND_URL` | URL da API (ex.: `http://localhost:3333`) |

## Como rodar

### Opção A — Postgres real (modo recomendado)

1. Suba um Postgres local. Exemplo rápido com Docker:
   ```bash
   docker run --name posrocket-db \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=posrocket \
     -p 5432:5432 -d postgres:16-alpine
   ```
2. Configure `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/posrocket` no `server/.env`.
3. Rode as migrations:
   ```bash
   cd server
   npm run db:migrate
   ```
4. Suba a API:
   ```bash
   npm run dev
   ```
5. Em outro terminal, suba o front:
   ```bash
   cd web
   npm run dev
   ```
6. Abra `http://localhost:5173`.

### Opção B — Sem Postgres (modo `USE_PGMEM`)

Útil para correção rápida sem instalar Docker/Postgres.

1. No `server/.env`, defina:
   ```
   USE_PGMEM=true
   DATABASE_URL=postgresql://localhost:5432/posrocket
   CLOUDFLARE_ACCOUNT_ID=any
   CLOUDFLARE_ACCESS_KEY_ID=any
   CLOUDFLARE_SECRET_ACCESS_KEY=any
   CLOUDFLARE_BUCKET=any
   CLOUDFLARE_PUBLIC_URL=https://example.com
   ```
2. Rode `npm run dev` no `server/` e `npm run dev` no `web/`.

Nesse modo a tabela `links` é criada em memória no boot, então os dados são perdidos ao reiniciar e o export CSV vira um data URL.

## Build e Docker (back-end)

```bash
cd server
docker build -t posrocket-server .
docker run --rm -p 3333:3333 --env-file .env posrocket-server
```

O Dockerfile usa multi-stage build (`node:20-alpine`) e instala só dependências de produção no estágio final.

## Endpoints da API

| Método | Caminho | Descrição |
|---|---|---|
| `POST` | `/links` | Cria um link. Valida URL e formato do slug |
| `GET` | `/links` | Lista todos os links (mais recentes primeiro) |
| `GET` | `/links/:shortUrl` | Retorna o link pelo slug |
| `PATCH` | `/links/:shortUrl/access` | Incrementa o contador de acessos |
| `DELETE` | `/links/:shortUrl` | Remove o link |
| `POST` | `/links/export` | Gera CSV, sobe no R2 (ou data URL no modo PGMEM) e retorna `{ url }` |

Códigos de erro:

- `400` validação (URL inválida, slug fora do padrão `^[a-z0-9][a-z0-9-]*[a-z0-9]$`, ou tamanho fora de 3..30)
- `404` link não encontrado
- `409` slug duplicado
- `500` erro interno (com mensagem genérica)

## Testes

```bash
cd server
npm test       # Vitest com mocks de DB e R2

cd ../web
npm test       # Vitest + Testing Library + jsdom
```

## Scripts úteis

| Local | Script | O que faz |
|---|---|---|
| `server/` | `npm run dev` | Sobe a API com hot reload (`tsx watch`) |
| `server/` | `npm run build` | Gera o bundle em `dist/` (tsup) |
| `server/` | `npm start` | Roda o bundle de produção |
| `server/` | `npm run db:generate` | Gera nova migration via Drizzle Kit |
| `server/` | `npm run db:migrate` | Aplica as migrations no Postgres |
| `web/` | `npm run dev` | Sobe a SPA |
| `web/` | `npm run build` | Type-check + build de produção |
| `web/` | `npm run preview` | Serve o build de produção |
