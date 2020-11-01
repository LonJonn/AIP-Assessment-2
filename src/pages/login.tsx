import React from "react";
import NextLink from "next/link";
import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  useToast,
} from "@chakra-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "hooks/useAuth";
import { isServerError } from "lib/errorHandler";
import { userValidation } from "lib/validator/schemas";
import { useForm } from "react-hook-form";
import Layout from "components/layout/Layout";

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const { register, handleSubmit, errors: formErrors, formState } = useForm<LoginForm>({
    resolver: yupResolver(userValidation),
    context: { form: true },
  });

  const toast = useToast();

  // ==================== Standard Login ====================

  async function emailPassLogin({ email, password }: LoginForm) {
    try {
      await signIn(email, password);
    } catch (error) {
      toast({
        title: "Uh Oh...",
        description: error.message || "Something went wrong...",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    }
  }

  // ==================== Social Login ====================

  async function providerLogin() {
    try {
      await signInWithGoogle();
    } catch (error) {
      // Ignore popup closed errors
      if (error.code === "auth/popup-closed-by-user") return;

      const errMsg = isServerError(error) ? error.errors[0].message : error.messsage;
      toast({
        title: "Uh Oh...",
        description: errMsg || "Something went wrong...",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    }
  }

  return (
    <Layout title="Login" maxW="30rem" mt={16}>
      <Heading size="2xl" textAlign="center" mb={8}>
        Login
      </Heading>

      <Stack as="form" onSubmit={handleSubmit(emailPassLogin)} spacing={8}>
        <FormControl isInvalid={!!formErrors.email}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input id="email" name="email" ref={register} />
          <FormErrorMessage>{formErrors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!formErrors.password}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input id="password" name="password" ref={register} type="password" />
          <FormErrorMessage>{formErrors.password?.message}</FormErrorMessage>
        </FormControl>

        <Stack align="center" spacing={4}>
          <Button
            type="submit"
            isLoading={formState.isSubmitting}
            w="full"
            size="lg"
            colorScheme="primary"
          >
            Submit
          </Button>

          <NextLink href="/register" passHref>
            <Link as="span" color="blue.300">
              Register
            </Link>
          </NextLink>
        </Stack>

        <Divider />

        <Button colorScheme="gray" size="lg" onClick={providerLogin}>
          Login with Google
        </Button>
      </Stack>
    </Layout>
  );
};

export default Login;
