import { migrate } from "drizzle-orm/node-postgres/migrator";

import { db, pool } from "./index";
import { env } from "../env";

const run = async () => {
  if (env.USE_PGMEM) {
    await pool.end();
    return;
  }

  await migrate(db, {
    migrationsFolder: "./drizzle",
  });

  await pool.end();
};

run().catch(async (error: unknown) => {
  console.error("Database migration failed", error);
  await pool.end();
  process.exit(1);
});
