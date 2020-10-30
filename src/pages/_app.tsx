import React from "react";
import Head from "next/head";
import { AuthProvider } from "hooks/useAuth";
import { SWRConfig } from "swr";
import fetcher from "lib/fetcher";
import { ChakraProvider } from "@chakra-ui/core";
import theme from "../theme";
import type { AppProps } from "next/app";
import Header from "components/layout/header";

/**
 * Add global serializer for Mongo Object IDs
 */

import SuperJSON from "superjson";
import { Types } from "mongoose";

SuperJSON.registerCustom<Types.ObjectId, string>(
  {
    isApplicable: (v): v is Types.ObjectId => v instanceof Types.ObjectId,
    serialize: (v) => v.toHexString(),
    deserialize: (v) => new Types.ObjectId(v),
  },
  "objectid"
);

/**
 * Main App Component
 */
const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Pinki</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <ChakraProvider resetCSS theme={theme}>
      <AuthProvider>
        <SWRConfig value={{ fetcher }}>
          <Header />
          <Component {...pageProps} />
        </SWRConfig>
      </AuthProvider>
    </ChakraProvider>
  </>
);
export default App;
