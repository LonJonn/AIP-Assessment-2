import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Heading,
  Input,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import RewardList from "components/reward/RewardList";
import { useAuth } from "hooks/useAuth";
import { RewardListProvider, useRewardList } from "hooks/useRewardList";
import { ServerError } from "lib/errorHandler";
import fetcher from "lib/fetcher";
import { requestValidation } from "lib/validator/schemas";
import { RequestSchema, Rewards } from "models/Request";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface RequestFormData {
  title: string;
  description: string;
  rewards: Rewards;
}

const CreateRequest: React.FC = () => {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { rewards, dispatch } = useRewardList();

  //form validation and submission using React Hook Form
  const { register, handleSubmit, errors: formErrors, formState } = useForm<RequestFormData>({
    resolver: yupResolver(requestValidation),
    context: { form: true, create: true },
  });

  // Start with empty reward list
  useEffect(() => {
    dispatch({ type: "clear" });
  }, []);

  const toast = useToast();

  const createRequest = async ({ title, description, rewards }: RequestFormData) => {
    try {
      const newRequest = (await fetcher("/api/requests/", accessToken, {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          rewards,
        }),
        headers: { "Content-type": "application/json" },
      })) as RequestSchema;
      toast({ status: "success", title: "Success!", description: "Request created!" });
      router.push(`/requests/${newRequest._id}`);
    } catch (error) {
      (error as ServerError).errors.forEach((err) => {
        toast({
          status: "error",
          title: "Uh oh...",
          description: err.message,
        });
      });
    }
  };

  return (
    <>
      <Head>
        <title>Pinki | Create Request</title>
      </Head>

      <Container maxW="4xl">
        <Heading size="lg" my={6}>
          Create Request
        </Heading>
        <Stack as="form" onSubmit={handleSubmit(createRequest)} spacing={8} align="start">
          <FormControl isInvalid={!!formErrors.title}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input name="title" id="title" placeholder="What to do" ref={register} />
            <FormErrorMessage>{formErrors.title?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formErrors.description}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              name="description"
              id="description"
              placeholder="Add Additional Information"
              ref={register}
            />
            <FormErrorMessage>{formErrors.description?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formErrors.rewards}>
            <FormLabel htmlFor="rewards">Rewards</FormLabel>
            {Object.keys(rewards).map((reward) => (
              <Input
                hidden
                key={reward}
                readOnly
                name={`rewards.${reward}`}
                id={`rewards.${reward}`}
                value={rewards[reward]}
                ref={register}
              />
            ))}
            <FormErrorMessage>{formErrors.rewards?.message}</FormErrorMessage>
          </FormControl>
          <Grid>
            <RewardList />
          </Grid>

          <Button type="submit" isLoading={formState.isSubmitting}>
            Create
          </Button>
        </Stack>
      </Container>
    </>
  );
};

const CreateWrapper: React.FC = () => (
  <RewardListProvider>
    <CreateRequest />
  </RewardListProvider>
);

export default CreateWrapper;
