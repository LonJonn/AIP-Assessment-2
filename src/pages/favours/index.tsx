import React, { useState } from "react";
import NextLink from "next/link";
import {
  Button,
  Heading,
  IconButton,
  SimpleGrid,
  Skeleton,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  useToast,
} from "@chakra-ui/core";
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import FavourCard from "components/favour/Card";
import { useAuth } from "hooks/useAuth";
import { ApiError } from "lib/errorHandler";
import { FavourSchema } from "models/Favour";
import useSWR from "swr";
import { useRouter } from "next/router";
import Layout from "components/layout/Layout";

interface PaginatedFavours {
  favours: FavourSchema[];
  currentPage: number;
  totalPages: number;
}

/**
 * Favour List Content
 */

interface ListContentProps {
  data: PaginatedFavours;
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
}

const ListContent: React.FC<ListContentProps> = ({ data, pageIndex, setPageIndex }) => {
  const { favours, currentPage, totalPages } = data;

  const prevDisabled = pageIndex === 1;
  const nextDisabled = pageIndex === totalPages;

  if (favours.length === 0)
    return (
      <Heading size="2xl" textAlign="center" my="4rem !important">
        You're all square 😝
      </Heading>
    );

  return (
    <Stack spacing={8}>
      {/* Favour List */}
      <SimpleGrid columns={2} spacing={8}>
        {favours.map((favour) => (
          <FavourCard favour={favour} key={favour._id.toString()} />
        ))}
      </SimpleGrid>

      {/* Navigation */}
      {favours.length !== 0 && (
        <Stack alignSelf="center" direction="row" align="center" spacing={16}>
          <IconButton
            disabled={prevDisabled}
            onClick={() => {
              if (currentPage > 1) setPageIndex(pageIndex - 1);
            }}
            aria-label="Previous"
            icon={<ArrowLeftIcon />}
          />

          <Text bg="whiteAlpha.200" px={4} py={2} borderRadius="full" fontWeight="bold">
            {currentPage}{" "}
            <Text as="span" fontWeight="normal">
              of
            </Text>{" "}
            {totalPages}
          </Text>
          <IconButton
            disabled={nextDisabled}
            onClick={() => {
              if (currentPage < totalPages) setPageIndex(pageIndex + 1);
            }}
            aria-label="Next"
            icon={<ArrowRightIcon />}
          />
        </Stack>
      )}
    </Stack>
  );
};

/**
 * Favour List Page
 */

type FilterQuery = "owing" | "owed";

const FavourList: React.FC = () => {
  const toast = useToast();
  const router = useRouter();
  const { accessToken } = useAuth();
  if (!accessToken && process.browser) {
    toast({ status: "warning", title: "You must be logged in!" });
    router.push("/login");
  }

  const [filterQuery, setFilterQuery] = useState<FilterQuery>("owed");
  const [pageIndex, setPageIndex] = useState(1);
  const { data } = useSWR<PaginatedFavours, ApiError>(
    accessToken ? [`/api/favours?page=${pageIndex}&q=${filterQuery}`, accessToken] : null
  );

  return (
    <Layout title="Favours">
      <Stack spacing={4} w="full">
        <Stack direction="row" justify="space-between" align="center" mb={4}>
          <Heading size="2xl">Favours</Heading>

          <NextLink href={`favours/create?type=${filterQuery}`}>
            <Button rightIcon={<AddIcon mb="2px" />}>Add</Button>
          </NextLink>
        </Stack>

        {/* Tabs */}
        <Tabs
          onChange={(i) => setFilterQuery(i === 0 ? "owed" : "owing")}
          colorScheme="primary"
          isFitted
        >
          <TabList>
            <Tab>Owed</Tab>
            <Tab>Owing</Tab>
          </TabList>
        </Tabs>

        {/* Favours */}
        {!data ? (
          <SimpleGrid columns={2} spacing={8}>
            {[...Array(6)].map((_, i) => (
              <Skeleton h={40} key={i} />
            ))}
          </SimpleGrid>
        ) : (
          <ListContent data={data} pageIndex={pageIndex} setPageIndex={setPageIndex} />
        )}
      </Stack>
    </Layout>
  );
};

export default FavourList;
