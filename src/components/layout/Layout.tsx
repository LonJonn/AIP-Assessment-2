import { ComponentWithAs, Container, ContainerProps } from "@chakra-ui/core";
import Head from "next/head";

interface LayoutProps extends ContainerProps {
  title?: string;
}

const Layout: ComponentWithAs<"div", LayoutProps> = ({
  title,
  maxW = "lg",
  children,
  ...restProps
}) => (
  <>
    {title && (
      <Head>
        <title>Pinki | {title}</title>
      </Head>
    )}

    {/* @ts-ignore issue with chakra types */}
    <Container maxW={maxW} flexGrow={1} {...restProps}>
      {children}
    </Container>
  </>
);

export default Layout;
