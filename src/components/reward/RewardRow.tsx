import React from "react";
import { availableRewards } from "lib/availableRewards";
import {
  Box,
  CloseButton,
  Grid,
  Heading,
  IconButton,
  Input,
  Spacer,
  Stack,
  useColorModeValue,
} from "@chakra-ui/core";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useRewardList } from "hooks/useRewardList";

interface RewardRowProps {
  reward: string;
  quantity: number;
}

const RewardRow: React.FC<RewardRowProps> = ({ reward, quantity }) => {
  const { dispatch } = useRewardList();

  const increment = () => dispatch({ type: "set", payload: { reward, quantity: quantity + 1 } });
  const decrement = () => dispatch({ type: "set", payload: { reward, quantity: quantity - 1 } });
  const set = (quantity) =>
    dispatch({ type: "set", payload: { reward, quantity: Number(quantity) } });

  return (
    <Box borderRadius="md" mb={3} background={useColorModeValue("primary.100", "whiteAlpha.100")}>
      <Stack direction="row" p={4} align="center">
        <Heading w={12}>{reward}</Heading>
        <Spacer />
        <Heading isTruncated py={1}>
          {availableRewards[reward]}
        </Heading>
        <Spacer />
        <Stack direction="row" spacing={2} align="center">
          <IconButton aria-label="Decrement reward" icon={<MinusIcon />} onClick={decrement} />
          <Input
            value={quantity}
            type="number"
            min="1"
            maxW={16}
            onChange={(e) => set(e.target.value)}
          />
          <IconButton aria-label="Increment reward" icon={<AddIcon />} onClick={increment} />
          <CloseButton onClick={() => dispatch({ type: "remove", payload: reward })} />
        </Stack>
      </Stack>
    </Box>
  );
};

export default RewardRow;
