import { drizzle } from "drizzle-orm/node-postgres";
import { applyIntegrationsToPool } from "drizzle-pgmem";
import { DataType, newDb } from "pg-mem";

const bootstrapSchema = `
  CREATE TABLE "links" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "original_url" text NOT NULL,
    "short_url" varchar(30) NOT NULL,
    "access_count" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "links_short_url_unique" UNIQUE("short_url")
  );
  CREATE INDEX "links_created_at_idx" ON "links" USING btree ("created_at");
`;

export const createPgMemDatabase = () => {
  const database = newDb();

  database.public.registerFunction({
    name: "gen_random_uuid",
    returns: DataType.uuid,
    implementation: () => crypto.randomUUID(),
  });

  database.public.none(bootstrapSchema);

  const { Pool } = database.adapters.createPg();
  const pool = new Pool();
  applyIntegrationsToPool(pool);

  const db = drizzle(pool);

  return { db, pool };
};
