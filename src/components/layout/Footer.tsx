import { Center, Text, useColorModeValue } from "@chakra-ui/core";

const Footer: React.FC = () => (
  <Center
    as="footer"
    mt={16}
    py={8}
    bg={useColorModeValue("gray.100", "gray.900")}
    borderTop="1px solid"
    borderColor={useColorModeValue("gray.300", "gray.700")}
    transition="0.2s ease"
    transitionProperty="background, border"
  >
    <Text>
      Made with{" "}
      <Text as="span" color="red.500">
        ❤
      </Text>{" "}
      by Justin, Kevin, Leon & Oliver
    </Text>
  </Center>
);

export default Footer;
