import { describe, expect, it, vi } from "vitest";

const links = [
  {
    id: "link-2",
    originalUrl: "https://openai.com",
    shortUrl: "openai",
    accessCount: 3,
    createdAt: new Date("2026-04-23T12:00:00.000Z"),
  },
  {
    id: "link-1",
    originalUrl: "https://example.com",
    shortUrl: "example",
    accessCount: 1,
    createdAt: new Date("2026-04-22T12:00:00.000Z"),
  },
];

vi.mock("../src/db/index.ts", () => ({
  db: {
    select: () => ({
      from: () => ({
        orderBy: async () => links,
      }),
    }),
  },
}));

describe("GET /links", () => {
  it("returns the links ordered by newest first", async () => {
    const { buildApp } = await import("./helpers/build-app");
    const app = buildApp();

    const response = await app.inject({ method: "GET", url: "/links" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([
      {
        ...links[0],
        createdAt: links[0].createdAt.toJSON(),
      },
      {
        ...links[1],
        createdAt: links[1].createdAt.toJSON(),
      },
    ]);
  });
});
