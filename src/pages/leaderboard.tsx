import React from "react";
import useSWR from "swr";
import { UserSchema } from "models/User";
import { ApiError } from "lib/errorHandler";
import { Heading, Box } from "@chakra-ui/core";
import LeaderboardRow from "components/leaderboard/LeaderboardRow";
import Layout from "components/layout/Layout";

const Leaderboard: React.FC = () => {
  const { data: users } = useSWR<UserSchema[], ApiError>("/api/leaderboard");

  return (
    <Layout title="Leaderboard">
      <Heading size="2xl" textAlign="center" mb={12}>
        Top 10 Pinkers
      </Heading>

      {/* Table */}
      <table width="100%">
        {/* Headings */}
        <thead>
          <tr>
            <th>Rank</th>
            <th style={{ width: 200 }}>Name</th>
            <th>Points</th>
          </tr>
        </thead>

        {/* Rows */}
        <tbody>
          {users &&
            users.map((user, i) => <LeaderboardRow user={user} rank={i + 1} key={user._id} />)}
        </tbody>
      </table>
    </Layout>
  );
};

export default Leaderboard;
