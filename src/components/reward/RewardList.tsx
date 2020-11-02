import React from "react";
import {
  Button,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/core";
import { useRewardList } from "hooks/useRewardList";
import { availableRewards } from "lib/availableRewards";
import RewardRow from "./RewardRow";

const RewardModal: React.FC = () => {
  const { rewards, dispatch } = useRewardList();
  const { isOpen, onOpen, onClose } = useDisclosure();

  function addReward(emoji: string) {
    dispatch({ type: "set", payload: { reward: emoji, quantity: 1 } });
    onClose();
  }

  return (
    <>
      <Button w="100%" onClick={onOpen}>
        Add Reward
      </Button>

      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Choose Reward</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns="repeat(3,2fr)">
                {Object.keys(availableRewards).map((reward) => (
                  <Button
                    onClick={() => addReward(reward)}
                    size="lg"
                    key={reward}
                    disabled={Object.keys(rewards).includes(reward)}
                  >
                    {reward}
                  </Button>
                ))}
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

const RewardList: React.FC = () => {
  const { rewards } = useRewardList();

  return (
    <div id="reward-list">
      {Object.keys(rewards).map((emoji) => (
        <RewardRow reward={emoji} quantity={rewards[emoji]} key={emoji} />
      ))}
      <RewardModal />
    </div>
  );
};

export default RewardList;
