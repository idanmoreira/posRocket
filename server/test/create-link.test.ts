import { describe, expect, it, vi } from "vitest";

import { createLinkSchema } from "../src/utils/short-url-schema";

vi.mock("../src/db/index.ts", () => ({
  db: {
    insert: () => ({
      values: () => ({
        returning: async () => [
          {
            id: "test-link-id",
            originalUrl: "https://example.com",
            shortUrl: "rocket-link",
            accessCount: 0,
            createdAt: new Date(),
          },
        ],
      }),
    }),
  },
}));

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

  it("creates a link with valid data", async () => {
    const { buildApp } = await import("./helpers/build-app");
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/links",
      payload: {
        originalUrl: "https://example.com",
        shortUrl: "rocket-link",
      },
    });

    expect(response.statusCode).toBe(201);
  });
});
