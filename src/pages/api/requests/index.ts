import { NoUserError } from "lib/errorHandler";
import { authGuard } from "lib/middleware";
import createHandler from "lib/routeHandler";
import createValidator from "lib/validator";
import { Request, User } from "models";
import { requestValidation } from "lib/validator/schemas";

const handler = createHandler();
const validate = createValidator(requestValidation);

// ==================== Get all Requests ====================

handler.get(async (req, res) => {
  const { page = 1, limit = 6, q } = req.query;

  // Create initial pipeline with pagination stage
  const pipeline: Object[] = [
    {
      $facet: {
        metadata: [{ $count: "total" }, { $addFields: { page: Number(page) } }],
        data: [{ $skip: (Number(page) - 1) * Number(limit) }, { $limit: Number(limit) }],
      },
    },
  ];

  // If query add search stage to pipeline
  if (q) {
    pipeline.splice(0, 0, {
      $search: {
        autocomplete: {
          path: "title",
          query: req.query.q,
        },
      },
    });
  }

  // Deconstruct metadata and data from aggregation result
  const [{ metadata, data }] = await Request.aggregate(pipeline);
  const numberOfRequests = metadata[0]?.total || 0; // Total number of matching requests

  res.json({
    requests: data,
    currentPage: page,
    totalPages: Math.ceil(numberOfRequests / Number(limit)),
  });
});

// ==================== Create Request ====================

handler.post(authGuard, async (req, res) => {
  const { title, description, rewards } = await validate(req, "create");

  // Try to find user by their ID
  const user = await User.findById(req.userId);
  if (!user) throw new NoUserError();

  // Create initial contributions with current user as first contributor
  const contributions = {
    [req.userId]: {
      user: user.toJSON(),
      rewards,
    },
  };

  const newRequest = await Request.create({
    title,
    description,
    contributions,
    owner: user.toJSON(),
    isClaimed: false,
  });

  res.status(201).json(newRequest);
});

export default handler;
