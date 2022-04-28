import { extendTheme } from '@chakra-ui/react';

const ChakraTheme = extendTheme({
  textStyles: {
    'header-1': {
      fontFamily: 'Inter, sans-serif',
      fontSize: '48px',
      fontWeight: 700,
    },
    'header-2': {
      fontFamily: 'Inter, sans-serif',
      fontSize: '36px',
      fontWeight: 400,
    },
    subheader: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '18px',
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
