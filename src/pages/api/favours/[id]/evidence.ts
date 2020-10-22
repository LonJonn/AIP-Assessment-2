import { ApiError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import createValidator from "lib/validator";
import { favourValidation } from "lib/validator/schemas";
import { Favour } from "models";

const handler = createHandler();
const validate = createValidator(favourValidation);

// =================== Submitting evidence =====================

handler.post(authMiddleware, async (req, res) => {
  const { id, evidence } = await validate(req);

  const favour = await Favour.findById(id);
  if (!favour) throw new ApiError(400, "No Favour with that ID exists.");

  // Update local favour object then write to db
  favour.set({ evidence });
  await favour.save();

  res.json(favour);
});

export default handler;
