import { Avatar, AvatarBadge, Wrap, Img, Text, Stack, Box, Spacer } from "@chakra-ui/core";
import React from "react";
import { EmbeddedUserSchema } from "models/User";

interface LeaderboardRowProps {
  user: EmbeddedUserSchema;
  rank: number;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ user, rank }) => {
  const { _id, displayName, email, photoURL, points } = user;

  return (
    <Stack direction="row" w="100%" spacing={0} px={5}>
      <Text alignSelf="center">{rank}</Text>
      <Spacer />
      <Stack direction="row" w="35%" spacing={0}>
        <Avatar name={displayName} src={photoURL} />
        <Spacer />
        <Text alignSelf="center">{displayName}</Text>
      </Stack>
      <Spacer />
      <Text alignSelf="center">{points}</Text>
    </Stack>
  );
};

// Display users name
// PhotoId
// Number of favours Completed

export default LeaderboardRow;
