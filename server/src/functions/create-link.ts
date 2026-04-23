import { db } from "../db";
import { links } from "../db/schema";
import { createLinkSchema } from "../utils/short-url-schema";

export const createLink = async (input: unknown) => {
  const data = createLinkSchema.parse(input);

  const [link] = await db.insert(links).values(data).returning();

  return link;
};
