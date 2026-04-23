import { eq } from "drizzle-orm";

import { db } from "../db";
import { links } from "../db/schema";

export const getLinkByShortUrl = async (shortUrl: string) => {
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.shortUrl, shortUrl))
    .limit(1);

  return link ?? null;
};
