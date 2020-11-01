import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useToast,
} from "@chakra-ui/core";
import { useAuth } from "hooks/useAuth";
import fetcher from "lib/fetcher";
import { Types } from "mongoose";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";

interface DeleteAlertProps {
  id: Types.ObjectId;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAlert: React.FC<DeleteAlertProps> = ({ id, isOpen, onClose }) => {
  const router = useRouter();
  const { accessToken } = useAuth();
  const toast = useToast();

  //Alert State
  const cancelRef = React.useRef();

  //Delete Function
  const deleteRequest = async () => {
    try {
      await fetcher(`/api/requests/${id}`, accessToken, { method: "DELETE" });
      router.push("/requests");
    } catch (error) {
      toast({
        status: "error",
        title: "Uh oh...",
        description: "Bruh Sorry",
      });
    }
  };

  return (
    <>
      <AlertDialog isCentered isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Request
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deleteRequest} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteAlert;
