import { IconButton, Stack, StackProps, Text } from "@chakra-ui/core";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

interface PageNavigationProps extends StackProps {
  currentPage: number;
  totalPages: number;
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
}

const PageNavigation: React.FC<PageNavigationProps> = ({
  currentPage,
  totalPages,
  pageIndex,
  setPageIndex,
  ...restProps
}) => {
  const prevDisabled = pageIndex === 1;
  const nextDisabled = pageIndex === totalPages;

  return (
    <Stack direction="row" spacing={16} justify="center" {...restProps}>
      {/* Previous Button */}
      <IconButton
        disabled={prevDisabled}
        onClick={() => {
          if (currentPage > 1) setPageIndex(pageIndex - 1);
        }}
        aria-label="Previous"
        icon={<ArrowLeftIcon />}
      />

      {/* Page of */}
      <Text bg="whiteAlpha.200" px={4} py={2} borderRadius="full" fontWeight="bold">
        {currentPage}{" "}
        <Text as="span" fontWeight="normal">
          of
        </Text>{" "}
        {totalPages}
      </Text>

      {/* Next Button */}
      <IconButton
        disabled={nextDisabled}
        onClick={() => {
          if (currentPage < totalPages) setPageIndex(pageIndex + 1);
        }}
        aria-label="Next"
        icon={<ArrowRightIcon />}
      />
    </Stack>
  );
};

export default PageNavigation;
