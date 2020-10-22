import { Avatar, AvatarBadge, Wrap, Img } from "@chakra-ui/core";
import React from "react";
import { EmbeddedUserSchema } from "models/User";

interface LeaderboardRowProps {
  user: EmbeddedUserSchema;
  rank: number;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ user, rank }) => {
  const { _id, displayName, email, photoURL, points } = user;

  return (
    <tr>
      <td>{rank}</td>
      {/* <td>{_id}</td> */}
      {/* If User has a profile picutre then implement */}
      {/* If Not then give them a placeholder picture */}
      <td>
        <Wrap>
          <Avatar name={displayName} src={photoURL} />
        </Wrap>
      </td>
      <td>{displayName}</td>
      <td>{points}</td>
    </tr>
  );
};

// Display users name
// PhotoId
// Number of favours Completed

export default LeaderboardRow;
