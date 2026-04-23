import cors from "@fastify/cors";
import Fastify from "fastify";

import { linksRoutes } from "./routes/links";
import { toErrorResponse } from "./utils/errors";

export const buildApp = () => {
  const app = Fastify();

  app.register(cors, { origin: true });
  app.register(linksRoutes);

  app.setErrorHandler((error, _request, reply) => {
    const { message, statusCode } = toErrorResponse(error);

    reply.status(statusCode).send({ message, statusCode });
  });

  return app;
};
