import { ErrorResponse } from "lib/errorHandler";

export interface FetcherError {
  status: number;
  statusText: string;
  details?: ErrorResponse;
}

/**
 * Client-side fetcher for use with SWR or a one-off fetch.
 *
 * @param path API Endpoint to fetch
 * @param accessToken Current user's access token if any
 * @param init Additional fetch options
 */
export default async function fetcher(
  path: string,
  accessToken?: string,
  init: RequestInit = {}
) {
  // Assign auth header to each request
  init.headers = {
    authorization: accessToken ? `Bearer ${accessToken}` : "",
    ...init.headers,
  };

  const res = await fetch(path, init);

  // If the request resulted in bad response (i.e. not 200 - 299)
  if (!res.ok) {
    // If response has JSON, get error details
    const contentType = res.headers.get("Content-Type") || "";
    const details = contentType.includes("json") ? await res.json() : null;

    // Construct Fetcher Error
    const error: FetcherError = {
      status: res.status,
      statusText: res.statusText,
      details,
    };

    // Throw the error to be caught by either SWR or any try/catch blocks
    throw error;
  }

  return await res.json();
}
