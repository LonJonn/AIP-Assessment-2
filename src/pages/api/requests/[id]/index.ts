import { ApiError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import Request, { requestValidation } from "models/Request";

const handler = createHandler();

// ==================== Read a single existing Request ====================

handler.get(async (req, res) => {
  const { id } = await requestValidation.validate(req.query, { abortEarly: false });

  const request = await Request.findById(id);
  if (!request) throw new ApiError(400, "No Request with that ID exists.");

  res.json(request);
});

// ==================== Update Request Details ====================

handler.put(authMiddleware, async (req, res) => {
  // validates req.body and req.query as one object
  const { id, ...updateBody } = await requestValidation.validate(
    { ...req.query, ...req.body },
    { abortEarly: false, stripUnknown: true } // strip additional key-values from body so that we can set the request directly
  );

  const request = await Request.findById(id);
  if (!request) throw new ApiError(400, "No Request with that ID exists.");

  // User is not the owner
  if (request.contributions[0].user._id !== req.userId)
    throw new ApiError(403, "You do not have permission to perform this action.");

  // Set the local object and then write to db
  request.set(updateBody);
  await request.save();

  res.json(request);
});

// ==================== Delete Request ====================

handler.delete(authMiddleware, async (req, res) => {
  const { id } = await requestValidation.validate(req.query, { abortEarly: false });

  const request = await Request.findById(id);
  if (!request) throw new ApiError(400, "No Request with that ID exists.");

  // User is not the owner
  if (request.contributions[0].user._id !== req.userId)
    throw new ApiError(403, "You do not have permission to perform this action.");

  await request.deleteOne();

  res.status(204).end();
});

export default handler;
