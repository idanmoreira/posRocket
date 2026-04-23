import { describe, expect, it, vi } from "vitest";

const uploadFileToR2 = vi.fn(async (_key: string, _body: string) => ({
  url: "https://cdn.brev.ly/exports/test.csv",
}));

vi.mock("../src/db/index.ts", () => ({
  db: {
    select: () => ({
      from: () => ({
        orderBy: async () => [
          {
            id: "link-1",
            originalUrl: "https://example.com",
            shortUrl: "example",
            accessCount: 1,
            createdAt: new Date("2026-04-23T12:00:00.000Z"),
          },
        ],
      }),
    }),
    insert: () => ({
      values: () => ({
        returning: async () => [],
      }),
    }),
    update: () => ({
      set: () => ({
        where: () => ({
          returning: async () => [],
        }),
      }),
    }),
    delete: () => ({
      where: () => ({
        returning: async () => [],
      }),
    }),
  },
}));

vi.mock("../src/lib/r2.ts", () => ({
  uploadFileToR2,
}));

describe("POST /links/export", () => {
  it("returns 200 or 201 with a public url", async () => {
    const { buildApp } = await import("./helpers/build-app");
    const app = buildApp();
    const response = await app.inject({ method: "POST", url: "/links/export" });

    expect([200, 201]).toContain(response.statusCode);
    expect(response.json()).toEqual({
      url: "https://cdn.brev.ly/exports/test.csv",
    });
    expect(uploadFileToR2).toHaveBeenCalledTimes(1);
  });
});
