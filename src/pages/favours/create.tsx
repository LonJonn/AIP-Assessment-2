import React, { useState } from "react";
import { useRouter } from "next/router";
import SelectUser from "components/favour/SelectUser";
import RewardList from "components/reward/RewardList";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { RewardListProvider, useRewardList } from "hooks/useRewardList";
import { useAuth } from "hooks/useAuth";
import fetcher from "lib/fetcher";
import { firebase } from "lib/firebase/client";
import { favourValidation } from "lib/validator/schemas";
import { FavourSchema, Rewards } from "models/Favour";
import { UserSchema } from "models/User";
import { useForm } from "react-hook-form";
import { isServerError } from "lib/errorHandler";
import Layout from "components/layout/Layout";
import WithAuth from "components/WithAuth";

/**
 * Owing Form
 */

interface OwingFormData {
  debtor: string;
  recipient: string;
  rewards: Rewards;
}

const OwingForm: React.FC = () => {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [selectedUser, setSelectedUser] = useState<UserSchema>(null);
  const { rewards } = useRewardList();

  // Form
  const { handleSubmit, register, errors: formErrors, formState } = useForm<OwingFormData>({
    resolver: yupResolver(favourValidation),
    context: { form: true, create: true },
  });

  async function createFavour({ debtor, recipient, rewards }: OwingFormData) {
    try {
      const { newFavour, party } = (await fetcher("/api/favours", accessToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          debtor,
          recipient,
          rewards,
        }),
      })) as { newFavour: FavourSchema; party: UserSchema[] };

      toast({
        status: "success",
        title: "New favour created!",
      });

      if (party.length > 0) {
        toast({
          status: "info",
          title: "It's Party Time! 🥳",
          description: `Party detected between ${party.map((user) => user.displayName).join(", ")}`,
          duration: null,
          isClosable: true,
        });
      }

      router.push("/favours/" + newFavour._id);
    } catch (error) {
      const errMsg = isServerError(error) ? error.errors[0].message : error.message;
      toast({
        status: "error",
        title: errMsg || "Something went wrong...",
      });
    }
  }

  return (
    <Stack as="form" spacing={8} onSubmit={handleSubmit(createFavour)}>
      {/* Debtor */}
      <Input hidden readOnly value={user?.uid || ""} id="debtor" name="debtor" ref={register} />

      {/* Recipient */}
      <FormControl isInvalid={!!formErrors.recipient} mt="0 !important">
        <FormLabel htmlFor="recipient">Who do you owe?</FormLabel>
        <SelectUser onSelectUser={setSelectedUser} />
        <FormErrorMessage>{formErrors.recipient?.message}</FormErrorMessage>

        <Input
          readOnly
          hidden
          id="recipient"
          name="recipient"
          ref={register}
          value={selectedUser?._id || ""}
        />
      </FormControl>

      {/* Rewards */}
      <FormControl isInvalid={!!formErrors.rewards}>
        <FormLabel htmlFor="rewards">What do you owe them?</FormLabel>
        <RewardList />
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

      {/* Submit */}
      <Button type="submit" colorScheme="primary" size="lg" disabled={formState.isSubmitting}>
        Submit
      </Button>
    </Stack>
  );
};

/**
 * Owe Form
 */

interface OweFormData extends OwingFormData {
  initEvidence: FileList;
}

const OweForm: React.FC = () => {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [selectedUser, setSelectedUser] = useState<UserSchema>(null);
  const { rewards } = useRewardList();

  // Form
  const { handleSubmit, register, errors: formErrors } = useForm<OweFormData>({
    resolver: yupResolver(favourValidation),
    context: { form: true, create: true },
  });

  async function createFavour({ debtor, recipient, rewards, initEvidence }: OweFormData) {
    try {
      // Upload evidence to firebase storage
      const initEvidencePath = `favours/${debtor}_${recipient}_${new Date().toISOString()}/initialEvidence.png`;
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(initEvidencePath);
      await fileRef.put(initEvidence[0]);

      // Add favour via API
      const newFavour = (await fetcher("/api/favours", accessToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          debtor,
          recipient,
          rewards,
          initialEvidence: initEvidencePath,
        }),
      })) as FavourSchema;

      toast({
        status: "success",
        title: "New favour created!",
      });

      router.push("/favours/" + newFavour._id);
    } catch (error) {
      const errMsg = isServerError(error) ? error.errors[0].message : error.message;
      toast({
        status: "error",
        title: errMsg || "Something went wrong...",
      });
    }
  }

  return (
    <Stack as="form" spacing={8} onSubmit={handleSubmit(createFavour)}>
      {/* Recipient */}
      <Input
        hidden
        readOnly
        value={user?.uid || ""}
        id="recipient"
        name="recipient"
        ref={register}
      />

      {/* Debtor */}
      <FormControl isInvalid={!!formErrors.debtor} mt="0 !important">
        <FormLabel htmlFor="debtor">Who owes you?</FormLabel>
        <SelectUser onSelectUser={setSelectedUser} />
        <FormErrorMessage>{formErrors.debtor?.message}</FormErrorMessage>

        <Input
          readOnly
          hidden
          id="debtor"
          name="debtor"
          ref={register}
          value={selectedUser?._id || ""}
        />
      </FormControl>

      {/* Rewards */}
      <FormControl isInvalid={!!formErrors.rewards}>
        <FormLabel htmlFor="rewards">What do they owe you?</FormLabel>
        <RewardList />
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

      <FormControl isRequired>
        <FormLabel>Initial Evidence</FormLabel>
        <input type="file" name="initEvidence" ref={register} />
      </FormControl>

      {/* Submit */}
      <Button type="submit" colorScheme="primary" size="lg">
        Submit
      </Button>
    </Stack>
  );
};

const Create: React.FC = () => {
  const router = useRouter();
  const { type: formType } = router.query;

  // Swap out form depending on favour type
  const changeFormType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push({
      query: { type: e.target.value },
    });
  };

  return (
    <Layout title="Add Favour" maxW="sm" mt={16}>
      <Stack spacing={8}>
        <Heading size="2xl" textAlign="center">
          Create Favour
        </Heading>

        {/* Change Form Type */}
        <Stack spacing={4}>
          <Text>Type of Favour</Text>

          <Select value={formType} onChange={changeFormType}>
            <option value="owing">You Owe Someone 😥</option>
            <option value="owed">Someone Owes You 😁</option>
          </Select>
        </Stack>

        {/* Form */}
        <RewardListProvider>
          {formType === "owing" ? <OwingForm /> : <OweForm />}
        </RewardListProvider>
      </Stack>
    </Layout>
  );
};

export default WithAuth(Create);
