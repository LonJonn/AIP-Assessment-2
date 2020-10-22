import React from "react";
import { availableRewards } from "lib/availableRewards";
import { CloseButton, Grid, Heading, IconButton, Input } from "@chakra-ui/core";
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
    <Grid templateColumns="15% 40% 35% 10%" py="2rem">
      <Heading textAlign="center">{reward}</Heading>
      <Heading textAlign="center" isTruncated>
        {availableRewards[reward]}
      </Heading>
      <Grid px="1rem" templateColumns="repeat(3,1fr)">
        <IconButton aria-label="Decrement reward" icon={<MinusIcon />} onClick={decrement} />
        <Input value={quantity} type="number" min="1" onChange={(e) => set(e.target.value)} />
        <IconButton aria-label="Increment reward" icon={<AddIcon />} onClick={increment} />
      </Grid>
      <CloseButton onClick={() => dispatch({ type: "remove", payload: reward })} />
    </Grid>
  );
};

export default RewardRow;
