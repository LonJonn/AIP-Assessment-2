import {
  Button,
  Container,
  Flex,
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
import { useAuth } from "lib/auth";
import { userValidation } from "lib/validator";
import Head from "next/head";
import NextLink from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface RegisterForm {
  displayName: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { register, handleSubmit, errors: formErrors } = useForm<RegisterForm>({
    resolver: yupResolver(userValidation),
  });

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

  // ==================== Register ====================

  const createUser = async ({ displayName, email, password }: RegisterForm) => {
    setLoading(true);

    try {
      await signUp(email, password, displayName);
    } catch (error) {
      errorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Pinki | Register</title>
      </Head>

      <Container maxW="30rem" mt={32}>
        <Stack
          as="form"
          onSubmit={handleSubmit(createUser)}
          spacing={8}
          align="center"
        >
          <Heading fontSize="6xl" textAlign="center">
            Register
          </Heading>

          <FormControl isInvalid={!!formErrors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" name="email" ref={register} />
            <FormErrorMessage>{formErrors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formErrors.displayName}>
            <FormLabel htmlFor="displayName">Display Name</FormLabel>
            <Input id="displayName" name="displayName" ref={register} />
            <FormErrorMessage>
              {formErrors.displayName?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formErrors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              name="password"
              ref={register}
              type="password"
            />
            <FormErrorMessage>{formErrors.password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formErrors.passwordRepeat}>
            <FormLabel htmlFor="passwordRepeat">Password Again</FormLabel>
            <Input
              id="passwordRepeat"
              name="passwordRepeat"
              ref={register}
              type="password"
            />
            <FormErrorMessage>
              {formErrors.passwordRepeat?.message}
            </FormErrorMessage>
          </FormControl>

          <Flex w="full" flexDir="column" align="center">
            <Button
              type="submit"
              isLoading={loading}
              w="full"
              size="lg"
              colorScheme="primary"
              my={4}
            >
              Submit
            </Button>

            <Link as="span" color="red.300">
              <NextLink href="/">Cancel</NextLink>
            </Link>
          </Flex>
        </Stack>
      </Container>
    </>
  );
};
export default Register;
