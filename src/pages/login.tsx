import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
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
import { auth, authProviders } from "lib/firebase/client";
import { ErrorResponse } from "lib/errorHandler";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);

  async function createProfile() {
    const accessToken = await auth.currentUser.getIdToken();

    const response = await fetch("/api/profile", {
      method: "POST",
      headers: {
        authorization: "Bearer " + accessToken,
      },
    });

    return (await response.json()) as ErrorResponse;
  }

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

  const emailPassLogin: React.FormEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.currentTarget["username"].value;
    const password = e.currentTarget["password"].value;

    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      errorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== Social Login ====================

  const providerLogin = async (provider: string) => {
    try {
      const result = await auth.signInWithPopup(authProviders[provider]);

      // Create profile in DB if first time logging in with social
      if (result.additionalUserInfo.isNewUser) {
        const { errors } = await createProfile();
        errors.map((err) =>
          errorToast(err.message, "Failed to create new profile 😢")
        );
      }
    } catch (error) {
      errorToast(error.message);
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
        <Stack as="form" onSubmit={emailPassLogin} spacing={8}>
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

          <Button
            colorScheme="gray"
            size="lg"
            onClick={() => providerLogin("google")}
          >
            Login with Google
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default Login;
