import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import {theme} from "../chakra/theme";
import Layout from "../components/Layout.tsx/Layout";



function MyApp({ Component, pageProps }: AppProps) {
  return (
      <ChakraProvider theme={theme} >
        <Layout>
          <Component {...pageProps} />
          </Layout>
      </ChakraProvider>

  );
}

export default MyApp;

 