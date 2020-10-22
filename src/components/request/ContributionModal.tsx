import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/core";
import RewardList from "components/reward/RewardList";
import { useRewardList } from "hooks/useRewardList";
import { useAuth } from "lib/auth";
import fetcher from "lib/fetcher";
import { Rewards } from "models/Request";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initRewards: Rewards;
}

const RewardModal: React.FC<RewardModalProps> = ({ isOpen, onClose, initRewards }) => {
  const toast = useToast();
  const { accessToken } = useAuth();
  const router = useRouter();

  // Reward List Context
  const { rewards, dispatch } = useRewardList();
  useEffect(() => {
    dispatch({ type: "overwrite", payload: initRewards });
  }, [initRewards]);

  // Add/Edit Contribution
  const editRewards = useCallback(async () => {
    const { id } = router.query;
    const emptyRewards = Object.keys(rewards).length === 0;

    try {
      await fetcher(`/api/requests/${id}/contributions`, accessToken, {
        method: "PUT",
        body: JSON.stringify({
          rewards: emptyRewards ? undefined : rewards,
        }),
        headers: { "Content-type": "application/json" },
      });

      router.reload();
    } catch (error) {
      toast({
        title: "Error!",
        description: error.details.errors[0].message,
        status: "error",
      });
    }
  }, [accessToken, rewards]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent minW="2xl">
          <ModalHeader>Add Rewards</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RewardList />
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => {
                dispatch({ type: "clear" });
              }}
              variant="link"
              colorScheme="red"
              mr={5}
            >
              Clear
            </Button>
            <Button onClick={editRewards} colorScheme="green" mr={3}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default RewardModal;
