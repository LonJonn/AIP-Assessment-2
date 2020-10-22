import createHandler from "lib/routeHandler";
import { User } from "models";

const handler = createHandler();

handler.get(async (req, res) => {
  const foundUsers = await User.aggregate([
    {
      $search: {
        autocomplete: {
          path: "displayName",
          query: req.query.q,
        },
      },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        _id: 1,
        displayName: 1,
        photoURL: 1,
        email: 1,
      },
    },
  ]);

  res.json(foundUsers);
});

export default handler;
