import { describe, expect, it } from "vitest";

import { buildApp } from "./helpers/build-app";

describe("GET /links", () => {
  it("returns 200", async () => {
    const app = buildApp();
    const response = await app.inject({ method: "GET", url: "/links" });

    expect(response.statusCode).toBe(200);
  });
});
