import { Container, Box, Grid, Divider } from "@chakra-ui/core";
import React from "react";
import { EmbeddedUserSchema } from "models/User";

interface LeaderboardRowProps {
  user: EmbeddedUserSchema;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ user }) => {
  const { _id, displayName, email } = user;

  return (
    <>
      <Box>
        {_id}
        {displayName}
        {email}
      </Box>
    </>
  );
};

// Display users name
// PhotoId
// Number of favours Completed

export default LeaderboardRow;
