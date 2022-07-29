import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import { AppProps } from 'next/app';
import { Provider, createClient } from 'urql';

const client = createClient({
  url: 'https://studio.apollographql.com',
  fetchOptions: {
    credentials: 'include'
  }
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
