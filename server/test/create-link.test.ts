import { describe, expect, it } from "vitest";
import { createLinkSchema } from "../src/utils/short-url-schema";

describe("createLinkSchema", () => {
  it("accepts a valid originalUrl and shortUrl", () => {
    const result = createLinkSchema.safeParse({
      originalUrl: "https://example.com",
      shortUrl: "meu-link",
    });

    expect(result.success).toBe(true);
  });
});
