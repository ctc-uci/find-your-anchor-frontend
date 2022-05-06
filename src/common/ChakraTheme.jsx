import { extendTheme } from '@chakra-ui/react';

const ChakraTheme = extendTheme({
  textStyles: {
    'header-1': {
      fontFamily: 'Inter, sans-serif',
      fontSize: '36px',
      fontWeight: 700,
    },
    'header-2': {
      fontFamily: 'Inter, sans-serif',
      fontSize: '28px',
      fontWeight: 400,
    },
    subheader: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '20px',
      fontWeight: 400,
    },
    body: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      fontWeight: 400,
    },
    descriptions: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      fontWeight: 400,
    },
  },
});

export default ChakraTheme;
