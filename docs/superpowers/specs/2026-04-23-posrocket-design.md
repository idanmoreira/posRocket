# posRocket Design Spec

## Context

`posRocket` will be a full-stack URL shortener inspired by Brev.ly. The repository must contain exactly two solution folders:

- `web/` for the React SPA frontend
- `server/` for the Fastify backend and DevOps artifacts

The current workspace is effectively empty and has an incorrect `Server/` directory name. The implementation will treat this as a greenfield build and normalize the structure to the required lowercase `server/`.

## Goals

- Create shortened links from user-provided original URLs and custom slugs
- Validate slug format on both backend and frontend
- Prevent duplicate slugs
- List all created links efficiently
- Delete links by `shortUrl`
- Resolve original URLs from shortened URLs
- Increment access count before redirecting
- Export link data to CSV
- Upload the CSV to Cloudflare R2 and return a public URL
- Provide a responsive SPA with loading, empty, and error states
- Provide production-oriented backend packaging with a multi-stage Dockerfile

## Explicit Product Decisions

### Primary identifier

`shortUrl` will be the public identifier for all link operations:

- resolve original URL
- increment access count
- delete link

This avoids exposing internal IDs, matches the route structure, and keeps the frontend API surface simple.

### Public shortened URL base

Shortened URLs shown to users will be based on `VITE_FRONTEND_URL`, for example:

`http://localhost:5173/my-slug`

This keeps the redirect flow inside the SPA, which aligns with the challenge requirement for a dedicated redirect page and allows the frontend to show loading and not-found states cleanly.

### Repository structure

The implementation will use a simple two-app repository rather than a workspace-hoisted setup:

- `web/` with its own toolchain and dependencies
- `server/` with its own toolchain and dependencies

This minimizes setup complexity and keeps the challenge deliverable easy to review.

## Backend Design

### Stack

- TypeScript with strict mode
- Fastify
- Zod
- Drizzle ORM and drizzle-kit
- PostgreSQL
- `@aws-sdk/client-s3` for Cloudflare R2

### High-level structure

Backend files will be organized so route handlers stay thin and delegate to functions under `src/functions/`.

Planned backend structure:

- `server/package.json`
- `server/tsconfig.json`
- `server/drizzle.config.ts`
- `server/src/env.ts`
- `server/src/app.ts`
- `server/src/server.ts`
- `server/src/routes/*.ts`
- `server/src/functions/*.ts`
- `server/src/db/index.ts`
- `server/src/db/schema.ts`
- `server/src/lib/r2.ts`
- `server/src/utils/*.ts`
- `server/drizzle/`
- `server/Dockerfile`
- `server/.env.example`

### Environment validation

`server/src/env.ts` will parse and validate:

