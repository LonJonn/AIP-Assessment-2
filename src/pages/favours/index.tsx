import React, { useState } from "react";
import NextLink from "next/link";
import {
  Button,
  Heading,
  SimpleGrid,
  SimpleGridProps,
  Skeleton,
  Spacer,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/core";
import { AddIcon } from "@chakra-ui/icons";
import Card from "components/list/Card";
import { useAuth } from "hooks/useAuth";
import { ApiError } from "lib/errorHandler";
import { FavourSchema } from "models/Favour";
import useSWR from "swr";
import Layout from "components/layout/Layout";
import WithAuth from "components/WithAuth";
import PageNavigation from "components/list/PageNavigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserSchema } from "models/User";

dayjs.extend(relativeTime);

interface PaginatedFavours {
  favours: FavourSchema[];
  currentPage: number;
  totalPages: number;
}

/**
 * Favour List Content
 */

// const listVariants: Variants = {
//   hidden: {
//     opacity: 0,
//   },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// };

/**
 * Favour Card Title
 */

interface FavourCardTitleProps {
  debtor: UserSchema;
  recipient: UserSchema;
}

const FavourCardTitle: React.FC<FavourCardTitleProps> = ({ debtor, recipient }) => {
  const { user } = useAuth();
  const isDebtor = user?.uid === debtor._id;

  return (
    <Text fontSize="xl" fontWeight="bold">
      {isDebtor ? "You" : debtor.displayName}{" "}
      <Text as="span" fontWeight="normal">
        promised
      </Text>{" "}
      {!isDebtor ? "You" : recipient.displayName}
    </Text>
  );
};

/**
 * Favour List
 */

interface ListContentProps extends SimpleGridProps {
  data: PaginatedFavours;
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
}

const ListContent: React.FC<ListContentProps> = ({
  data,
  pageIndex,
  setPageIndex,
  ...restProps
}) => {
  const { favours, ...pageData } = data;

  return (
    <Stack spacing={8}>
      <SimpleGrid columns={2} spacing={8} {...restProps}>
        {favours.map((favour) => (
          <Card href={`/favours/${favour._id}`} h={40} key={favour._id.toString()}>
            {/* Title */}
            <FavourCardTitle debtor={favour.debtor} recipient={favour.recipient} />

            {/* Rewards */}
            <Text mt={1} fontSize="2xl">
              {Object.keys(favour.rewards).map((reward) => (
                <span key={reward}>{reward}</span>
              ))}
            </Text>

            <Spacer />

            {/* Date */}
            <Text>{dayjs(favour.createdAt).from(new Date())}</Text>
          </Card>
        ))}
      </SimpleGrid>

      <PageNavigation {...pageData} pageIndex={pageIndex} setPageIndex={setPageIndex} />
    </Stack>
  );
};

/**
 * Favours Page
 */

type FilterQuery = "owing" | "owed";

const FavourList: React.FC = () => {
  const { accessToken } = useAuth();

  const [filterQuery, setFilterQuery] = useState<FilterQuery>("owed");
  const [pageIndex, setPageIndex] = useState(1);
  const { data } = useSWR<PaginatedFavours, ApiError>(
    accessToken ? [`/api/favours?page=${pageIndex}&q=${filterQuery}&limit=2`, accessToken] : null
  );

  return (
    <Layout title="Favours" maxW="56rem">
      {/* Heading */}
      <Stack direction="row" justify="space-between" align="center" mb={6}>
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
        mb={6}
      >
        <TabList>
          <Tab>Owed</Tab>
          <Tab>Owing</Tab>
        </TabList>
      </Tabs>

      {/* Favours */}
      {!data ? (
        <SimpleGrid columns={2} spacing={8}>
          {[...Array(4)].map((_, i) => (
            <Skeleton h={40} borderRadius="lg" key={i} />
          ))}
        </SimpleGrid>
      ) : data.favours.length === 0 ? (
        <Heading size="2xl" textAlign="center" my="4rem !important">
          You're all square 😝
        </Heading>
      ) : (
        <ListContent data={data} pageIndex={pageIndex} setPageIndex={setPageIndex} />
      )}
    </Layout>
  );
};

export default WithAuth(FavourList);
