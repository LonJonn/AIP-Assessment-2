import { admin } from "lib/firebase/admin";
import { authMiddleware } from "middleware";
import { User } from "models";
import { updateUserValidation } from "models/User";
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

  // `email` & `displayName` will always be defined
  const newUser = await User.create({
    _id: uid,
    email: email,
    displayName: displayName,
    photoURL,
  });

  res.status(201).json(newUser);
});

handler.put(async (req, res) => {
  const data = await updateUserValidation.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  res.json(data);
});

export default handler;
