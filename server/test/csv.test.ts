import { describe, expect, it } from "vitest";

import { buildLinksCsv } from "../src/utils/csv";

describe("buildLinksCsv", () => {
  it("does not quote simple values", () => {
    const csv = buildLinksCsv([
      {
        id: "link-id",
        originalUrl: "https://example.com",
        shortUrl: "example",
        accessCount: 1,
        createdAt: new Date("2026-04-23T12:00:00.000Z"),
      },
    ]);

    expect(csv).toBe(
      [
        "ID,Original URL,Short URL,Access Count,Created at",
        "link-id,https://example.com,example,1,2026-04-23T12:00:00.000Z",
      ].join("\n"),
    );
  });

  it("quotes values that contain commas, quotes or newlines", () => {
    const csv = buildLinksCsv([
      {
        id: "comma-id",
        originalUrl: "https://example.com/path?a=1,b=2",
        shortUrl: "with-comma",
        accessCount: 3,
        createdAt: new Date("2026-04-23T12:00:00.000Z"),
      },
      {
        id: "quote-id",
        originalUrl: 'https://example.com/"quoted"',
        shortUrl: "with-quote",
        accessCount: 0,
        createdAt: new Date("2026-04-23T12:00:00.000Z"),
      },
    ]);

    const [header, firstRow, secondRow] = csv.split("\n");

    expect(header).toBe("ID,Original URL,Short URL,Access Count,Created at");
    expect(firstRow).toBe(
      'comma-id,"https://example.com/path?a=1,b=2",with-comma,3,2026-04-23T12:00:00.000Z',
    );
    expect(secondRow).toBe(
      'quote-id,"https://example.com/""quoted""",with-quote,0,2026-04-23T12:00:00.000Z',
    );
  });
});
