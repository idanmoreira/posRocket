import EmbeddedPostgres from "embedded-postgres";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const databaseDir = path.resolve(__dirname, "../.local/postgres");
const port = 5432;
const user = "postgres";
const password = "postgres";
const databaseName = "posrocket";

const pg = new EmbeddedPostgres({
  authMethod: "password",
  databaseDir,
  password,
  persistent: true,
  port,
  user,
  onLog: (message) => {
    if (typeof message === "string" && message.trim().length > 0) {
      console.log(`[embedded-postgres] ${message}`);
    }
  },
  onError: (message) => {
    if (typeof message === "string" && message.trim().length > 0) {
      console.error(`[embedded-postgres] ${message}`);
      return;
    }

    console.error(message);
  },
});

const stop = async (signal) => {
  try {
    await pg.stop();
  } catch (error) {
    console.error(`[embedded-postgres] shutdown failed after ${signal}`, error);
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", () => {
  void stop("SIGINT");
});

process.on("SIGTERM", () => {
  void stop("SIGTERM");
});

const main = async () => {
  await pg.initialise();
  await pg.start();

  try {
    await pg.createDatabase(databaseName);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (!message.toLowerCase().includes("already exists")) {
      throw error;
    }
  }

  console.log(
    `[embedded-postgres] ready at postgresql://${user}:${password}@127.0.0.1:${port}/${databaseName}`,
  );

  await new Promise(() => {});
};

main().catch((error) => {
  console.error("[embedded-postgres] failed to start", error);
  process.exit(1);
});
