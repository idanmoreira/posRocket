import type { FastifyPluginAsync } from "fastify";

import { createLink } from "../functions/create-link";
import { deleteLink } from "../functions/delete-link";
import { exportLinks } from "../functions/export-links";
import { getLinkByShortUrl } from "../functions/get-link-by-short-url";
import { incrementLinkAccess } from "../functions/increment-link-access";
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

  app.patch("/links/:shortUrl/access", async (request, reply) => {
    const { shortUrl } = request.params as { shortUrl: string };
    const link = await incrementLinkAccess(shortUrl);

    if (!link) {
      const error = new Error("Link not found") as Error & { statusCode: number };

      error.statusCode = 404;
      throw error;
    }

    return reply.status(204).send();
  });

  app.delete("/links/:shortUrl", async (request, reply) => {
    const { shortUrl } = request.params as { shortUrl: string };
    const link = await deleteLink(shortUrl);

    if (!link) {
      const error = new Error("Link not found") as Error & { statusCode: number };

      error.statusCode = 404;
      throw error;
    }

    return reply.status(204).send();
  });

  app.post("/links/export", async (request, reply) => {
    const result = await exportLinks();

    return reply.status(201).send(result);
  });
};
