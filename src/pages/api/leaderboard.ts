import createHandler from "lib/routeHandler";
import { User } from "models";
import { ApiError } from "next/dist/next-server/server/api-utils";

const handler = createHandler();

// get request to recieve all users
handler.get(async (req, res) => {
  const users = await User.find().limit(10).sort({ points: -1 });
  if (!users) throw new ApiError(400, "No Users Found");
  res.json(users);
});

export default handler;
