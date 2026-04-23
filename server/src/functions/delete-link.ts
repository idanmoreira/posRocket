import { eq } from "drizzle-orm";

import { db } from "../db";
import { links } from "../db/schema";

export const deleteLink = async (shortUrl: string) => {
  const [link] = await db
    .delete(links)
    .where(eq(links.shortUrl, shortUrl))
    .returning();

  return link ?? null;
};
