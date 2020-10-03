import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/core";
import { useAuth } from "lib/auth";
import { FetcherError } from "utils/fetcher";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();

  // ==================== Toast 🍞 ====================

  const toast = useToast();

  function errorToast(description: string, title = "Uh Oh...") {
    toast({
      title,
      description,
      status: "error",
      duration: 10000,
      isClosable: true,
    });
  }

  // ==================== Standard Login ====================

  const emailPassLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.currentTarget["username"].value;
    const password = e.currentTarget["password"].value;

    try {
      await signIn(email, password);
    } catch (error) {
      errorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== Social Login ====================

  const providerLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      const { details } = error as FetcherError;
      errorToast(details?.errors[0].message || "Something went wrong.");
    }
  };

  return (
    <>
      <Head>
        <title>Pinki | Login</title>
      </Head>

      <Link href="/">
        <a>Home</a>
      </Link>

      <Container maxW="30rem" mt={32}>
        <Box as="form" onSubmit={emailPassLogin}>
          <Stack spacing={8}>
            <Heading fontSize="6xl" textAlign="center">
              Login
            </Heading>
            <FormControl isRequired>
              <FormLabel htmlFor="username">Email</FormLabel>
              <Input id="username" variant="filled" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input id="password" type="password" />
            </FormControl>
            <Button type="submit" w="full" size="lg" isLoading={loading}>
              Submit
            </Button>

            <Divider />

            <Button colorScheme="gray" size="lg" onClick={providerLogin}>
              Login with Google
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export default Login;
