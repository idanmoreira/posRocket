import { desc } from "drizzle-orm";

import { db } from "../db";
import { links } from "../db/schema";

export const listLinks = async () => {
  return db.select().from(links).orderBy(desc(links.createdAt));
};
