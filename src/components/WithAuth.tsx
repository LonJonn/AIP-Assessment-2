import { useAuth } from "hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  const AuthGuard = (props) => {
    const { loading, accessToken } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !accessToken) router.push("/login");
    }, [loading, accessToken, router]);

    // if there's a loggedInUser, show the wrapped page, otherwise show a loading indicator
    return accessToken ? <WrappedComponent {...props} /> : <div>Loading...</div>;
  };

  return AuthGuard;
};

export default withAuth;
