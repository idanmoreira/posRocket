import { buildApp } from "./app";
import { env } from "./env";

const app = buildApp();

const start = async () => {
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
};

start().catch((error) => {
  app.log.error(error);
  process.exit(1);
});
