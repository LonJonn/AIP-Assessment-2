import createHandler from "lib/routeHandler";
import multer from "multer";
import { promises as fs } from "fs";
import { Favour, Request, User } from "models";
import { authGuard } from "lib/middleware";

const handler = createHandler();

handler.post(authGuard, async (req, res) => {
  const { id } = req.query;
  const { evidence } = req.body;
  const request = await Request.findById(id);

  //setting evidence on Request
  request.evidence = evidence;
  request.isClaimed = true;
  await request.save();

  const recipient = await User.findById((req as any).userId);

  const { contributions } = request;
  Array.from(contributions.keys()).forEach(async (uid) => {
    const debtor = await User.findById(uid);

    await Favour.create({
      creator: debtor.toJSON(),
      debtor: debtor.toJSON(),
      recipient: recipient.toJSON(),
      rewards: contributions.get(uid).rewards,
    });
  });

  recipient.points += 3;
  await recipient.save();

  res.status(204).end();
});

export default handler;
