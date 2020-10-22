import { Avatar, AvatarBadge, Wrap, Img } from "@chakra-ui/core";
import React from "react";
import { EmbeddedUserSchema } from "models/User";

interface LeaderboardRowProps {
  user: EmbeddedUserSchema;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ user }) => {
  const { _id, displayName, email, photoURL } = user;

  return (
    <>
      <tr>
        <td>1</td>
        {/* <td>{_id}</td> */}
        {/* If User has a profile picutre then implement */}
        {/* If Not then give them a placeholder picture */}
        <td>
          <Wrap>
            <Avatar name={displayName} src={photoURL} />
          </Wrap>
        </td>
        <td>{displayName}</td>
        <td>0</td>
      </tr>
    </>
  );
};

// Display users name
// PhotoId
// Number of favours Completed

export default LeaderboardRow;
