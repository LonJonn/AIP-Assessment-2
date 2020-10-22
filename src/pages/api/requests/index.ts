import { NoUserError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import createValidator from "lib/validator";
import { Request, User } from "models";
import { requestValidation } from "lib/validator/schemas";
import { ApiError } from "next/dist/next-server/server/api-utils";

const handler = createHandler();
const validate = createValidator(requestValidation);

// ==================== Get all Requests ====================

handler.get(async (req, res) => {
  const { page = 1, limit = 4 } = req.query;
  const requests = await Request.find()
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));
  const numberOfRequests = await Request.countDocuments();
  if (!requests) throw new ApiError(503, "Requests couldn't be loaded!");
  res.json({
    requests,
    currentPage: page,
    totalPages: Math.ceil(numberOfRequests / Number(limit)),
  });
});

// ==================== Create Request ====================

handler.post(authMiddleware, async (req, res) => {
  const { title, description, rewards } = await validate(req, "create");

  // Try to find user by their ID
  const user = await User.findById(req.userId);
  if (!user) throw new NoUserError();

  // Create initial contributions with current user as first contributor
  const contributions = {
    [req.userId]: {
      user: user.asEmbedded(),
      rewards,
    },
  };

  const newRequest = await Request.create({
    title,
    description,
    contributions,
    owner: user.asEmbedded(),
    isClaimed: false,
  });

  res.status(201).json(newRequest);
});

export default handler;
