import { http } from "./http";
import type { Link } from "./create-link";

export const listLinks = () => http<Link[]>("/links");
