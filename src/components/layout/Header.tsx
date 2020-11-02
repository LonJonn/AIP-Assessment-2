import React from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import {
  Container,
  Flex,
  Heading,
  LinkProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  MenuDivider,
  Link,
  Stack,
  Avatar,
  Text,
  useColorMode,
  IconButton,
} from "@chakra-ui/core";
import { ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useAuth } from "hooks/useAuth";

/**
 * Navbar Item
 */
type NavItemProps = NextLinkProps & LinkProps;

const NavItem: React.FC<NavItemProps> = ({ children, href, ...restProps }) => (
  <NextLink href={href} passHref>
    <Link
      color="inherit"
      _hover={{
        color: useColorModeValue("primary.500", "primary.200"),
      }}
      {...restProps}
    >
      {children}
    </Link>
  </NextLink>
);

/**
 * Navbar Drop Down Menu
 */
interface NavDropDownProps {
  user: firebase.User;
  signOut: () => Promise<void>;
}

const NavDropDown: React.FC<NavDropDownProps> = ({ user, signOut }) => (
  <Menu>
    {/* Dropdown Button */}
    <MenuButton>
      <Stack direction="row" align="center">
        <Avatar boxSize={10} name={user.displayName} src={user.photoURL} />
        <ChevronDownIcon />
      </Stack>
    </MenuButton>

    {/* Dropdown Content */}
    <MenuList>
      <MenuItem _hover={{ bg: "inherit", cursor: "default" }} _focus={{ bg: "inherit" }}>
        Welcome,{" "}
        <Text fontWeight="semibold" ml={1}>
          {user.displayName}
        </Text>
      </MenuItem>
      <MenuDivider />
      <MenuItem onClick={signOut}>Log Out</MenuItem>
    </MenuList>
  </Menu>
);
/**
 * Header
 */
const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toggleColorMode } = useColorMode();

  return (
    <Container as="header" maxW="lg" mb={6}>
      <Flex as="nav" justify="space-between" align="center" h={20}>
        {/* Navbar Left */}
        <Stack direction="row" spacing={8}>
          <NavItem href="/">
            <Heading size="md">Pinki</Heading>
          </NavItem>
          <NavItem href="/requests">Requests</NavItem>
          <NavItem href="/favours">Favours</NavItem>
          <NavItem href="/leaderboard">Leaderboard</NavItem>
        </Stack>

        {/* Navbar Right */}
        <Flex alignItems="center">
          <IconButton
            // size="sm"
            aria-label="Toggle Colormode"
            icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
            onClick={toggleColorMode}
            mr={8}
          />

          {user ? (
            <NavDropDown user={user} signOut={signOut} />
          ) : (
            <NavItem href="/login">Log In</NavItem>
          )}
        </Flex>
      </Flex>
    </Container>
  );
};

export default Header;
