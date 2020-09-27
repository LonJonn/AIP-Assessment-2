import { admin } from "lib/firebase/admin";
import type { NextApiRequest, NextApiResponse } from "next";
import type { RequestHandler } from "next-connect";

export type AuthenticatedRequest = NextApiRequest & {
  userId: string;
};

const authMiddleware: RequestHandler<
  AuthenticatedRequest,
  NextApiResponse
> = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).end();
  }

  try {
    const tokenPayload = await admin.auth().verifyIdToken(accessToken);
    req.userId = tokenPayload.sub;
    next();
  } catch (error) {
    // Invalid access token
    res.status(403).end();
  }
};

export default authMiddleware;
