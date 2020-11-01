import { Container, ContainerProps, Flex } from "@chakra-ui/core";
import Head from "next/head";
import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  title?: string;
}

const Layout: React.FC<LayoutProps & ContainerProps> = ({
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

    <Flex h="100vh" flexDir="column">
      <Header />

      <Container as="main" maxW={maxW} flexGrow={1} {...restProps}>
        {children}
      </Container>

      <Footer />
    </Flex>
  </>
);

export default Layout;
