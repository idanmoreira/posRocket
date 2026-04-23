import type { FastifyPluginAsync } from "fastify";

export const linksRoutes: FastifyPluginAsync = async (app) => {
  app.get("/links", async () => []);
};
