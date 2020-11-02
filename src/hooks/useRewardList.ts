import constate from "constate";
import { Rewards } from "models/Favour";
import { useReducer } from "react";

export type RewardsReducerAction =
  | { type: "set"; payload: { reward: string; quantity: number } }
  | { type: "remove"; payload: string }
  | { type: "overwrite"; payload: Rewards }
  | { type: "clear" };

function rewardsReducer(state: Rewards, action: RewardsReducerAction) {
  switch (action.type) {
    case "set":
      if (action.payload.quantity <= 0) return { ...state };

      state[action.payload.reward] = action.payload.quantity;
      return { ...state };
    case "remove":
      delete state[action.payload];
      return { ...state };
    case "overwrite":
      return { ...action.payload };
    case "clear":
      return {};
    default:
      throw new Error("No action provided for rewards reducer.");
  }
}

function useRewardListHook() {
  const [rewards, dispatch] = useReducer(rewardsReducer, {});
  return { rewards, dispatch };
}

export const [RewardListProvider, useRewardList] = constate(useRewardListHook);
