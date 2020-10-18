import React from "react";
import useSWR from "swr";
import { EmbeddedUserSchema } from "models/User";
import { ApiError } from "lib/errorHandler";
import { Container, Heading, Grid, Box } from "@chakra-ui/core";

const Leaderboard: React.FC = () => {
  const { data: allRequests } = useSWR<EmbeddedUserSchema[], ApiError>(
    "http://localhost:3000/api/users"
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

        <Box h={100} w={100} bg="blue.500" />
      </Container>
    </>
  );
};

export default Leaderboard;
