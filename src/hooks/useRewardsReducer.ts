import { Rewards } from "models/Favour";
import { useReducer } from "react";

type RewardsReducerAction =
  | { type: "set"; payload: { reward: string; quantity: number } }
  | { type: "remove"; payload: string }
  | { type: "clear" };

function rewardsReducer(state: Rewards, action: RewardsReducerAction) {
  switch (action.type) {
    case "set":
      state[action.payload.reward] = action.payload.quantity;
      return state;
    case "remove":
      delete state[action.payload];
      return state;
    case "clear":
      return {};
    default:
      throw new Error("No action provided for rewards reducer.");
  }
}

export default function useRewardList() {
  const [rewards, dispatch] = useReducer(rewardsReducer, {});
  return { rewards, dispatch };
}
