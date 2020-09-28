import { Button } from "@chakra-ui/core";
import useAuth from "lib/auth";
import { UserSchema } from "models/User";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import { FetcherError } from "utils/fetcher";

const Test: React.FC = () => {
  const { accessToken, signInWithGoogle, signOut } = useAuth();
  const { data: userData, error } = useSWR<UserSchema, FetcherError>(
    accessToken ? ["/api/profile", accessToken] : null
  );

  return (
    <div>
      <Link href="/">Home</Link>
      {userData ? (
        <Button onClick={() => signOut()}>logout {userData.displayName}</Button>
      ) : (
        <Button d="block" mb={2} onClick={() => signInWithGoogle()}>
          Login
        </Button>
      )}

      <h1>Data</h1>
      {userData && <pre>{JSON.stringify(userData, null, 2)}</pre>}

      <h1>Error</h1>
      {error && <pre>{JSON.stringify(error)}</pre>}
    </div>
  );
};

export default Test;
