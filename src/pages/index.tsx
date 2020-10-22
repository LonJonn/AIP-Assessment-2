import React from "react";
import Link from "next/link";
import { Button, useColorMode, Heading } from "@chakra-ui/core";
import { Container } from "next/app";

const Home: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div>
      <Container maxW="5xl" centerContent>
        <Heading
          as="h1"
          size="2xl"
          m="10"
          fontSize="200px"
          textAlign="center"
          paddingTop="125px"
          paddingBottom="0"
          letterSpacing="15px"
        >
          Pinki
        </Heading>

        <Heading as="h4" size="xl" fontSize="20px" textAlign="center">
          I Owe... Who??
        </Heading>
      </Container>

      {/* <p>
        <Button color="orange.300" variant="outline" onClick={toggleColorMode}>
          mode: {colorMode}
        </Button>
      </p>

      <Link href="/login">
        <a>login</a>
      </Link>
      <Link href="/test">
        <a>Test</a>
      </Link>

      <footer>Footer content here</footer> */}
    </div>
  );
};

export default Home;
