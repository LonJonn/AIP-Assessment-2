import { NextPage } from "next";
import { Center, Heading, Text } from "@chakra-ui/core";
import Layout from "components/layout/Layout";

interface ErrorPageProps {
  statusCode: number;
  error: string;
}

const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode, error }) => (
  <Layout title="Uh Oh... 😥" as={Center}>
    <Heading size="md" py={4} px={6} mr={6} borderRight="2px solid" borderColor="inherit">
      {statusCode}
    </Heading>

    <Text>{error}</Text>
  </Layout>
);
export default ErrorPage;
