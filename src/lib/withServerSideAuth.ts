import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import nookies from "nookies";
import { firebaseAdmin } from "./firebase/admin";

type session = { token: string };

type InnerHanlder = (
  ctx: GetServerSidePropsContext,
  session: session
) => Promise<GetServerSidePropsResult<any>>;

export default function withServerSideAuth(inner?: InnerHanlder): GetServerSideProps {
  return async function (ctx) {
    try {
      const { "pinky-auth": sessionToken } = nookies.get(ctx);
      await firebaseAdmin.auth().verifyIdToken(sessionToken);

      const session = {
        token: sessionToken,
      };

      let authenticatedSSRProps = { props: { session } };
      if (inner) Object.assign(authenticatedSSRProps.props, (await inner(ctx, session)).props);

      return authenticatedSSRProps;
    } catch (error) {
      return {
        unstable_redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  };
}
