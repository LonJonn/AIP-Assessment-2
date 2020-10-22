import React, { useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Avatar,
  AvatarGroup,
  Box,
  Heading,
  Stack,
  Button,
  Text,
  Container,
  SimpleGrid,
  HStack,
  Spacer,
  useDisclosure,
  Input,
  useToast,
  Image,
} from "@chakra-ui/core";
import Router, { useRouter } from "next/router";
import { RequestSchema } from "models/Request";
import RewardCube from "@/components/reward/RewardCube";
import { useAuth } from "lib/auth";
import fetcher, { FetcherError } from "lib/fetcher";
import DeleteAlert from "@/components/request/DeleteAlert";
import RewardModal from "@/components/request/ContributionModal";
import useSWR from "swr";
import { NextPage } from "next";
import { ApiError } from "lib/errorHandler";
import { useForm } from "react-hook-form";
import { RewardListProvider, useRewardList } from "hooks/useRewardList";
import { yup } from "lib/validator";
import { yupResolver } from "@hookform/resolvers/yup";
import { evidenceSchema } from "lib/validator/schemas";

dayjs.extend(relativeTime);

interface RequestPageProps {
  initRequest: RequestSchema;
}

const RequestPage: NextPage<RequestPageProps> = ({ initRequest }) => {
  const { user, accessToken } = useAuth();

  const toast = useToast();

  const router = useRouter();
  const { id } = router.query;

  const { data: request } = useSWR<RequestSchema>("/api/requests/" + id, {
    initialData: initRequest,
  });

  //Alert
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);

  //RewardsModal
  const { isOpen: isOpenRM, onOpen, onClose: onCloseRM } = useDisclosure();

  //Add Evidence Form
  const { register, handleSubmit, errors } = useForm({ resolver: yupResolver(evidenceSchema) });

  const { owner, title, createdAt, description, contributions, isClaimed } = request;

  const isContributor = user && Object.keys(contributions).includes(user.uid);

  function getEvidenceSrc(evidence: Buffer) {
    return "data:image/png;base64," + Buffer.from(evidence).toString("base64");
  }

  const addEvidenceAndClaim = async (data) => {
    const formData = new FormData();
    formData.append("evidence", data.evidence[0]);

    try {
      const res = await fetcher(`/api/requests/${request._id}/evidence`, accessToken, {
        method: "POST",
        body: formData,
      });
      router.reload();
    } catch (error) {
      toast({
        status: "error",
        title: "Uh oh...",
        description: "Maybe you haven't added evidence?",
      });
    }
  };

  const rewardPool = useMemo(() => {
    const temp = {};

    for (const contribution of Object.values(contributions)) {
      for (const reward in contribution.rewards) {
        temp[reward] = (temp[reward] || 0) + contribution.rewards[reward];
      }
    }

    return temp;
  }, [contributions]);

  return (
    <Container maxW="50rem" mt={24}>
      <Stack direction="column" spacing={10}>
        <Stack mb={18}>
          <Heading size="xl">{title}</Heading>
          <Text>{dayjs(createdAt).from(new Date())}</Text>
        </Stack>

        <SimpleGrid columns={2} spacing={5}>
          <Stack spacing={4}>
            <Heading size="md">Contributors</Heading>
            <Stack spacing={2} borderRadius="md" align="flex-start">
              <AvatarGroup max={3} p={2}>
                {Object.values(contributions).map((contribution) => (
                  <Avatar
                    borderColor="primary.50"
                    name={contribution.user.displayName}
                    src={contribution.user.photoURL}
                    key={contribution.user._id}
                  />
                ))}
              </AvatarGroup>
              {user && (
                <Button fontSize="sm" variant="link" onClick={onOpen} isDisabled={isClaimed}>
                  {isContributor ? "Edit" : "Add"} Contribution
                </Button>
              )}
            </Stack>
          </Stack>

          <Stack spacing={4}>
            <Heading size="md">Reward Pool</Heading>

            <Box borderRadius="md">
              <SimpleGrid columns={3} spacingX={12} w="50%">
                {Object.keys(rewardPool).map((reward) => (
                  <RewardCube reward={reward} quantity={rewardPool[reward]} key={reward} />
                ))}
              </SimpleGrid>
            </Box>
          </Stack>
        </SimpleGrid>

        <Stack spacing={4}>
          <Heading size="md">Description</Heading>
          <Box my={5} borderRadius="md" w="70%">
            <Text>{description}</Text>
          </Box>
        </Stack>

        {!isContributor && (
          <Stack my={18} spacing={4}>
            <Heading size="md">Evidence</Heading>
            <Stack
              id="evidenceform"
              as="form"
              align="flex-start"
              spacing={5}
              onSubmit={handleSubmit(addEvidenceAndClaim)}
            >
              <input id="evidence" type="file" name="evidence" ref={register} />
            </Stack>
            {request.evidence && <Image boxSize="xs" src={getEvidenceSrc(request.evidence)} />}
            {isClaimed && <Text>CLAIMED</Text>}
          </Stack>
        )}

        <HStack w="100%">
          {user?.uid === request.owner._id && (
            <Button onClick={() => setIsOpen(true)} colorScheme="red" isDisabled={isClaimed}>
              Delete Request
            </Button>
          )}
          <Spacer />
          {user?.uid !== request.owner._id && !isContributor && (
            <Button colorScheme="teal" form="evidenceform" type="submit" isDisabled={isClaimed}>
              Confirm & Claim
            </Button>
          )}
        </HStack>
      </Stack>

      <DeleteAlert isOpen={isOpen} onClose={onClose} id={request._id} />
      <RewardListProvider>
        <RewardModal
          isOpen={isOpenRM}
          onClose={onCloseRM}
          initRewards={contributions[user?.uid]?.rewards}
        />
      </RewardListProvider>
    </Container>
  );
};

RequestPage.getInitialProps = async ({ query, req, res }) => {
  try {
    const request = await fetcher(`${process.env.NEXT_PUBLIC_APIURL}/api/requests/${query.id}`);
    return { initRequest: request };
  } catch (error) {
    res.writeHead(302, { location: "/requests" });
    res.end();
  }
};

export default RequestPage;
