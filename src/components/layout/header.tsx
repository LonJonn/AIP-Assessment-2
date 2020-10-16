import React, { useState } from "react";
import NextLink, { LinkProps } from "next/link";
import {
  Button,
  Container,
  Flex,
  Heading,
  ButtonProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  MenuDivider,
  IconButton,
  Box,
  Divider,
} from "@chakra-ui/core";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useAuth } from "lib/auth";

/**
 * Navbar Item
 */
type NavItemProps = LinkProps & ButtonProps;

const NavItem: React.FC<NavItemProps> = ({ children, href, ...restProps }) => (
  <NextLink href={href}>
    <Button
      variant="unstyled"
      mr={10}
      fontSize={15}
      color={useColorModeValue("primary.900", "primary.50")}
      _hover={{
        color: useColorModeValue("primary.500", "primary.200"),
      }}
      {...restProps}
    >
      {children}
    </Button>
  </NextLink>
);

/**
 * Navbar Drop Down Menu
 */
const NavDropDown: React.FC = () => {
  const { user, signOut } = useAuth();

  if (!user) return <NavItem href="/login">Sign In</NavItem>;

  return (
    <Menu placement="bottom">
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon boxSize={6} />}
        variant="ghost"
        color={useColorModeValue("primary.900", "primary.50")}
      >
        {user.displayName?.split(" ")[0] || user.displayName}
      </MenuButton>
      <MenuList>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuDivider />
        <MenuItem onClick={signOut}>Sign Out</MenuItem>
      </MenuList>
    </Menu>
  );
};

const MenuIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-menu"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

/**
 * Header
 */
const Header: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <Box as="header">
      <Container maxW="lg">
        <Flex
          as="nav"
          wrap="wrap"
          justify="space-between"
          align="center"
          py={4}
        >
          <NavItem href="/">
            <Heading size="md">Pinki</Heading>
          </NavItem>

          <IconButton
            onClick={() => setShow(!show)}
            display={{ base: "inherit", md: "none" }}
            variant="ghost"
            aria-label="Menu Icon"
            rounded="full"
            color="primary.50"
            icon={MenuIcon}
          />

          {/* Content */}

          <Flex
            display={{ base: show ? "flex" : "none", md: "flex" }}
            w={{ base: "full", md: "auto" }}
            flexGrow={{ base: "unset", md: 1 }}
            flexDir={{ base: "column", md: "row" }}
            alignItems="start"
            mt={{ base: 4, md: 0 }}
          >
            <NavItem href="/requests">Requests</NavItem>
            <NavItem href="/favours">Favours</NavItem>
            <NavItem href="/leaderboard">Leaderboard</NavItem>
          </Flex>

          <Box
            display={{ base: show ? "block" : "none", md: "block" }}
            w={{ base: "full", md: "auto" }}
          >
            <NavDropDown />
          </Box>
        </Flex>
      </Container>

      <Divider display={{ base: show ? "block" : "none", md: "none" }} mb={4} />
    </Box>
  );
};

export default Header;
