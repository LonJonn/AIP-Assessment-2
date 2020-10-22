import React from "react";
import { Text, HStack } from "@chakra-ui/core";

interface RewardCubeProps {
  reward: string;
  quantity: number;
}

const RewardCube: React.FC<RewardCubeProps> = ({ reward, quantity }) => {
  return (
    <HStack spacing={4} borderRadius="md" w="24">
      <Text fontSize="4xl">{reward}</Text>
      <Text>{quantity}</Text>
    </HStack>
  );
};

export default RewardCube;
