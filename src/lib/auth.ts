import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { firebase } from "lib/firebase/client";
import constate from "constate";
import nookies from "nookies";
import fetcher from "lib/fetcher";

async function createProfile(accessToken: string) {
  return await fetcher("/api/profile", accessToken, { method: "POST" });
}

function authContextHook() {
  const [user, setUser] = useState<firebase.User>();
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
    const { user } = await firebase.auth().createUserWithEmailAndPassword(email, pass);

    // Add their display name
    await user.updateProfile({
      displayName,
    });

    // Create profile in database
    const accessToken = await user.getIdToken();
    await createProfile(accessToken);

    // Push to main page once complete
    Router.push("/");

    return user;
  }

  async function signIn(email: string, pass: string) {
    await firebase.auth().signInWithEmailAndPassword(email, pass);
    Router.push("/");
  }

  async function signInWithGoogle() {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const { user, additionalUserInfo } = await firebase.auth().signInWithPopup(googleProvider);

    if (additionalUserInfo?.isNewUser) await createProfile(await user.getIdToken());

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
