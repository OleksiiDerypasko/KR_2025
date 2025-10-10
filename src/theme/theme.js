import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
};

const fonts = {
  heading: `'Inter', sans-serif`,
  body: `'Manrope', sans-serif`,
};

const theme = extendTheme({ config, colors, fonts });

export default theme;