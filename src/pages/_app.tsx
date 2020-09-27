import React from "react";
import { ChakraProvider } from "@chakra-ui/core";
import type { AppProps } from "next/app";

import theme from "../theme";
import Head from "next/head";

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <ChakraProvider resetCSS theme={theme}>
    <Head>
      <title>Pinki</title>
      <link rel="icon" href="/favicon.ico" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap"
        rel="stylesheet"
      ></link>
    </Head>

    <Component {...pageProps} />
  </ChakraProvider>
);

export default App;
