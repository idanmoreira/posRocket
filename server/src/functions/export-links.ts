import { desc } from "drizzle-orm";

import { db } from "../db";
import { links } from "../db/schema";
import { env } from "../env";
import { buildLinksCsv } from "../utils/csv";

export const exportLinks = async () => {
  const rows = await db.select().from(links).orderBy(desc(links.createdAt));
  const csv = buildLinksCsv(rows);

  if (env.USE_PGMEM) {
    return {
      url: `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`,
    };
  }

  const key = `${crypto.randomUUID()}.csv`;
  const { uploadFileToR2 } = await import("../lib/r2");
  const { url } = await uploadFileToR2(key, csv);

  return { url };
};
