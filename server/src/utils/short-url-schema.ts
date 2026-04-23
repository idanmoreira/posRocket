import { z } from "zod";

export const createLinkSchema = z.object({
  originalUrl: z.string().url(),
  shortUrl: z.string().min(3).max(30).regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/),
});
