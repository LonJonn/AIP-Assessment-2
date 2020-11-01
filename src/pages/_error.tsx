import ErrorPage from "components/layout/Error";
import { NextPage } from "next";

interface ServerErrorPageProps {
  statusCode: number;
}

const ServerErrorPage: NextPage<ServerErrorPageProps> = ({ statusCode }) => (
  <ErrorPage statusCode={statusCode} error="Uh Oh... We done goofed... 😥" />
);

ServerErrorPage.getInitialProps = async ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ServerErrorPage;
