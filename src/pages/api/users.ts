import { admin } from "lib/firebase/admin";
import { authMiddleware } from "lib/middleware";
import { User } from "models";
import { ApiError } from "lib/errorHandler";
import createHandler from "lib/routeHandler";

const handler = createHandler();

// ==================== User Profile ====================

handler.get(async (req, res) => {
  const user = await User.find();
  res.json(user);
});
export default handler;
