import { http } from "./http";
import type { Link } from "./create-link";

export const getLink = (shortUrl: string) => http<Link>(`/links/${shortUrl}`);
