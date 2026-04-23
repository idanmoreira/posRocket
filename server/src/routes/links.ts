import type { FastifyPluginAsync } from "fastify";

import { createLink } from "../functions/create-link";
import { getLinkByShortUrl } from "../functions/get-link-by-short-url";
import { listLinks } from "../functions/list-links";

export const linksRoutes: FastifyPluginAsync = async (app) => {
  app.post("/links", async (request, reply) => {
    const link = await createLink(request.body);

    return reply.status(201).send(link);
  });

  app.get("/links", async () => listLinks());

  app.get("/links/:shortUrl", async (request) => {
    const { shortUrl } = request.params as { shortUrl: string };
    const link = await getLinkByShortUrl(shortUrl);

    if (!link) {
      const error = new Error("Link not found") as Error & { statusCode: number };

      error.statusCode = 404;
      throw error;
    }

    return link;
  });
};
