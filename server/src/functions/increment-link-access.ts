import { eq } from "drizzle-orm";

import { db } from "../db";
import { links } from "../db/schema";

export const incrementLinkAccess = async (shortUrl: string) => {
  const [current] = await db
    .select()
    .from(links)
    .where(eq(links.shortUrl, shortUrl))
    .limit(1);

  if (!current) {
    return null;
  }

  const nextAccessCount = current.accessCount + 1;

  await db
    .update(links)
    .set({ accessCount: nextAccessCount })
    .where(eq(links.shortUrl, shortUrl));

  return {
    ...current,
    accessCount: nextAccessCount,
  };
};
