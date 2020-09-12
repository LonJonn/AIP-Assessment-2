import React from "react";
import { ThemeProvider, ColorModeProvider, CSSReset } from "@chakra-ui/core";
import type { AppProps } from "next/app";

import theme from "../theme";

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <ThemeProvider theme={theme}>
    <ColorModeProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ColorModeProvider>
  </ThemeProvider>
);

export default App;
