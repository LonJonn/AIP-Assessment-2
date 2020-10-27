import React, { useCallback, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  Container,
  Image,
  Stack,
  Text,
  useToast,
  Wrap,
} from "@chakra-ui/core";
import { ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons";
import RewardCube from "components/reward/RewardCube";
import { useAuth } from "hooks/useAuth";
import fetcher from "lib/fetcher";
import { firebaseAdmin } from "lib/firebase/admin";
import { firebase } from "lib/firebase/client";
import Favour, { FavourSchema } from "models/Favour";
import { EmbeddedUserSchema } from "models/User";
import nookies from "nookies";
import { ServerError } from "lib/errorHandler";

/**
 * User Preview
 */

interface UserPreviewProps {
  user: EmbeddedUserSchema;
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

interface FavourDetailsProps {
  favour: FavourSchema;
}

const FavourDetails: React.FC<FavourDetailsProps> = ({ favour }) => {
  const toast = useToast();
  const router = useRouter();

  const { user, accessToken } = useAuth();
  const { _id, debtor, recipient, rewards, evidence } = favour;

  // Delete Favour
  const canDelete = user?.uid === recipient._id || (user?.uid === debtor._id && evidence);
  const deleteFavour = useCallback(async () => {
    try {
      await fetcher(`api/favours/${_id}`, accessToken, { method: "DELETE" });
      router.push("/favours");
    } catch (fetchError) {
      const { errors } = fetchError as ServerError;

      toast({
        status: "error",
        title: "Uh oh...",
        description: errors[0].message,
      });
    }
  }, [_id, accessToken]);

  // Upload Evidence
  const uploadEvidence: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const evidence = e.target.files[0];

    const path = `favours/${debtor._id}_${recipient._id}_${new Date().toISOString()}/evidence.png`;
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

    router.reload();
  };

  // Image
  const [initEvidenceURL, setinitEvidenceURL] = useState("");
  const [evidenceURL, setEvidenceURL] = useState("");
  useEffect(() => {
    if (favour.initialEvidence) {
      firebase.storage().ref(favour.initialEvidence).getDownloadURL().then(setinitEvidenceURL);
    }

    if (favour.evidence) {
      firebase.storage().ref(favour.evidence).getDownloadURL().then(setEvidenceURL);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Pink | Favour</title>
      </Head>

      <Container maxW="sm" mt={16}>
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
            bg="whiteAlpha.200"
            borderRadius="lg"
          >
            <UserPreview user={debtor} />
            <Text color="primary.200">Promised</Text>
            <UserPreview user={recipient} />
          </Stack>

          {/* Reward Pool */}
          <Wrap justify="center" w="28rem">
            {Object.keys(rewards).map((reward) => (
              <Box bg="whiteAlpha.200" borderRadius="lg" px={4} py={3} key={reward}>
                <RewardCube reward={reward} quantity={rewards[reward]} />
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
              variant="ghost"
              colorScheme="red"
              rightIcon={<DeleteIcon />}
            >
              Delete
            </Button>
            {user?.uid === debtor._id && !favour.evidence && (
              <input type="file" onChange={uploadEvidence} />
            )}
          </Stack>
        </Stack>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { "pinky-auth": accessToken } = nookies.get(ctx);
    await firebaseAdmin.auth().verifyIdToken(accessToken);

    const favour = await Favour.findById(ctx.query.id).lean();

    return { props: { favour } };
  } catch (error) {
    // User isn't authenticated, send to login
    ctx.res.writeHead(302, { location: "/login" });
    ctx.res.end();

    return { props: {} as never };
  }
};

export default FavourDetails;
