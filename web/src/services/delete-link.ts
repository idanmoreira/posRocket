import { http } from "./http";
import type { Link } from "./create-link";

export const deleteLink = (shortUrl: string) => {
  return http<Link>(`/links/${shortUrl}`, {
    method: "DELETE",
  });
};
