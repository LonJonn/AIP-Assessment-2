import { Heading, Spinner, Stack } from "@chakra-ui/core";
import { motion } from "framer-motion";
import Layout from "./Layout";

const Loader: React.FC = () => (
  <Layout title="Loading..." mt={48}>
    <Stack
      as={motion.div}
      w="full"
      direction="column"
      spacing={6}
      align="center"
      // Only show after 2 seconds of loading
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2 },
      }}
    >
      <Heading size="xl" fontWeight="medium">
        Loading...
      </Heading>
      <Spinner size="xl" speed="1s" thickness="4px" />
    </Stack>
  </Layout>
);

export default Loader;
