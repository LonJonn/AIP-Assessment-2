import React from "react";
import useSWR from "swr";
import { EmbeddedUserSchema } from "models/User";
import { ApiError } from "lib/errorHandler";
import { Container, Heading, Box, Divider, Text, SimpleGrid, Stack, Spacer } from "@chakra-ui/core";
import LeaderboardRow from "components/leaderboard/LeaderboardRow";
import Layout from "components/layout/Layout";

const Leaderboard: React.FC = () => {
  const { data: allUsers } = useSWR<EmbeddedUserSchema[], ApiError>("/api/leaderboard");

  return (
    <Layout title="Leaderboard" mt={8}>
      <Heading size="2xl" textAlign="center" mb={8}>
        Top 10 Pinkers
      </Heading>

      <Stack spacing={5}>
        <Stack direction="row" w="80%" alignSelf="center">
          <Heading size="md">Rank</Heading>
          <Spacer />
          <Heading size="md">Name</Heading>
          <Spacer />
          <Heading size="md">Points</Heading>
        </Stack>
        <Divider borderColor="red.200" />
        <SimpleGrid column={1} spacing={10} alignSelf="center" width="80%">
          {allUsers &&
            allUsers.map((user, idx) => (
              <LeaderboardRow user={user} rank={idx + 1} key={user._id} />
            ))}
        </SimpleGrid>
      </Stack>
    </Layout>
  );
};

export default Leaderboard;
