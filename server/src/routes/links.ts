import type { FastifyPluginAsync } from "fastify";

import { createLink } from "../functions/create-link";

export const linksRoutes: FastifyPluginAsync = async (app) => {
  app.post("/links", async (request, reply) => {
    const link = await createLink(request.body);

    return reply.status(201).send(link);
  });

  app.get("/links", async () => []);
};
