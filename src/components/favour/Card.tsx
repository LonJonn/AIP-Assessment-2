import React from "react";
import NextLink from "next/link";
import { Flex, Spacer, Text } from "@chakra-ui/core";
import { FavourSchema } from "models/Favour";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuth } from "lib/auth";

dayjs.extend(relativeTime);

interface FavourCardProps {
  favour: FavourSchema;
}

const FavourCard: React.FC<FavourCardProps> = ({ favour }) => {
  const { _id, debtor, recipient, rewards, createdAt } = favour;

  // Change promise text based on favour
  const { user } = useAuth();
  const isDebtor = user?.uid === debtor._id;

  return (
    <NextLink href={`/favours/${_id}`}>
      <Flex
        h={40}
        p={5}
        bg="whiteAlpha.200"
        borderRadius="lg"
        flexDir="column"
        _hover={{ cursor: "pointer" }}
      >
        <Text fontSize="xl" fontWeight="bold">
          {isDebtor ? "You" : debtor.displayName}{" "}
          <Text as="span" fontWeight="normal">
            promised
          </Text>{" "}
          {!isDebtor ? "You" : recipient.displayName}
        </Text>
        <Text mt={1} fontSize="2xl">
          {Object.keys(rewards).map((reward) => (
            <span key={reward}>{reward}</span>
          ))}
        </Text>

        <Spacer />

        <Text>{dayjs(createdAt).from(new Date())}</Text>
      </Flex>
    </NextLink>
  );
};

export default FavourCard;
