import { NoUserError, ApiError } from "lib/errorHandler";
import { authMiddleware } from "lib/middleware";
import createHandler from "lib/routeHandler";
import { Favour, User } from "models";
import { favourValidation } from "lib/validator/schemas";
import createValidator from "lib/validator";
import {
  createArrayFromDimensions,
  mapArrayOptions,
} from "@typegoose/typegoose/lib/internal/utils";

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
    const allUsers = await User.find();
    const allFavours = await Favour.find();
    const adjList = new Map<string, string[]>();
    allUsers.forEach((user) => {
      adjList.set(user._id, []);
    });

    allFavours.forEach((favour) => {
      let personOwing = favour.debtor._id;
      let personReceiving = favour.recipient._id;
      let owedList = adjList.get(personOwing);
      const already = owedList.some((arrayElement) => personReceiving === arrayElement);
      if (!already) {
        owedList.push(personReceiving);
        adjList.set(personOwing, owedList);
      }
    });

    return adjList;
  };

  const adjList = await createAdjList();
  console.log(Array.from(adjList.keys()));
  console.log(Array.from(adjList.values()));

  // =================== Detect Cycle by DFS =====================

  // Referenced: https://hackernoon.com/the-javascript-developers-guide-to-graphs-and-detecting-cycles-in-them-96f4f619d563

  const parents = [];

  const detectCycle = async () => {
    const visited = {};
    const recStack = {};

    const node = userData._id;
    const result = await _detectCycleUtil(node, visited, recStack);
    console.log(result);
    if (result) {
      return recStack;
    } else return "There is no cycle";
  };

  const _detectCycleUtil = async (vertex, visited, recStack) => {
    if (!visited[vertex]) {
      visited[vertex] = true;
      recStack[vertex] = true;
      console.log("Visited: ", visited);
      console.log("RecStack: ", recStack);
      const nodeNeighbours = adjList.get(vertex);
      for (let i = 0; i < nodeNeighbours.length; i++) {
        const currentNode = nodeNeighbours[i];
        parents.push(vertex);
        if (!visited[currentNode] && (await _detectCycleUtil(currentNode, visited, recStack))) {
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

  // const partyMembers = [];
  // detectCycleResult.forEach(async (userId) => {
  //   const member = await User.findById(userId);
  //   const memberName = member.displayName;
  //   console.log(memberName);
  //   partyMembers.push(memberName);
  // });
  // console.log(partyMembers);

  res.status(201).json({ newFavour });
});

export default handler;
