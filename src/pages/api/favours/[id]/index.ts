import { ApiError } from "lib/errorHandler";
import { authGuard } from "lib/middleware";
import createHandler from "lib/routeHandler";
import createValidator from "lib/validator";
import { favourValidation } from "lib/validator/schemas";
import { Favour } from "models";

const handler = createHandler();
const validate = createValidator(favourValidation);

// =================== Read single request =====================

handler.get(authGuard, async (req, res) => {
  const { id } = await validate(req);

  const favour = await Favour.findById(id);
  if (!favour) throw new ApiError(400, "No Favour with that ID exists.");

  // User is not related to the favour
  if (req.userId !== favour.debtor._id && req.userId !== favour.recipient._id)
    throw new ApiError(403, "You do not have permission to view this favour.");

  res.json(favour);
});

// =================== Update favour =====================

handler.put(authGuard, async (req, res) => {
  const { id, rewards } = await validate(req, "updateFavour");

  const favour = await Favour.findById(id);
  if (!favour) throw new ApiError(400, "No Favour with that ID exists.");

  const isCreator = req.userId === favour.creator._id;
  if (!isCreator) throw new ApiError(403, "You do not have permission to perform this action.");

  // Update the local favour object then write to db
  favour.set({ rewards });
  await favour.save();

  res.json(favour);
});

// =================== Delete favour =====================

handler.delete(authGuard, async (req, res) => {
  const { id } = await validate(req);

  const favour = await Favour.findById(id);
  if (!favour) throw new ApiError(400, "Favour not found");

  const { debtor, recipient, evidence } = favour;

  // Don't let others delete the favour
  const canDelete = req.userId === recipient._id || (req.userId === debtor._id && evidence);
  if (!canDelete) throw new ApiError(400, "You do not have permission to delete this favour.");

  // Remove the favour
  await favour.deleteOne();

  res.status(204).end();
});

export default handler;
