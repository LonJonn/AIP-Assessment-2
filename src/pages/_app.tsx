import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider, Flex } from "@chakra-ui/core";
import { AuthProvider } from "hooks/useAuth";
import fetcher from "lib/fetcher";
import theme from "theme";
import { SWRConfig } from "swr";
import SuperJSON from "superjson";
import { Types } from "mongoose";
import Header from "components/layout/Header";
import Footer from "components/layout/Footer";
import { AnimatePresence, motion, MotionProps } from "framer-motion";
import NextNProgress from "nextjs-progressbar";

/**
 * Add global serializer for Mongo Object IDs
 */

SuperJSON.registerCustom<Types.ObjectId, string>(
  {
    isApplicable: (v): v is Types.ObjectId => v instanceof Types.ObjectId,
    serialize: (v) => v.toHexString(),
    deserialize: (v) => new Types.ObjectId(v),
  },
  "objectid"
);

/**
 * Animations
 */

const pageAnimation: MotionProps = {
  variants: {
    pageStart: {
      opacity: 0,
      y: 50,
    },
    pageEnter: {
      opacity: 1,
      y: 0,
    },
    pageExit: {
      opacity: 0,
    },
  },
  initial: "pageStart",
  animate: "pageEnter",
  exit: "pageExit",
  transition: {
    ease: "easeOut",
    duration: 0.4,
  },
};

/**
 * Main App Component
 */

const App: React.FC<AppProps> = ({ Component, pageProps, router }) => (
  <>
    <Head>
      <title>Pinki</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <ChakraProvider resetCSS theme={theme}>
      <AuthProvider>
        <SWRConfig value={{ fetcher }}>
          <NextNProgress color="#ec5f90" startPosition={0.3} stopDelayMs={200} />

          <Flex h="100vh" flexDir="column">
            <Header />

            <AnimatePresence exitBeforeEnter>
              <motion.main style={{ flexGrow: 1 }} {...pageAnimation} key={router.asPath}>
                <Component {...pageProps} />
              </motion.main>
            </AnimatePresence>

            <Footer />
          </Flex>
        </SWRConfig>
      </AuthProvider>
    </ChakraProvider>
  </>
);
export default App;
