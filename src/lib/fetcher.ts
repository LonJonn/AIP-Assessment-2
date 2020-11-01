import { ServerError, isServerError } from "lib/errorHandler";

/**
 * Client-side fetcher for use with SWR or a one-off fetch.
 *
 * @param path API Endpoint to fetch
 * @param accessToken Current user's access token if any
 * @param init Additional fetch options
 */
export default async function fetcher(path: string, accessToken?: string, init: RequestInit = {}) {
  // Assign auth header to each request
  init.headers = {
    authorization: accessToken ? `Bearer ${accessToken}` : "",
    ...init.headers,
  };

  const res = await fetch(path, init);
  const hasJSON = res.headers.get("Content-Type")?.includes("json");

  // If the request resulted in bad response (i.e. not 200 - 299)
  if (!res.ok) {
    // If response has JSON, get error details
    const errorDetails = hasJSON ? await res.json() : {};

    // Throw if server error
    if (isServerError(errorDetails)) throw errorDetails;

    // Otherwise construct generic error
    throw {
      status: "error",
      type: "unknown",
      statusCode: res.status,
      errors: [{ message: res.statusText }],
    } as ServerError;
  }

  return hasJSON && (await res.json());
}
