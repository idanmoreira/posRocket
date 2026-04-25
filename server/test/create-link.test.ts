import { beforeEach, describe, expect, it, vi } from "vitest";

import { createLinkSchema } from "../src/utils/short-url-schema";

const mockedReturning = vi.fn();
let mockedExistingLinks: Array<{ id: string }> = [];

vi.mock("../src/db/index.ts", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => mockedExistingLinks,
        }),
      }),
    }),
    insert: () => ({
      values: () => ({
        returning: mockedReturning,
      }),
    }),
  },
}));

describe("createLinkSchema", () => {
  beforeEach(() => {
    mockedExistingLinks = [];
    mockedReturning.mockReset();
    mockedReturning.mockResolvedValue([
      {
        id: "test-link-id",
        originalUrl: "https://example.com",
        shortUrl: "rocket-link",
        accessCount: 0,
        createdAt: new Date(),
      },
    ]);
  });

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

  it("returns 400 for an invalid shortUrl payload", async () => {
    const { buildApp } = await import("./helpers/build-app");
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/links",
      payload: {
        originalUrl: "https://example.com",
        shortUrl: "Meu Link",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: "Invalid string: must match pattern /^[a-z0-9][a-z0-9-]*[a-z0-9]$/",
      statusCode: 400,
    });
  });

  it("returns 409 when the shortUrl already exists", async () => {
    mockedExistingLinks = [{ id: "existing-link-id" }];
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

    expect(response.statusCode).toBe(409);
    expect(response.json()).toEqual({
      message: "Short URL already exists",
      statusCode: 409,
    });
  });
});
