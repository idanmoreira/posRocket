type CsvLinkRow = {
  accessCount: number;
  createdAt: Date;
  id: string;
  originalUrl: string;
  shortUrl: string;
};

const escapeCsvValue = (value: string) => {
  const needsQuoting = /[",\n\r]/.test(value);

  if (!needsQuoting) {
    return value;
  }

  return `"${value.replace(/"/g, '""')}"`;
};

export const buildLinksCsv = (rows: CsvLinkRow[]) => {
  const header = "ID,Original URL,Short URL,Access Count,Created at";
  const lines = rows.map((row) =>
    [
      escapeCsvValue(row.id),
      escapeCsvValue(row.originalUrl),
      escapeCsvValue(row.shortUrl),
      String(row.accessCount),
      row.createdAt.toISOString(),
    ].join(","),
  );

  return [header, ...lines].join("\n");
};
