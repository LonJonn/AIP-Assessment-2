import constate from "constate";
import { useRouter } from "next/dist/client/router";
import nookies from "nookies";
import { useEffect, useState } from "react";
import fetcher from "utils/fetcher";
import { firebase } from "./firebase/client";

async function createProfile(accessToken: string) {
  return await fetcher("/api/profile", accessToken, { method: "POST" });
}

function authContextHook() {
  const [user, setUser] = useState<firebase.User | null>();
  const [accessToken, setAccessToken] = useState<string>();

  const Router = useRouter();

  /**
   * Update user state whenever firebase auth state changes.
   */
  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setUser);
  }, []);

  /**
   * Update access token whenever token refreshes or auth state changes.
   */
  useEffect(() => {
    return firebase.auth().onIdTokenChanged(async (user) => {
      const accessToken = await user?.getIdToken();
      setAccessToken(accessToken);

      // Store/Remove access token cookie for SSR
      if (accessToken) {
        nookies.set(null, "pinky-auth", accessToken, {
          maxAge: 60 * 60,
          path: "/",
        });
      } else {
        nookies.destroy(null, "pinky-auth");
      }
    });
  }, []);

  // =================== Auth Actions =====================

  async function signUp(email: string, pass: string, displayName: string) {
    // Create new fb Auth user
    const { user } = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, pass);

    // Add their display name
    await user.updateProfile({
      displayName,
    });

    // Push to main page once complete
    Router.push("/");

    return user;
  }

  async function signIn(email: string, pass: string) {
    await firebase.auth().signInWithEmailAndPassword(email, pass);
    Router.push("/");
  }

  async function signInWithGoogle() {
    const response = await firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider());

    if (response.additionalUserInfo?.isNewUser) {
      await createProfile(accessToken!); // Access Token is defined at this point
    }

    Router.push("/");
  }

  async function signOut() {
    Router.push("/");
    await firebase.auth().signOut();
  }

  return {
    user,
    accessToken,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };
}

export const [AuthProvider, useAuth] = constate(authContextHook);
