import { describe, expect, it, vi } from "vitest";

let mockedUpdatedLinks: Array<{
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: Date;
}> = [];

vi.mock("../src/db/index.ts", () => ({
  db: {
    update: () => ({
      set: () => ({
        where: () => ({
          returning: async () => mockedUpdatedLinks,
        }),
      }),
    }),
  },
}));

describe("PATCH /links/:shortUrl/access", () => {
  it("returns 404 for unknown shortUrl", async () => {
    mockedUpdatedLinks = [];

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
  });
});
