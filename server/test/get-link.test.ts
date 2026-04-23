import { describe, expect, it, vi } from "vitest";

vi.mock("../src/db/index.ts", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => [],
        }),
      }),
    }),
  },
}));

describe("GET /links/:shortUrl", () => {
  it("returns 404 when the link does not exist", async () => {
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
