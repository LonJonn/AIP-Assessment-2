import { NoUserError, ApiError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import { Favour, User } from "models";
import { favourValidation } from "lib/validator/schemas";
import createValidator from "lib/validator";

const handler = createHandler();
const validate = createValidator(favourValidation);

// =================== Get User Favours =====================

handler.get(authMiddleware, async (req, res) => {
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

handler.post(authMiddleware, async (req, res) => {
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

  // Party Detection
  const createAdjList = async () => {
    const allFavours = await Favour.find();

    const adjList = new Map<string, string[]>();
    allFavours.forEach((favour) => {
      if (!adjList.get(favour.debtor._id)) {
        adjList.set(favour.debtor._id, []);
        adjList.get(favour.debtor._id).push(favour.recipient._id);
      }
      adjList.get(favour.debtor._id).push(favour.recipient._id);
    });
    return adjList;
  };

  const adjList = await createAdjList();
  adjList.forEach((value, key) => {
    // Remove duplicate data from array
    const reducedValue = value.reduce(function (accumulator, currentValue) {
      if (accumulator.indexOf(currentValue) === -1) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);

    console.log(key, reducedValue);
  });
  res.status(201).json({ newFavour, adjList });
});

export default handler;
