import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { firebase } from "lib/firebase/client";
import constate from "constate";
import nookies from "nookies";
import fetcher from "lib/fetcher";
import { useToast } from "@chakra-ui/core";

function authContextHook() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<firebase.User>();
  const [accessToken, setAccessToken] = useState<string>();

  const router = useRouter();

  const toast = useToast();
  function showLoggedInToast(name: string) {
    toast({
      status: "success",
      title: `Welcome, ${name.split(" ")[0]}! 🥰`,
      position: "bottom-right",
    });
  }

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

    showLoggedInToast(user.displayName);
    await router.push((router.query.redirect as string) || "/");
  }

  async function signIn(email: string, pass: string) {
    setLoading(true);

    const { user } = await firebase.auth().signInWithEmailAndPassword(email, pass);

    showLoggedInToast(user.displayName);
    await router.push((router.query.redirect as string) || "/");
  }

  async function signInWithGoogle() {
    setLoading(true);

    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const { user, additionalUserInfo } = await firebase.auth().signInWithPopup(googleProvider);

    if (additionalUserInfo?.isNewUser) {
      const accessToken = await user.getIdToken();
      await fetcher("/api/profile", accessToken, { method: "POST" });
    }

    showLoggedInToast(user.displayName);
    await router.push((router.query.redirect as string) || "/");
  }

  async function signOut() {
    setLoading(true);

    await firebase.auth().signOut();
    await router.push("/login");

    toast({
      status: "success",
      title: "You are now logged out.",
      position: "bottom-right",
    });
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
