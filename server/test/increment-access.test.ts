import { describe, expect, it, vi } from "vitest";

type MockedLink = {
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: Date;
};

let mockedExistingLinks: MockedLink[] = [];
let updateCalls = 0;

vi.mock("../src/db/index.ts", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => mockedExistingLinks,
        }),
      }),
    }),
    update: () => ({
      set: () => ({
        where: async () => {
          updateCalls += 1;
        },
      }),
    }),
  },
}));

describe("PATCH /links/:shortUrl/access", () => {
  it("returns 404 for unknown shortUrl", async () => {
    mockedExistingLinks = [];
    updateCalls = 0;

    const { buildApp } = await import("./helpers/build-app");
    const app = buildApp();
    const response = await app.inject({
      method: "PATCH",
      url: "/links/inexistente/access",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      message: "Link not found",
      statusCode: 404,
    });
    expect(updateCalls).toBe(0);
  });

  it("returns 204 and increments the counter when the link exists", async () => {
    mockedExistingLinks = [
      {
        id: "link-1",
        originalUrl: "https://example.com",
        shortUrl: "example",
        accessCount: 2,
        createdAt: new Date("2026-04-24T00:00:00.000Z"),
      },
    ];
    updateCalls = 0;

    const { buildApp } = await import("./helpers/build-app");
    const app = buildApp();
    const response = await app.inject({
      method: "PATCH",
      url: "/links/example/access",
    });

    expect(response.statusCode).toBe(204);
    expect(response.body).toBe("");
    expect(updateCalls).toBe(1);
  });
});
