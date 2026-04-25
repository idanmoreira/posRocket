import { ZodError } from "zod";

type ErrorWithStatusCode = Error & {
  cause?: {
    code?: string;
    data?: {
      code?: string;
    };
  };
  code?: string;
  statusCode?: number;
};

export type ErrorResponse = {
  message: string;
  statusCode: number;
};

export const toErrorResponse = (error: ErrorWithStatusCode): ErrorResponse => {
  if (error instanceof ZodError) {
    return {
      message: error.issues[0]?.message ?? "Validation error",
      statusCode: 400,
    };
  }

  if (
    error.code === "23505" ||
    error.cause?.code === "23505" ||
    error.cause?.data?.code === "23505"
  ) {
    return {
      message: "Short URL already exists",
      statusCode: 409,
    };
  }

  const statusCode = error.statusCode ?? 500;
  const message =
    statusCode === 500 ? "Internal server error" : error.message;

  return { message, statusCode };
};
