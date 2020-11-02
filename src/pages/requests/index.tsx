import {
  Button,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/core";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import Layout from "components/layout/Layout";
import PageNavigation from "components/list/PageNavigation";
import RequestCard from "components/request/Card";
import { useAuth } from "hooks/useAuth";
import useDebounce from "hooks/useDebounce";
import { ApiError } from "lib/errorHandler";
import { RequestSchema } from "models/Request";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

interface PaginatedRequests {
  requests: RequestSchema[];
  currentPage: number;
  totalPages: number;
}

const RequestList: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  //Pagination influenced by: https://medium.com/javascript-in-plain-english/simple-pagination-with-node-js-mongoose-and-express-4942af479ab2
  const [pageIndex, setPageIndex] = useState(1);
  const { data } = useSWR<PaginatedRequests, ApiError>(
    `/api/requests?page=${pageIndex}&q=${debouncedQuery}`
  );

  useEffect(() => {
    setPageIndex(1);
  }, [debouncedQuery]);

  const redirect = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/requests/create");
    }
  };

  return (
    <Layout title="Requests" maxW="56rem">
      <Heading size="2xl" mb="8">
        Requests
      </Heading>

      <Stack direction="row" justify="space-between" align="center" mb={4}>
        <InputGroup w={64} size="sm">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a request"
            borderRightRadius={0}
          />
          <InputRightElement>
            <IconButton
              aria-label="clear"
              icon={<CloseIcon />}
              onClick={() => setQuery("")}
              size="xs"
              variant="link"
            >
              clear
            </IconButton>
          </InputRightElement>
        </InputGroup>

        <Button onClick={redirect} rightIcon={<AddIcon />}>
          Add
        </Button>
      </Stack>

      {!data ? (
        <SimpleGrid columns={2} spacing="5">
          {[...Array(6)].map((_, i) => (
            <Skeleton h="12rem" borderRadius="lg" key={i} />
          ))}
        </SimpleGrid>
      ) : (
        <>
          {data.requests.length == 0 ? (
            <Stack justify="center" align="center" mt={20}>
              <Text color="whiteAlpha.800" fontSize="3xl">
                No Requests 😫
              </Text>
              <Text color="whiteAlpha.800" fontSize="xl">
                Why not make one? 🤔
              </Text>
            </Stack>
          ) : (
            <>
              <SimpleGrid columns={2} spacing="5" mb={8}>
                {data.requests.map((request) => (
                  <RequestCard request={request} key={request._id.toString()} />
                ))}
              </SimpleGrid>
              <PageNavigation
                currentPage={data.currentPage}
                totalPages={data.totalPages}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
              />
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default RequestList;
