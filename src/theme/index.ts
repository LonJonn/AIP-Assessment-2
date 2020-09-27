import { extendTheme } from "@chakra-ui/core";
import styles from "./styles";
import foundation from "./foundation";

import Button from "./components/Button";
import Input from "./components/Input";
import Heading from "./components/Heading";

// Refer to: https://github.com/chakra-ui/chakra-ui/tree/master/packages/theme/src
export default extendTheme({
  styles,
  ...foundation,
  components: {
    Button,
    Input,
    Heading,
  },
});
