process.env.PORT = process.env.PORT ?? "3333";
process.env.USE_PGMEM = process.env.USE_PGMEM ?? "false";
process.env.DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/posrocket_test";
process.env.CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID ?? "test-account";
process.env.CLOUDFLARE_ACCESS_KEY_ID = process.env.CLOUDFLARE_ACCESS_KEY_ID ?? "test-access-key";
process.env.CLOUDFLARE_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_SECRET_ACCESS_KEY ?? "test-secret";
process.env.CLOUDFLARE_BUCKET = process.env.CLOUDFLARE_BUCKET ?? "test-bucket";
process.env.CLOUDFLARE_PUBLIC_URL = process.env.CLOUDFLARE_PUBLIC_URL ?? "https://cdn.test.dev";
