import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  Image,
  Stack,
  Text,
  useColorMode,
  useToast,
  Wrap,
} from "@chakra-ui/core";
import { ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons";
import Layout from "components/layout/Layout";
import WithAuth from "components/WithAuth";
import RewardCube from "components/reward/RewardCube";
import { useAuth } from "hooks/useAuth";
import useInitialValue from "hooks/useInitialValue";
import { isServerError, ServerError } from "lib/errorHandler";
import fetcher from "lib/fetcher";
import { firebase } from "lib/firebase/client";
import { FavourSchema } from "models/Favour";
import useSWR from "swr";
import ErrorPage from "components/layout/Error";
import Loader from "components/layout/Loader";
import { UserSchema } from "models/User";

/**
 * User Preview
 */

interface UserPreviewProps {
  user: UserSchema;
}

const UserPreview: React.FC<UserPreviewProps> = ({ user }) => (
  <Stack direction="row" align="center" spacing={4}>
    <Avatar src={user.photoURL} name={user.displayName} />
    <Text fontSize="xl" fontWeight="bold">
      {user.displayName}
    </Text>
  </Stack>
);

/**
 * Favour Details Page
 */

const FavourDetails: React.FC = () => {
  const { user, accessToken } = useAuth();
  const router = useRouter();

  const toast = useToast();
  const { colorMode } = useColorMode();
  function useColorModeValue(light: any, dark: any) {
    return colorMode === "light" ? light : dark;
  }

  // Use initial query.id since exit page animation will set query.id to undefined.
  const id = useInitialValue(router.query.id);

  const { data: favour, error, mutate } = useSWR<FavourSchema, ServerError>([
    `/api/favours/${id}`,
    accessToken,
  ]);

  // Delete Favour
  const canDelete =
    favour &&
    (user.uid === favour.recipient._id || (user.uid === favour.debtor._id && favour.evidence));

  async function deleteFavour() {
    try {
      await fetcher(`/api/favours/${id}`, accessToken, { method: "DELETE" });

      toast({
        status: "success",
        title: "Favour deleted!",
      });

      router.push("/favours");
    } catch (fetchError) {
      const { errors } = fetchError as ServerError;

      toast({
        status: "error",
        title: "Unable to delete favour 😭",
        description: errors[0].message,
      });
    }
  }

  // Upload Evidence
  const canUploadEvidence = favour && user.uid === favour.debtor._id && !favour.evidence;
  const uploadEvidence: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const evidence = e.target.files[0];

    try {
      const timestamp = new Date().toISOString();
      const path = `favours/${favour.debtor._id}_${favour.recipient._id}_${timestamp}/evidence.png`;
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(path);
      await fileRef.put(evidence);

      await fetcher(`/api/favours/${favour._id}/evidence`, accessToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evidence: path,
        }),
      });

      mutate({
        ...favour,
        evidence: path,
      });

      toast({
        status: "success",
        title: "Evidence submitted! 🥳",
      });
    } catch (error) {
      const errMsg = isServerError(error) ? error.errors[0].message : error.message;
      toast({
        status: "error",
        title: errMsg || "Something went wrong...",
      });
    }
  };

  // Image
  const [initEvidenceURL, setinitEvidenceURL] = useState("");
  const [evidenceURL, setEvidenceURL] = useState("");
  useEffect(() => {
    if (favour?.initialEvidence) {
      firebase.storage().ref(favour.initialEvidence).getDownloadURL().then(setinitEvidenceURL);
    }

    if (favour?.evidence) {
      firebase.storage().ref(favour.evidence).getDownloadURL().then(setEvidenceURL);
    }
  }, [favour]);

  if (error) return <ErrorPage statusCode={error.statusCode} error={error.errors[0].message} />;

  if (!favour) return <Loader />;

  return (
    <Layout maxW="sm" mt={16}>
      {/* Back Button */}
      <Button
        variant="link"
        color="inherit"
        fontWeight="normal"
        size="lg"
        mb={6}
        leftIcon={<ArrowBackIcon />}
      >
        <NextLink href="/favours">Back</NextLink>
      </Button>

      <Stack spacing={8} align="center">
        {/* Involved Users */}
        <Stack
          direction="row"
          spacing={4}
          align="center"
          justify="center"
          w="full"
          p={8}
          bg={useColorModeValue("primary.50", "whiteAlpha.200")}
          borderRadius="lg"
        >
          <UserPreview user={favour.debtor} />
          <Text color={useColorModeValue("teal.500", "primary.300")}>Promised</Text>
          <UserPreview user={favour.recipient} />
        </Stack>

        {/* Reward Pool */}
        <Wrap justify="center" w="28rem">
          {Object.keys(favour.rewards).map((reward) => (
            <Box bg="whiteAlpha.200" borderRadius="lg" px={4} py={3} key={reward}>
              <RewardCube reward={reward} quantity={favour.rewards[reward]} />
            </Box>
          ))}
        </Wrap>

        {initEvidenceURL && (
          <Box>
            <Text textAlign="center">Initial Evidence</Text>
            <Image boxSize="xs" src={initEvidenceURL} />
          </Box>
        )}
        {evidenceURL && (
          <Box>
            <Text textAlign="center">Debtor Evidence</Text>
            <Image boxSize="xs" src={evidenceURL} />
          </Box>
        )}

        {/* Actions */}
        <Stack direction="row" justify="space-between" w="full">
          <Button
            onClick={deleteFavour}
            isDisabled={!canDelete}
            variant="outline"
            colorScheme="red"
            rightIcon={<DeleteIcon />}
          >
            Delete
          </Button>

          {canUploadEvidence && <input type="file" onChange={uploadEvidence} />}
        </Stack>
      </Stack>
    </Layout>
  );
};

export default WithAuth(FavourDetails);
