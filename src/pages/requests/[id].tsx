import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Skeleton,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/core";
import Layout from "components/layout/Layout";
import RewardModal from "components/request/ContributionModal";
import DeleteAlert from "components/request/DeleteAlert";
import RewardCube from "components/reward/RewardCube";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuth } from "hooks/useAuth";
import { RewardListProvider } from "hooks/useRewardList";
import fetcher from "lib/fetcher";
import { firebase } from "lib/firebase/client";
import Request, { RequestSchema } from "models/Request";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";

dayjs.extend(relativeTime);

interface RequestPageProps {
  initRequest: RequestSchema;
}

const RequestPage: React.FC<RequestPageProps> = ({ initRequest }) => {
  const router = useRouter();
  const { id } = router.query;

  const toast = useToast();

  // get logged in user details
  const { user, accessToken } = useAuth();

  //get request details using SWR
  const { data: request } = useSWR<RequestSchema>("/api/requests/" + id, {
    initialData: initRequest,
  });
  const { owner, title, createdAt, description, contributions, isClaimed } = initRequest;
  const isContributor = user && Object.keys(contributions).includes(user.uid);

  //Edit rewards
  const { isOpen: isOpenRM, onOpen, onClose: onCloseRM } = useDisclosure();
  const rewardPool = useMemo(() => {
    const temp = {};

    for (const contribution of Object.values(contributions)) {
      for (const reward in contribution.rewards) {
        temp[reward] = (temp[reward] || 0) + contribution.rewards[reward];
      }
    }

    return temp;
  }, [contributions]);

  //state for delete request alert
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);

  //evidence upload
  const previewImageRef = useRef<HTMLImageElement>(null);
  const [cannotSubmit, setCannotSubmit] = useState(true);

  const checkFileType = () => {
    const fileInput = document.getElementById("evidence") as HTMLInputElement;
    const filePath = fileInput.value;
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    // Checking if uploaded image is a image type file, otherwise empty file input
    // RegEx inspired by: https://www.geeksforgeeks.org/file-type-validation-while-uploading-it-using-javascript/
    if (!allowedExtensions.exec(filePath)) {
      toast({
        title: "OI MATE",
        description: "Please only upload image type files.",
        status: "error",
      });
      fileInput.value = "";
      previewImageRef.current.src = "";
      setCannotSubmit(true);
    } else {
      if (fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImageRef.current.src = e.target.result.toString();
        };
        reader.readAsDataURL(fileInput.files[0]);
        setCannotSubmit(false);
      }
    }
  };

  //Claim Request method
  const confirmAndClaim = async () => {
    const fileInput = document.getElementById("evidence") as HTMLInputElement;
    const evidence = fileInput.files[0];

    //prettier-ignore
    //using firebase storage to store image and use link instead
    const path = `requests/${request.title}_${request._id}_${new Date().toISOString()}/evidence.png`;
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(path);
    await fileRef.put(evidence);

    await fetcher(`/api/requests/${request._id}/evidence`, accessToken, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        evidence: path,
      }),
    });

    router.reload();
  };

  //Showing evidence after claimed on page
  const [evidenceURL, setEvidenceURL] = useState<string>();
  const evidenceLoading = request.evidence && !evidenceURL;
  useEffect(() => {
    if (request.evidence) {
      firebase.storage().ref(request.evidence).getDownloadURL().then(setEvidenceURL);
    }
  }, [request.evidence]);

  return (
    <Layout>
      <Stack direction="column" spacing={10}>
        <Stack mb={18}>
          <Heading size="xl">{title}</Heading>
          <Text>{dayjs(createdAt).from(new Date())}</Text>
        </Stack>

        <Stack>
          {isClaimed ? (
            <Alert status="success">
              <AlertIcon />
              <AlertTitle mr={2}>Woo Hoo!</AlertTitle>
              <AlertDescription>This request has been completed. Rejoice! 🥳</AlertDescription>
            </Alert>
          ) : (
            <Alert status="info">
              <AlertIcon />
              <AlertTitle mr={2}></AlertTitle>
              <AlertDescription>
                Contribute or Claim this request below. Evidence required. 😳
              </AlertDescription>
            </Alert>
          )}
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

        <Stack>
          <Heading size="md">Evidence</Heading>
          {isContributor ||
            (!user && !isClaimed && (
              <Text>You cannot claim if you are a contributor or not logged in.</Text>
            ))}

          {isClaimed && (
            <Skeleton isLoaded={!evidenceLoading} h={64} w="25%">
              {isClaimed && (
                <Image borderRadius="md" fit-cover src={evidenceURL} w="100%" h="auto" />
              )}
            </Skeleton>
          )}

          {!isContributor && !isClaimed && user && (
            <Stack my={18} spacing={4}>
              <Stack id="evidenceform" as="form" align="flex-start" spacing={5}>
                <input id="evidence" type="file" onChange={checkFileType} name="evidence" />
                <Image
                  borderRadius="md"
                  fit-cover
                  ref={previewImageRef}
                  hidden={cannotSubmit}
                  w="25%"
                  h="auto"
                />
              </Stack>
            </Stack>
          )}
        </Stack>

        <HStack w="100%">
          {user?.uid === initRequest.owner._id && (
            <Button onClick={() => setIsOpen(true)} colorScheme="red" isDisabled={isClaimed}>
              Delete Request
            </Button>
          )}
          <Spacer />
          {user?.uid !== initRequest.owner._id && !isContributor && !isClaimed && user && (
            <Button
              colorScheme="green"
              type="submit"
              isDisabled={cannotSubmit}
              onClick={confirmAndClaim}
            >
              Confirm & Claim
            </Button>
          )}
        </HStack>
      </Stack>

      <DeleteAlert isOpen={isOpen} onClose={onClose} id={initRequest._id} />
      <RewardListProvider>
        <RewardModal
          isOpen={isOpenRM}
          onClose={onCloseRM}
          initRewards={contributions[user?.uid]?.rewards}
        />
      </RewardListProvider>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const request = await Request.findById(ctx.query.id).lean();
    const initRequest = JSON.parse(JSON.stringify(request));

    return { props: { initRequest: initRequest } };
  } catch (error) {
    // User isn't authenticated, send to login

    return { unstable_redirect: { destination: "/requests", permanent: false } };
  }
};

export default RequestPage;
