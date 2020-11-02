import { NextPage } from "next";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/core";
import Layout from "components/layout/Layout";
import { useRouter } from "next/router";
import { ArrowBackIcon } from "@chakra-ui/icons";

interface ErrorPageProps {
  statusCode: number;
  error: string;
}

const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode, error }) => {
  const router = useRouter();

  return (
    <Layout title="Uh Oh... 😥" as={Center}>
      <Stack align="center" spacing={8}>
        Error
        <Stack direction="row" align="center" spacing={6}>
          <Heading
            size="md"
            py={4}
            px={6}
            borderRight="2px solid"
            borderColor={useColorModeValue("gray.400", "inherit")}
          >
            {statusCode}
          </Heading>

          <Text>{error}</Text>
        </Stack>
        {/* Back Button */}
        <Button
          colorScheme="teal"
          variant="link"
          leftIcon={<ArrowBackIcon mb="px" />}
          onClick={router.back}
        >
          Back to safety 🤗
        </Button>
      </Stack>
    </Layout>
  );
};
export default ErrorPage;
