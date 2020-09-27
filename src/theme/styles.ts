import { mode, Styles } from "@chakra-ui/theme-tools";

const styles: Styles = {
  global: (props) => ({
    body: {
      bg: mode("white", "gray.800")(props),
      color: mode("primary.900", "primary.50")(props),
      fontFamily: "body",
      lineHeight: "base",
      transition: "background 0.2s ease",
    },
  }),
};

export default styles;
