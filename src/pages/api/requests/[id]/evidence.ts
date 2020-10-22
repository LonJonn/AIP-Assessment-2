import createHandler from "lib/routeHandler";
import multer from "multer";
import { promises as fs } from "fs";
import { Favour, Request, User } from "models";
import { authMiddleware } from "lib/middleware";

const handler = createHandler().use(authMiddleware);
const upload = multer({ dest: "tmp/" });

handler.post(upload.single("evidence"), async (req, res) => {
  const { id } = req.query;
  const request = await Request.findById(id);

  //setting evidence on Request
  request.evidence = await fs.readFile(req.file.path);
  request.isClaimed = true;
  await request.save();

  //Clean up tmp file
  await fs.unlink(req.file.path);

  const recipient = await User.findById((req as any).userId);

  const { contributions } = request;
  Array.from(contributions.keys()).forEach(async (uid) => {
    const debtor = await User.findById(uid);

    await Favour.create({
      creator: debtor.asEmbedded(),
      debtor: debtor.asEmbedded(),
      recipient: recipient.asEmbedded(),
      rewards: contributions.get(uid).rewards,
    });
  });

  recipient.points += 3;
  await recipient.save();

  res.status(204).end();
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
