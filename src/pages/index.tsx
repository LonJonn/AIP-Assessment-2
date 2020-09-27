import { Button, useColorMode } from "@chakra-ui/core";
import Link from "next/link";
import React from "react";

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

      <Link href="/login">
        <a>login</a>
      </Link>

      <footer>Footer content here</footer>
    </div>
  );
};

export default Home;
