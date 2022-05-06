import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import ErrorPage from '../../components/ErrorPage/ErrorPage';

const InternalServerErrorPage = () => {
  return (
    <ChakraProvider>
      <ErrorPage
        errorNumber={500}
        title="Internal Server Error"
        message="Sorry, there were some technical issues while processing your request."
      />
    </ChakraProvider>
  );
};

export default InternalServerErrorPage;
