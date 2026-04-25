import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "../env";
import { createPgMemDatabase } from "./pg-mem";

const database = env.USE_PGMEM
  ? createPgMemDatabase()
  : (() => {
      const pool = new Pool({
        connectionString: env.DATABASE_URL,
      });

      return {
        db: drizzle(pool),
        pool,
      };
    })();

export const { db, pool } = database;
