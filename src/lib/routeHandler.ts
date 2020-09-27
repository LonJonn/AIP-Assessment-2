import { withDatabase } from "lib/middleware";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import errorHandler from "lib/errorHandler";

/**
 * Wrapper for `next-connect`s handler that has a error handler
 * and global middleware pre applied.
 */
export default function createHandler() {
  // Create a new route handler with the custom error handler attached
  const handler = nextConnect<NextApiRequest, NextApiResponse>({
    onError: errorHandler,
  });

  // Apply global middleware
  handler.use(withDatabase);

  return handler;
}