- `PORT`
- `DATABASE_URL`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_ACCESS_KEY_ID`
- `CLOUDFLARE_SECRET_ACCESS_KEY`
- `CLOUDFLARE_BUCKET`
- `CLOUDFLARE_PUBLIC_URL`

The server must fail fast on invalid configuration.

### Data model

The `links` table will contain:

- `id`: UUID internal key
- `originalUrl`: text, required
- `shortUrl`: varchar, required, unique
- `accessCount`: integer, required, default `0`
- `createdAt`: timestamp, required, default now

Required indexes:

- unique index on `short_url`
- index on `created_at`

### API contract

#### `POST /links`

Creates a link.

Request body:

- `originalUrl: string`
- `shortUrl: string`

Validation:

- `originalUrl` must be a valid URL
- `shortUrl` must match:
  - min 3
  - max 30
  - regex `^[a-z0-9][a-z0-9-]*[a-z0-9]$`

Behavior:

- returns success payload with created link data
- returns `409` if slug already exists
- returns `400` for validation failures

#### `GET /links`

Lists all links ordered by newest first.

Behavior:

- returns all links needed by the frontend list
- uses indexed ordering by `createdAt`
- response includes original URL, short URL, access count, and created date

#### `GET /links/:shortUrl`

Resolves the original URL for a slug.

Behavior:

- returns original URL data used by the redirect page
- returns `404` when slug does not exist

#### `PATCH /links/:shortUrl/access`

Increments access count.

Behavior:

- increments the counter before redirect
- returns success with the updated count or a simple success payload
- returns `404` when slug does not exist

#### `DELETE /links/:shortUrl`

Deletes a link by slug.

Behavior:

- removes the matching row
- returns success with no extra complexity
- returns `404` when slug does not exist

#### `POST /links/export`

Generates a CSV export and uploads it to Cloudflare R2.

Behavior:

- loads the current list of links
- generates CSV with:
  - original URL
  - shortened URL
  - access count
  - creation date
- generates a unique filename with `crypto.randomUUID()`
- uploads the file through the R2 S3-compatible client
- returns the public file URL

### Error handling

All backend errors must use the JSON shape:

```json
{
  "message": "string",
  "statusCode": 400
}
```

Rules:

- validation failures: `400`
- duplicate slug: `409`
- missing slug: `404`
- unexpected failures: `500` with a generic message while logging details internally

### Cross-cutting backend concerns

- Enable CORS in Fastify
- Use `async/await` consistently
- Use named exports only
- Use Drizzle for all queries
- Keep route handlers thin
- Keep helper functions small with early returns

## Frontend Design

### Stack

- TypeScript with strict mode
- React 19
- Vite SPA
- Tailwind CSS v4
- React Router DOM v7
- TanStack Query v5
- React Hook Form
- Zod

### High-level structure

Planned frontend structure:

- `web/package.json`
- `web/tsconfig.json`
- `web/vite.config.ts`
- `web/src/main.tsx`
- `web/src/app.tsx`
- `web/src/router.tsx`
- `web/src/lib/query-client.ts`
- `web/src/env.ts`
- `web/src/services/*.ts`
- `web/src/components/ui/*.tsx`
- `web/src/components/links/*.tsx`
- `web/src/pages/home.tsx`
- `web/src/pages/redirect.tsx`
- `web/src/pages/not-found.tsx`
- `web/src/styles/global.css`
- `web/.env.example`

### Design system direction

The frontend will start from the Figma style guide before page assembly.

Implementation priorities:

- define theme tokens in Tailwind-compatible CSS variables
- map color, spacing, radius, and typography primitives first
- build shared components before pages

Shared components:

- `Button`
- `TextInput`
- `Spinner`
- `Toast`

### Routing

The SPA will define exactly three route shapes:

- `/` for the dashboard
- `/:shortUrl` for redirect resolution
- `*` for not found

### Services layer

All HTTP requests must live under `web/src/services/`.

Planned service responsibilities:

- create link
- list links
- resolve original URL
- increment access count
- delete link
- export CSV

Components will never call `fetch` directly.

### Home page

The home page will contain:

- a create-link form panel
- a list panel for existing links
- an empty state when no links exist
- a CSV export action

Behavior:

- submit uses React Hook Form with Zod validation
- list is fetched with React Query
- create and delete mutations invalidate the list query
- export action shows loading and opens or exposes the returned file URL

Desktop layout:

- two columns

Mobile layout:

- stacked sections, mobile first

### Redirect page

The redirect page at `/:shortUrl` will:

1. read the slug from the route
2. fetch the original URL from the backend
3. call the increment endpoint before leaving
4. redirect the browser to the original URL

States:

- loading spinner while resolving
- not-found flow when the slug does not exist
- error feedback if resolution fails unexpectedly

### Not Found page

The not-found page will handle:

- arbitrary invalid routes
- missing short URLs from the redirect flow

It must provide a clear way back to the home page.

### Frontend environment

`web/.env.example` will define:

- `VITE_FRONTEND_URL`
- `VITE_BACKEND_URL`

`VITE_FRONTEND_URL` is also the base used to compose the displayed shortened link.

## Data Flow

### Create flow

1. User fills original URL and slug on `/`
2. Frontend validates locally with Zod
3. Frontend calls `POST /links`
4. Backend validates again with Zod
5. Backend persists the link
6. Frontend refreshes the list and shows success or error feedback

### Redirect flow

1. User opens `VITE_FRONTEND_URL/:shortUrl`
2. Redirect page requests `GET /links/:shortUrl`
3. If found, frontend calls `PATCH /links/:shortUrl/access`
4. Browser navigates to the original URL
5. If not found, frontend shows the 404 page

### Export flow

1. User clicks export on `/`
2. Frontend calls `POST /links/export`
3. Backend generates CSV
4. Backend uploads CSV to R2
5. Backend returns public URL
6. Frontend starts the download or opens the CDN URL

## DevOps Design

### Docker

`server/Dockerfile` will:

- use `node:20-alpine`
- use a multi-stage build
- install dependencies in the builder
- compile TypeScript to JS
- install only production dependencies in the final image
- copy built server output into the final image
- expose the runtime port
- start the compiled server entry point

### Migrations and scripts

The backend must expose the exact script key:

- `db:migrate`

Expected related scripts will include build and development commands, but `db:migrate` is mandatory and named exactly as required.

## Testing Strategy

### Backend

Focus tests on behavior with small, isolated coverage for:

- schema validation
- create-link success and duplicate conflict
- list-links response shape
- resolve-link success and 404
- increment access success and 404
- delete success and 404
- CSV export happy path with R2 upload mocked at the client boundary

### Frontend

Focus tests on:

- form validation messages
- successful creation flow
- duplicate-slug error toast
- list rendering and empty state
- delete interaction
- redirect flow states
- not-found rendering

If time needs to be prioritized, backend behavior tests and frontend validation plus redirect-state tests come first.

## Risks and Mitigations

### Redirect consistency

Risk:

- increment call could fail after successful resolution

Decision:

- the redirect page will still attempt increment before navigation because that is a stated product requirement
- error handling should prefer preserving redirect success while logging or surfacing unexpected failures only when redirect cannot proceed safely

### CSV upload integration

Risk:

- R2 configuration differences can cause upload failures

Mitigation:

- isolate client setup in `src/lib/r2.ts`
- validate all env vars at startup
- keep export logic separated from route registration for easier testing

### Challenge evaluation clarity

Risk:

- extra structural complexity can make review harder

Mitigation:

- keep the repository as two clear apps with straightforward scripts and folders

## Out of Scope

- user authentication
- analytics beyond raw access count
- link editing
- pagination or filtering
- QR code generation
- custom domains beyond the configured frontend base URL

## Implementation Order

The build should follow the mandatory order from the project instructions.

Backend:

1. initialize project and env parsing
2. add database config and schema
3. generate initial migration and `db:migrate`
4. set up Fastify app with CORS
5. implement routes in required order
6. set up Cloudflare R2 client
7. create Dockerfile
8. create `.env.example`

Frontend:

1. initialize Vite React TypeScript app
2. set up Tailwind v4 and theme tokens
3. build shared components
4. configure routes
5. configure React Query provider
6. build services
7. build home page and subcomponents
8. build redirect page
9. build not-found page
10. verify responsiveness at mobile and desktop widths
11. create `.env.example`
