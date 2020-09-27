import { ColorModeScript } from "@chakra-ui/core";
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import React from "react";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          {/* 👇 Color mode script for SSR */}
          {/* See https://next.chakra-ui.com/docs/features/color-mode#with-nextjs */}
          <ColorModeScript defaultColorMode="light" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
