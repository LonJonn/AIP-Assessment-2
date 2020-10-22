import createHandler from "lib/routeHandler";
import { User } from "models";

const handler = createHandler();

handler.get(async (req, res) => {
  // api/users?q=le
  // get q
  // search mongo for use with name OR email containing q (using mongo text index)
  // return array of matching users (res.json(users))

  //Partial Search engine;

  //   const user = await User.aggregate([
  //     {
  //       $search: {
  //         text: {
  //           query: ["leon"],
  //           path: "displayName",
  //             fuzzy: {
  //               maxEdits: 2,
  //               prefixLength: 3,
  //             },
  //         },
  //         highlight: { path: "displayName" },
  //       },
  //     },
  //   ]);

  const user = await User.aggregate([
    {
      $search: {
        autocomplete: {
          path: "displayName",
          query: "leo",
        },
      },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        _id: 0,
        email: 1,
        displayName: 1,
      },
    },
  ]);

  res.json(user);
});
export default handler;
