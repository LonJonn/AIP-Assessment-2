import React from "react";
import useSWR from "swr";
import { EmbeddedUserSchema } from "models/User";
import { ApiError } from "lib/errorHandler";
import {
  Container,
  Heading,
  Box,
  Divider,
  Grid,
  SimpleGrid,
} from "@chakra-ui/core";
import LeaderboardRow from "components/leaderboard/LeaderboardRow";
import { database } from "firebase";

const Leaderboard: React.FC = () => {
  const { data: allUsers } = useSWR<EmbeddedUserSchema[], ApiError>(
    "http://localhost:3000/api/leaderboard"
  );

  return (
    <>
      <head>
        <title> Pinki | Leaderboard </title>
      </head>

      <Container maxW="4xl" centerContent>
        <Heading size="xl" m="8">
          Global Leaderboard
        </Heading>
      </Container>

      <Container maxW="5xl">
        <Grid templateColumns="repeat(5, 1fr)" gap={6}>
          <Box w="100%" h="10">
            Rank #
          </Box>
          <Box w="100%" h="10" />
          <Box w="100%" h="10" />
          <Box w="100%" h="10">
            Name
          </Box>
          <Box w="100%" h="10">
            # of Completed Favours
          </Box>
        </Grid>
        <Divider borderColor="red.200" />

        {allUsers && (
          <SimpleGrid column={1}>
            {allUsers.map((user) => (
              <LeaderboardRow user={user} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </>
  );
};

export default Leaderboard;
