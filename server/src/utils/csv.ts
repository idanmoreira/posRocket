type CsvLinkRow = {
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: Date;
};

export const buildLinksCsv = (rows: CsvLinkRow[]) => {
  const header = "originalUrl,shortUrl,accessCount,createdAt";
  const lines = rows.map((row) =>
    [
      row.originalUrl,
      row.shortUrl,
      String(row.accessCount),
      row.createdAt.toISOString(),
    ].join(","),
  );

  return [header, ...lines].join("\n");
};
