import React from "react";
import { Avatar, Text, Stack, Box } from "@chakra-ui/core";
import { UserSchema } from "models/User";

interface LeaderboardRowProps {
  user: UserSchema;
  rank: number;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ user, rank }) => {
  const { displayName, photoURL, points } = user;

  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "";

  return (
    <tr>
      <Text as="td" fontSize="lg" textAlign="center">
        {rank}
      </Text>

      <Stack as="td" direction="row" spacing={6} align="center" py={3}>
        <Box pos="relative">
          <Avatar name={displayName} src={photoURL} size="lg" />
          <Text pos="absolute" fontSize="3xl" bottom={-3} right={-3}>
            {medal}
          </Text>
        </Box>
        <Text fontSize="lg" fontWeight="bold">
          {displayName}
        </Text>
      </Stack>

      <Text as="td" fontSize="lg" textAlign="center">
        {points}
      </Text>
    </tr>
  );
};

export default LeaderboardRow;
