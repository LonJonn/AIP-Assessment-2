import { ChakraProvider } from "@chakra-ui/core";
import Head from "next/head";
import React from "react";
import { SWRConfig } from "swr";
import fetcher from "utils/fetcher";
import theme from "../theme";
import type { AppProps } from "next/app";

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Pinki</title>
      <link rel="icon" href="/favicon.ico" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap"
        rel="stylesheet"
      ></link>
    </Head>

    <SWRConfig value={{ fetcher }}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SWRConfig>
  </>
);

export default App;
