import { ApiError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import createValidator from "lib/validator";
import Request from "models/Request";
import { requestValidation } from "lib/validator/schemas";

const handler = createHandler();
const validate = createValidator(requestValidation);

// ==================== Read a single existing Request ====================

handler.get(async (req, res) => {
  const { id } = await validate(req);

  const request = await Request.findById(id);
  if (!request) throw new ApiError(400, "No Request with that ID exists.");

  res.json(request);
});

// ==================== Update Request Details ====================

handler.put(authMiddleware, async (req, res) => {
  const { id, ...updateBody } = await validate(req);

  const request = await Request.findById(id);
  if (!request) throw new ApiError(400, "No Request with that ID exists.");

  // User is not the owner
  if (request.owner._id !== req.userId)
    throw new ApiError(403, "You do not have permission to perform this action.");

  // Set the local object and then write to db
  request.set(updateBody);
  await request.save();

  res.json(request);
});

// ==================== Delete Request ====================

handler.delete(authMiddleware, async (req, res) => {
  const { id } = await validate(req);

  const request = await Request.findById(id);
  if (!request) throw new ApiError(400, "No Request with that ID exists.");

  // User is not the owner
  if (request.owner._id !== req.userId)
    throw new ApiError(403, "You do not have permission to perform this action.");

  await request.deleteOne();

  res.status(204).end();
});

export default handler;
