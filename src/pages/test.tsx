import React from "react";
import Link from "next/link";
import { useAuth } from "lib/auth";
import { UserSchema } from "models/User";
import useSWR from "swr";
import { FetcherError } from "utils/fetcher";
import { Button } from "@chakra-ui/core";

const Test: React.FC = () => {
  const { user, accessToken, signInWithGoogle, signOut } = useAuth();
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

      <Button my={8} d={"block"} onClick={() => user?.getIdToken(true)}>
        Refresh
      </Button>

      <h1>Data</h1>
      {userData && <pre>{JSON.stringify(userData, null, 2)}</pre>}

      <h1>Error</h1>
      {error && <pre>{JSON.stringify(error)}</pre>}
    </div>
  );
};

export default Test;

// export async function getServerSideProps(ctx: GetServerSidePropsContext) {
//   const { "pinky-auth": accessToken } = nookies.get(ctx);
//   const data = await fetcher("http://localhost:3000/api/profile", accessToken);

//   return {
//     props: {
//       user: data,
//     },
//   };
// }
