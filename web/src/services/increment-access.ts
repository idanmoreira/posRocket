import { http } from "./http";
import type { Link } from "./create-link";

export const incrementAccess = (shortUrl: string) => {
  return http<Link>(`/links/${shortUrl}/access`, {
    method: "PATCH",
  });
};
