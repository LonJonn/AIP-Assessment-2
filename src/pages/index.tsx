import React from "react";
import Link from "next/link";
import { Button, useColorMode } from "@chakra-ui/core";

const Home: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div>
      <main>Main content here</main>

      <p>
        <Button color="orange.300" variant="outline" onClick={toggleColorMode}>
          mode: {colorMode}
        </Button>
      </p>
      <p>
        <Link href="/login">
          <a>login</a>
        </Link>
      </p>

      <Link href="/favour/create">
        <a>Create Favour</a>
      </Link>
      <Link href="/test">
        <a>Test</a>
      </Link>

      <footer>Footer content here</footer>
    </div>
  );
};

export default Home;
