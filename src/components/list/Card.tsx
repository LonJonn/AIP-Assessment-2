import React, { useCallback } from "react";
import NextLink from "next/link";
import { ComponentWithAs, Flex, FlexProps, useColorModeValue } from "@chakra-ui/core";

// const cardVariants: Variants = {
//   hidden: {
//     opacity: 0,
//   },
//   visible: {
//     opacity: 1,
//   },
// };

interface CardProps extends FlexProps {
  href?: string;
}

const Card: ComponentWithAs<"div", CardProps> = ({ href, children, ...restProps }) => {
  const cardAnimationStyles: FlexProps = {
    css: { transition: "0.15s ease" },
    transitionProperty: "transform, background, box-shadow",
    _hover: {
      cursor: "pointer",
      transform: "scale(1.025)",
      boxShadow: useColorModeValue("xl", "none"),
    },
    _active: {
      bg: useColorModeValue("primary.100", "whiteAlpha.300"),
      transform: "scale(0.95)",
      boxShadow: useColorModeValue("md", "none"),
    },
  };

  // Only mount a NextLink if Card has href
  const Wrapper = useCallback(
    ({ children }) => {
      return href ? <NextLink href={href}>{children}</NextLink> : <>{children}</>;
    },
    [href]
  );

  return (
    <Wrapper>
      <Flex
        pos="relative"
        p={5}
        minW={0}
        bg={useColorModeValue("primary.50", "whiteAlpha.200")}
        boxShadow={useColorModeValue("lg", "none")}
        borderRadius="lg"
        flexDir={restProps.flexDir || "column"}
        {...cardAnimationStyles}
        {...restProps}
      >
        {children}
      </Flex>
    </Wrapper>
  );
};

export default Card;
