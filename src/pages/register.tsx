import React from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  Button,
  Container,
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
import { userValidation } from "lib/validator/schemas";
import { useForm } from "react-hook-form";
import { isServerError } from "lib/errorHandler";
import Layout from "components/layout/Layout";

interface RegisterForm {
  displayName: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

const Register: React.FC = () => {
  const { signUp } = useAuth();
  const { register, handleSubmit, errors: formErrors, formState } = useForm<RegisterForm>({
    resolver: yupResolver(userValidation),
    context: { form: true, create: true },
  });

  const toast = useToast();

  // ==================== Register ====================

  async function createUser({ displayName, email, password }: RegisterForm) {
    try {
      await signUp(email, password, displayName);
    } catch (error) {
      const errMsg = isServerError(error) ? error.errors[0].message : error.message;
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
    <Layout title="Register" maxW="30rem" mt={16}>
      <Heading size="2xl" textAlign="center" mb={8}>
        Register
      </Heading>

      <Stack as="form" onSubmit={handleSubmit(createUser)} spacing={8}>
        <FormControl isInvalid={!!formErrors.email}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input id="email" name="email" ref={register} />
          <FormErrorMessage>{formErrors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!formErrors.displayName}>
          <FormLabel htmlFor="displayName">Display Name</FormLabel>
          <Input id="displayName" name="displayName" ref={register} />
          <FormErrorMessage>{formErrors.displayName?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!formErrors.password}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input id="password" name="password" ref={register} type="password" />
          <FormErrorMessage>{formErrors.password?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!formErrors.passwordRepeat}>
          <FormLabel htmlFor="passwordRepeat">Password Repeat</FormLabel>
          <Input id="passwordRepeat" name="passwordRepeat" ref={register} type="password" />
          <FormErrorMessage>{formErrors.passwordRepeat?.message}</FormErrorMessage>
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

          <NextLink href="/login" passHref>
            <Link as="span" color="red.300">
              Cancel
            </Link>
          </NextLink>
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Register;
