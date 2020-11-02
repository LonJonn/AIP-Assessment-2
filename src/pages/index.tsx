import React from "react";
import { Heading, Stack, useColorMode } from "@chakra-ui/core";
import Layout from "components/layout/Layout";

const Home: React.FC = () => {

  return (
    <Layout title="Home">
      <Stack align="center">
        <Heading
          size="2xl"
          m="10"
          fontSize="200px"
          paddingTop="125px"
          paddingBottom="0"
          letterSpacing="15px"
        >
          PINKI
        </Heading>
        <Heading size="2xl">I Owe... Who??</Heading>
      </Stack>
    </Layout>
  );
};

export default Home;
