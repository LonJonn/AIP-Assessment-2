import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { firebase } from "lib/firebase/client";
import constate from "constate";
import nookies from "nookies";
import fetcher from "lib/fetcher";

function authContextHook() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<firebase.User>();
  const [accessToken, setAccessToken] = useState<string>();

  const router = useRouter();

  /**
   * Update access token whenever token refreshes or auth state changes.
   */
  useEffect(() => {
    return firebase.auth().onIdTokenChanged(async (user) => {
      setUser(user);

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

      setLoading(false);
    });
  }, []);

  // =================== Auth Actions =====================

  async function signUp(email: string, pass: string, displayName: string) {
    setLoading(true);

    // Create new fb Auth user
    const { user } = await firebase.auth().createUserWithEmailAndPassword(email, pass);

    // Add their display name
    await user.updateProfile({
      displayName,
    });

    // Create profile in database
    const accessToken = await user.getIdToken();
    await fetcher("/api/profile", accessToken, { method: "POST" });

    // Push to main page once complete
    router.push("/");

    return user;
  }

  async function signIn(email: string, pass: string) {
    setLoading(true);

    await firebase.auth().signInWithEmailAndPassword(email, pass);
    router.push("/");
  }

  async function signInWithGoogle() {
    setLoading(true);

    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const { user, additionalUserInfo } = await firebase.auth().signInWithPopup(googleProvider);

    if (additionalUserInfo?.isNewUser) {
      const accessToken = await user.getIdToken();
      await fetcher("/api/profile", accessToken, { method: "POST" });
    }

    router.push("/");
  }

  async function signOut() {
    setLoading(true);

    router.push("/");
    await firebase.auth().signOut();
  }

  return {
    loading,
    user,
    accessToken,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };
}

export const [AuthProvider, useAuth] = constate(authContextHook);
