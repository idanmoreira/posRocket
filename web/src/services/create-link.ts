import { http } from "./http";

export type Link = {
  accessCount: number;
  createdAt: string;
  id: string;
  originalUrl: string;
  shortUrl: string;
};

export type CreateLinkInput = {
  originalUrl: string;
  shortUrl: string;
};

export const createLink = (input: CreateLinkInput) => {
  return http<Link>("/links", {
    method: "POST",
    body: input,
  });
};
