import { env } from "../env";

type HttpMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

type HttpRequestOptions = {
  body?: BodyInit | object;
  headers?: HeadersInit;
  method?: HttpMethod;
  signal?: AbortSignal;
};

type ErrorResponse = {
  message: string;
  statusCode: number;
};

export class HttpError extends Error {
  readonly statusCode: number;

  constructor({ message, statusCode }: ErrorResponse) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

const buildHeaders = (body: HttpRequestOptions["body"], headers?: HeadersInit) => {
  if (body instanceof FormData) {
    return headers;
  }

  return {
    "Content-Type": "application/json",
    ...headers,
  };
};

const buildBody = (body: HttpRequestOptions["body"]) => {
  if (body == null || body instanceof FormData || typeof body === "string") {
    return body;
  }

  return JSON.stringify(body);
};

export const http = async <TResponse>(
  path: string,
  { body, headers, method = "GET", signal }: HttpRequestOptions = {},
): Promise<TResponse> => {
  const response = await fetch(new URL(path, env.VITE_BACKEND_URL), {
    method,
    body: buildBody(body),
    headers: buildHeaders(body, headers),
    signal,
  });

  if (!response.ok) {
    const errorResponse = (await response.json().catch(() => null)) as ErrorResponse | null;

    throw new HttpError({
      message: errorResponse?.message ?? "Unexpected error",
      statusCode: errorResponse?.statusCode ?? response.status,
    });
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
};
