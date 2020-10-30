import { NoUserError, ApiError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import { Favour, User } from "models";
import { favourValidation } from "lib/validator/schemas";
import createValidator from "lib/validator";
import { mapArrayOptions } from "@typegoose/typegoose/lib/internal/utils";

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
      let owedList = adjList.get(favour.debtor._id);
      if (!owedList) {
        owedList = [];
        adjList.set(favour.debtor._id, owedList);
      }

      const recipientExists = owedList.some((recipientId) => recipientId === favour.recipient._id);
      if (!recipientExists) owedList.push(favour.recipient._id);
    });

    return adjList;
  };

  const adjList = await createAdjList();

  // =================== Detect Cycle by DFS =====================

  // Referenced: https://hackernoon.com/the-javascript-developers-guide-to-graphs-and-detecting-cycles-in-them-96f4f619d563

  const parents = [];
  const detectCycle = async () => {
    const graphNodes = Array.from(adjList.keys());
    const visited = {};
    const recStack = {};

    for (let i = 0; i < graphNodes.length; i++) {
      const node = graphNodes[i];
      if (_detectCycleUtil(node, visited, recStack)) return parents;
    }
    return "NO LOOPITY LOOP 😖😖";
  };

  const _detectCycleUtil = async (vertex, visited, recStack) => {
    if (!visited[vertex]) {
      visited[vertex] = true;
      recStack[vertex] = true;
      const nodeNeighbours = adjList.get(vertex);
      for (let i = 0; i < nodeNeighbours.length; i++) {
        const currentNode = nodeNeighbours[i];
        parents.push(vertex);
        if (!visited[currentNode] && _detectCycleUtil(currentNode, visited, recStack)) {
          return true;
        } else if (recStack[currentNode]) {
          return true;
        }
      }
    }
    recStack[vertex] = false;
    return false;
  };

  const detectCycleResult = await detectCycle();

  console.log(detectCycleResult);

  res.status(201).json({ newFavour, adjList });
});

export default handler;
