import { Avatar, Box, Button, Collapse, Flex, Stack, Text } from "@chakra-ui/core";
import { useAuth } from "lib/auth";
import { UserSchema } from "models/User";

/**
 * User Preview Card
 */

interface UserPreviewProps {
  user: UserSchema;
  onClick: () => void;
}

const UserPreview: React.FC<UserPreviewProps> = ({ user, onClick }) => (
  <Flex
    onClick={onClick}
    bg="whiteAlpha.100"
    flexDir="row"
    align="center"
    p={5}
    borderRadius="lg"
    _hover={{ cursor: "pointer", bg: "whiteAlpha.200" }}
  >
    <Avatar src={user.photoURL} name={user.displayName} mr={4} />
    <Box>
      <Text fontSize="xl">{user.displayName}</Text>
      <Text color="gray.400">{user.email}</Text>
    </Box>
  </Flex>
);

/**
 * Select User
 */

interface SelectUserProps {
  showUsers: boolean;
  users: UserSchema[];
  selectUser: (user: UserSchema) => void;
  setShowUsers: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectUser: React.FC<SelectUserProps> = ({ showUsers, users, selectUser, setShowUsers }) => {
  const { user } = useAuth();

  return (
    <Collapse
      isOpen={showUsers}
      mb={8}
      p={3}
      borderRadius="lg"
      border="solid 1px"
      borderColor="primary.50"
    >
      <Stack spacing={4} mb={4}>
        {!users || users?.length === 0 ? (
          <Text textAlign="center" fontSize="xl" my={4}>
            No users found 😢
          </Text>
        ) : (
          users
            .filter((u) => u._id !== user?.uid)
            .map((user) => (
              <UserPreview user={user} onClick={() => selectUser(user)} key={user._id} />
            ))
        )}
      </Stack>

      <Button variant="outline" color="inherit" onClick={() => setShowUsers(false)}>
        Hide
      </Button>
    </Collapse>
  );
};

export default SelectUser;
