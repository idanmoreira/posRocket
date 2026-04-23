type ErrorWithStatusCode = Error & {
  statusCode?: number;
};

export type ErrorResponse = {
  message: string;
  statusCode: number;
};

export const toErrorResponse = (error: ErrorWithStatusCode): ErrorResponse => {
  const statusCode = error.statusCode ?? 500;
  const message =
    statusCode === 500 ? "Internal server error" : error.message;

  return { message, statusCode };
};
