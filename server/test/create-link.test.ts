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

  it("rejects an invalid originalUrl", () => {
    const result = createLinkSchema.safeParse({
      originalUrl: "not-a-url",
      shortUrl: "meu-link",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a shortUrl with invalid shape", () => {
    const result = createLinkSchema.safeParse({
      originalUrl: "https://example.com",
      shortUrl: "Meu Link",
    });

    expect(result.success).toBe(false);
  });
});
