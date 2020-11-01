import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/core";
import { AuthProvider } from "hooks/useAuth";
import fetcher from "lib/fetcher";
import theme from "theme";
import { SWRConfig } from "swr";

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
          <Component {...pageProps} />
        </SWRConfig>
      </AuthProvider>
    </ChakraProvider>
  </>
);
export default App;
