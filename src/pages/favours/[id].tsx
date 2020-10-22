import React, { useCallback } from "react";
import { NextPage } from "next";
import { FavourSchema } from "models/Favour";
import fetcher, { FetcherError } from "lib/fetcher";
import nookies from "nookies";
import Head from "next/head";
import { Avatar, Box, Button, Container, SimpleGrid, Stack, Text, useToast } from "@chakra-ui/core";
import RewardCube from "components/reward/RewardCube";
import { EmbeddedUserSchema } from "models/User";
import { useAuth } from "lib/auth";
import { useRouter } from "next/router";

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

const FavourDetails: NextPage<FavourDetailsProps> = ({ favour }) => {
  const toast = useToast();
  const router = useRouter();

  const { user, accessToken } = useAuth();
  const { _id, debtor, recipient, rewards, evidence } = favour;

  // Delete Favour
  const canDelete = user?.uid === recipient._id || (user?.uid === debtor._id && evidence);
  const deleteFavour = useCallback(async () => {
    try {
      await fetcher(`${process.env.NEXT_PUBLIC_APIURL}/api/favours/${_id}`, accessToken, {
        method: "DELETE",
      });

      router.push("/favours");
    } catch (error) {
      const { details } = error as FetcherError;
      for (const err of details.errors) {
        toast({
          status: "error",
          title: "Uh oh...",
          description: err.message,
        });
      }
    }
  }, [_id, accessToken]);

  return (
    <>
      <Head>
        <title>Pink | Favour</title>
      </Head>

      <Container maxW="sm" mt={16}>
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
            <Text color="primary.300">Promised</Text>
            <UserPreview user={recipient} />
          </Stack>

          {/* Reward Pool */}
          <SimpleGrid columns={3}>
            {Object.keys(rewards).map((reward) => (
              <Box bg="whiteAlpha.200" borderRadius="lg" px={4} py={3} key={reward}>
                <RewardCube reward={reward} quantity={rewards[reward]} />
              </Box>
            ))}
          </SimpleGrid>

          {/* Actions */}
          <Stack direction="row" justify="space-between" w="full">
            <Button
              onClick={deleteFavour}
              isDisabled={!canDelete}
              variant="ghost"
              colorScheme="red"
            >
              Delete
            </Button>
            <Button>Upload Evidence</Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
};

FavourDetails.getInitialProps = async (ctx) => {
  const { "pinky-auth": accessToken } = nookies.get(ctx);
  const favour = await fetcher(
    `${process.env.NEXT_PUBLIC_APIURL}/api/favours/${ctx.query.id}`,
    accessToken
  );

  return { favour };
};

export default FavourDetails;
