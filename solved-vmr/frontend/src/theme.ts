import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  components: {
    Table: {
      variants: {
        simple: {
          th: {
            borderColor: 'gray.200',
            _dark: {
              borderColor: 'gray.600',
            },
          },
          td: {
            borderColor: 'gray.200',
            _dark: {
              borderColor: 'gray.600',
            },
          },
        },
      },
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
});

export default theme; 