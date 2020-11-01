import { NoUserError, ApiError } from "lib/errorHandler";
import { authGuard } from "lib/middleware";
import createHandler from "lib/routeHandler";
import { Favour, User } from "models";
import { favourValidation } from "lib/validator/schemas";
import createValidator from "lib/validator";
import PartyDetector from "lib/PartyDetector";

const handler = createHandler();
const validate = createValidator(favourValidation);

// =================== Get User Favours =====================

handler.get(authGuard, async (req, res) => {
  let { page = 1, limit = 6, q } = req.query;
  page = Number(page);
  limit = Number(limit);

  if (q !== "owing" && q !== "owed")
    throw new ApiError(400, "You must query the favours by either 'owing' or 'owed'.");

  let mongoQuery = q === "owing" ? "debtor._id" : "recipient._id";
  const favours = await Favour.find({ [mongoQuery]: req.userId })
    .limit(limit)
    .skip((page - 1) * limit);

  res.json({
    favours,
    currentPage: page,
    totalPages: Math.ceil((await Favour.countDocuments({ [mongoQuery]: req.userId })) / limit),
  });
});

// =================== Create Favour =====================

handler.post(authGuard, async (req, res) => {
  const { debtor, recipient, rewards, initialEvidence } = await validate(req, "create");

  /**
   * Avoid redundant read
   */

  // Find the current user from db
  const userData = await User.findById(req.userId);
  if (!userData) throw new NoUserError();

  // Find the debtor from db
  const debtorData = await User.findById(debtor);
  if (!debtorData) throw new ApiError(400, "No debtor with that ID exists.");

  // Find the recipient form db
  const recipientData = await User.findById(recipient);
  if (!recipientData) throw new ApiError(400, "No recipient with that ID exists.");

  if (!initialEvidence && userData._id === recipientData._id)
    throw new ApiError(400, "Evidence required");

  // Write new favour to db
  const newFavour = await Favour.create({
    creator: userData.asEmbedded(),
    debtor: debtorData.asEmbedded(),
    recipient: recipientData.asEmbedded(),
    rewards,
    initialEvidence,
  });

  const partyDetector = await new PartyDetector(userData, recipientData).init();
  const party = await partyDetector.findParty();

  res.status(201).json({ newFavour, party });
});

export default handler;
