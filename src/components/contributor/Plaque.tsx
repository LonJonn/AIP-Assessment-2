import { Center, Box, Image, Text, Spacer, SimpleGrid } from "@chakra-ui/core";
import { EmbeddedUserSchema } from "models/User";
import React from "react";

interface PlaqueProps {
  contributor: EmbeddedUserSchema;
}
const Plaque: React.FC<PlaqueProps> = ({ contributor }) => {
  return (
    <>
      <SimpleGrid columns={2} borderRadius="md" bg="whiteAlpha.200" w="32" p={3}>
        <Box borderRadius="full" w={5} h={5} bg="white"></Box>
        <Text fontSize="xs">{contributor.displayName}</Text>
      </SimpleGrid>
    </>
  );
};

export default Plaque;
