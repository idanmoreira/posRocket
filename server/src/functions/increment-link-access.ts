import { eq, sql } from "drizzle-orm";

import { db } from "../db";
import { links } from "../db/schema";

export const incrementLinkAccess = async (shortUrl: string) => {
  const [link] = await db
    .update(links)
    .set({ accessCount: sql`${links.accessCount} + 1` })
    .where(eq(links.shortUrl, shortUrl))
    .returning();

  return link ?? null;
};
