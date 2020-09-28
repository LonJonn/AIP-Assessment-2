import { useEffect, useState } from "react";
import fetcher from "utils/fetcher";
import { firebase } from "./firebase/client";

export default function useAuth() {
  const [user, setUser] = useState<firebase.User | null>();
  const [accessToken, setAccessToken] = useState<string>();

  async function createProfile() {
    return await fetcher("/api/profile", accessToken, { method: "POST" });
  }

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setUser);
  });

  useEffect(() => {
    return firebase.auth().onIdTokenChanged(async (user) => {
      setAccessToken(await user?.getIdToken());
    });
  }, []);

  async function signInWithGoogle() {
    const response = await firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider());

    if (response.additionalUserInfo?.isNewUser) {
      await createProfile();
    }
  }

  async function signOut() {
    await firebase.auth().signOut();
    setUser(null);
  }

  return {
    user,
    accessToken,
    signInWithGoogle,
    signOut,
  };
}
