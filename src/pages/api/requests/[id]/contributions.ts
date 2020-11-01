import { ApiError } from "lib/errorHandler";
import { authGuard } from "lib/middleware";
import createHandler from "lib/routeHandler";
import createValidator from "lib/validator";
import { Request, User } from "models";
import { requestValidation } from "lib/validator/schemas";

const handler = createHandler();
const validate = createValidator(requestValidation);

// ==================== Update Request contribution ====================

handler.put(authGuard, async (req, res) => {
  const { id, rewards } = await validate(req);

  const request = await Request.findById(id);
  if (!request) throw new ApiError(400, "No Request with that ID exists.");

  // Don't let owners remove their contribution, they must delete the request altogether
  if (request.owner._id === req.userId && !rewards)
    throw new ApiError(400, "Request owner cannot remove their contribution.");

  // Find the current user data to embed
  const user = await User.findById(req.userId);
  const { contributions } = request;

  // Update the new rewards if any otherwise remove the contribution
  if (rewards) {
    contributions.set(user._id, { user: user.asEmbedded(), rewards });
  } else {
    contributions.delete(user._id);
  }

  // Write the updates to the DB
  await request.save();

  res.status(200).json(request);
});

export default handler;
