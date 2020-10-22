import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Container,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Skeleton,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/core";
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import Card from "components/request/Card";
import { useAuth } from "lib/auth";
import { ApiError } from "lib/errorHandler";
import { RequestSchema } from "models/Request";
import useSWR from "swr";

interface PaginatedRequests {
  requests: RequestSchema[];
  currentPage: number;
  totalPages: number;
}

const RequestList: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [pageIndex, setPageIndex] = useState(1);
  const { data, mutate } = useSWR<PaginatedRequests, ApiError>(`/api/requests?page=${pageIndex}`);

  const prevDisabled = pageIndex === 1;
  const nextDisabled = pageIndex === data?.totalPages;

  const redirect = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/requests/create");
    }
  };

  return (
    <>
      <Head>
        <title> Pinki | Requests</title>
      </Head>

      <Container maxW="4xl" centerContent>
        <HStack align="center" w="4xl" px={16}>
          <Heading size="xl" my="8">
            Requests
          </Heading>
          <Spacer />
          <IconButton onClick={redirect} aria-label="Add" icon={<AddIcon />} />
        </HStack>

        {!data ? (
          <SimpleGrid columns={2} spacing="5">
            <Skeleton width="sm" height="40" />
            <Skeleton width="sm" height="40" />
            <Skeleton width="sm" height="40" />
            <Skeleton width="sm" height="40" />
            <Skeleton width="sm" height="40" />
            <Skeleton width="sm" height="40" />
            <Skeleton width="sm" height="40" />
            <Skeleton width="sm" height="40" />
          </SimpleGrid>
        ) : (
          <>
            {data.requests.length == 0 ? (
              <>
                <Text color="whiteAlpha.800" fontSize="3xl">
                  No Requests 😫
                </Text>
                <Text color="whiteAlpha.800" fontSize="xl">
                  Why not make one? 🤔
                </Text>
              </>
            ) : (
              <>
                <SimpleGrid columns={2} spacing="5">
                  {data.requests.map((request) => (
                    <Card request={request} key={request._id.toString()} />
                  ))}
                </SimpleGrid>
                <Stack direction="row" mt={4} spacing={16} align="center">
                  <IconButton
                    disabled={prevDisabled}
                    onClick={() => {
                      if (data.currentPage > 1) setPageIndex(pageIndex - 1);
                    }}
                    aria-label="Previous"
                    icon={<ArrowLeftIcon />}
                  />
                  <Text bg="whiteAlpha.200" px={4} py={2} borderRadius="full" fontWeight="bold">
                    {data.currentPage}
                  </Text>
                  <IconButton
                    disabled={nextDisabled}
                    onClick={() => {
                      if (data.currentPage < data.totalPages) setPageIndex(pageIndex + 1);
                    }}
                    aria-label="Next"
                    icon={<ArrowRightIcon />}
                  />
                </Stack>
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default RequestList;
