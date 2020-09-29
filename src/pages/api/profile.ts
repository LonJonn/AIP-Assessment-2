import { admin } from "lib/firebase/admin";
import { authMiddleware } from "lib/middleware";
import { User } from "models";
import { ApiError } from "lib/errorHandler";
import createHandler from "lib/routeHandler";

const handler = createHandler();

// ==================== User Profile ====================

handler.get(authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
});

// ==================== Create New Profile ====================

/**
 * An API call to this route should be made immediately after a
 * user first signs up on the website to finish creating their
 * account!
 */
handler.post(authMiddleware, async (req, res) => {
  let user = await admin.auth().getUser(req.userId);
  const { uid, email, displayName, photoURL } = user;

  // Don't create user account data twice
  const userData = await User.findById(uid);
  if (userData) {
    throw new ApiError(400, "This account has already been created.");
  }

  // Email and Display Name are defined at this point so cast to NonNullable
  const newUser = await User.create({
    _id: uid,
    email: email!,
    displayName: displayName!,
    photoURL,
  });

  res.status(201).json(newUser);
});

export default handler;
