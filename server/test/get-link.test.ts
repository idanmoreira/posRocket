import { describe, expect, it, vi } from "vitest";

const existingLink = {
  id: "link-1",
  originalUrl: "https://example.com",
  shortUrl: "existente",
  accessCount: 12,
  createdAt: new Date("2026-04-23T12:00:00.000Z"),
};

let mockedLinks: typeof existingLink[] = [];

vi.mock("../src/db/index.ts", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => mockedLinks,
        }),
      }),
    }),
  },
}));

describe("GET /links/:shortUrl", () => {
  it("returns 200 and the link when the shortUrl exists", async () => {
    mockedLinks = [existingLink];

    const { buildApp } = await import("./helpers/build-app");
    const app = buildApp();
    const response = await app.inject({ method: "GET", url: "/links/existente" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      ...existingLink,
      createdAt: existingLink.createdAt.toJSON(),
    });
  });

  it("returns 404 when the link does not exist", async () => {
    mockedLinks = [];

    const { buildApp } = await import("./helpers/build-app");
    const app = buildApp();
    const response = await app.inject({ method: "GET", url: "/links/inexistente" });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      message: "Link not found",
      statusCode: 404,
    });
  });
});
