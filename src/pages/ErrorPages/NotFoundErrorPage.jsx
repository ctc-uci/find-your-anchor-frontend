import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import ErrorPage from '../../components/ErrorPage/ErrorPage';

const NotFoundErrorPage = () => {
  return (
    <ChakraProvider>
      <ErrorPage
        errorNumber={404}
        title="Page not found."
        message="The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
      />
    </ChakraProvider>
  );
};

export default NotFoundErrorPage;
