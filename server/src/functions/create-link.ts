import { eq } from "drizzle-orm";

import { db } from "../db";
import { links } from "../db/schema";
import { env } from "../env";
import { createLinkSchema } from "../utils/short-url-schema";

export const createLink = async (input: unknown) => {
  const data = createLinkSchema.parse(input);
  const [existingLink] = await db
    .select({ id: links.id })
    .from(links)
    .where(eq(links.shortUrl, data.shortUrl))
    .limit(1);

  if (existingLink) {
    const error = new Error("Short URL already exists") as Error & {
      statusCode: number;
    };
    error.statusCode = 409;
    throw error;
  }

  const values = env.USE_PGMEM
    ? {
        ...data,
        id: crypto.randomUUID(),
      }
    : data;

  const [link] = await db.insert(links).values(values).returning();

  return link;
};
