import { http } from "./http";

export type ExportLinksResponse = {
  url: string;
};

export const exportLinks = () => {
  return http<ExportLinksResponse>("/links/export", {
    method: "POST",
  });
};
