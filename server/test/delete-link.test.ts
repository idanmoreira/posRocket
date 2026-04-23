import { describe, expect, it, vi } from "vitest";

let mockedDeletedLinks: Array<{
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: Date;
}> = [];

vi.mock("../src/db/index.ts", () => ({
  db: {
    delete: () => ({
      where: () => ({
        returning: async () => mockedDeletedLinks,
      }),
    }),
  },
}));

describe("DELETE /links/:shortUrl", () => {
  it("returns 404 for unknown shortUrl", async () => {
    mockedDeletedLinks = [];

    const { buildApp } = await import("./helpers/build-app");
    const app = buildApp();
    const response = await app.inject({
      method: "DELETE",
      url: "/links/inexistente",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      message: "Link not found",
      statusCode: 404,
    });
  });
});
