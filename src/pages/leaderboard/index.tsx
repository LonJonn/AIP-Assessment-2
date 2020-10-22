import React from "react";
import useSWR from "swr";
import { EmbeddedUserSchema } from "models/User";
import { ApiError } from "lib/errorHandler";
import { Container, Heading, Box, Divider, Grid, SimpleGrid, Text } from "@chakra-ui/core";
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

      <Container maxW="5xl" centerContent>
        <Heading size="xl" m="8">
          Global Leaderboard
        </Heading>

        {/* <Grid templateColumns="repeat(5, 1fr)" gap={6}>
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
        </Grid> */}

        <Box as="table" w="full" cellPadding={20} textAlign="left">
          <tr>
            <th>Rank #</th>
            <th>
              <Text paddingRight="20px" paddingLeft="250px">
                Name
              </Text>
            </th>
            <th>
              <Text>Points</Text>
            </th>
          </tr>
        </Box>
        <Divider borderColor="red.200" />

        {allUsers && (
          <Box as="table" w="full" cellPadding={20}>
            {allUsers.map((user) => (
              <LeaderboardRow user={user} />
            ))}
          </Box>
        )}
      </Container>
    </>
  );
};

export default Leaderboard;
