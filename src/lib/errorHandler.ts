import { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "yup";
import type { ErrorHandler } from "next-connect";

// Utility Type Guard
export function isServerError(error: Object): error is ServerError {
  return error.hasOwnProperty("type") && error.hasOwnProperty("errors");
}

// =================== Custom Errors =====================

/**
 * Custom Error for handling any expected api errors
 */
export class ApiError extends Error {
  public readonly statusCode;

  /**
   * @param statusCode The HTTP Status Code of the response e.g. (400, 401, etc.)
   * @param message The message to be sent in the response
   */
  constructor(statusCode: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
  }
}

/**
 * Custom Error for non existent users
 */
export class NoUserError extends ApiError {
  constructor() {
    super(400, "No User with that ID exists.");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// =================== Error Handler =====================

interface IError {
  field?: string;
  message: string;
}

/**
 * Format of errors returned from the server
 */
export interface ServerError {
  type: "api" | "validation" | "unknown";
  status: "error";
  statusCode: number;
  errors: IError[];
}

/**
 * Custom error handling middleware to catch expected errors or
 * return a default 500 error message if unknown
 */
const errorHandler: ErrorHandler<NextApiRequest | any, NextApiResponse | any> = (
  err,
  req,
  res,
  next
) => {
  /**
   * Expected Api Errors
   */
  if (err instanceof ApiError) {
    const { statusCode, message } = err;

    const errors: IError[] = [{ message }];

    return res.status(statusCode).json({
      type: "api",
      status: "error",
      statusCode,
      errors,
    } as ServerError);
  }

  /**
   * Validation Errors
   */
  if (err instanceof ValidationError) {
    const errors = err.inner.map((vErr) => ({
      field: vErr.path,
      message: vErr.message,
    }));

    return res.status(400).json({
      type: "validation",
      status: "error",
      statusCode: 400,
      errors,
    } as ServerError);
  }

  /**
   * Unexpected errors
   */
  res.status(500).send("Something went wrong.");
  console.error(err.stack);
};

export default errorHandler;
