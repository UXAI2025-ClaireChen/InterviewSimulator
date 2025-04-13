import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    fonts: {
      heading: `'Montserrat', sans-serif`,
      body: `'Montserrat', sans-serif`,
    },
    fontWeights: {
      hairline: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    fontSizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      md: '1rem',        // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },
    styles: {
      global: {
        body: {
          bg: 'white',
          color: 'gray.800',
          fontSize: 'md',
          lineHeight: '1.75',
        },
      },
    },
    components: {
      Heading: {
        baseStyle: {
          fontWeight: 'bold', // 700
          lineHeight: 'short',
        },
        sizes: {
          xl: {
            fontSize: '4xl',
          },
          lg: {
            fontSize: '3xl',
          },
          md: {
            fontSize: '2xl',
          },
          sm: {
            fontSize: 'xl',
          },
        },
      },
      Text: {
        baseStyle: {
          fontWeight: 'normal', // 400
          lineHeight: 'base',
        },
      },
      Button: {
        baseStyle: {
          fontWeight: 'semibold', // 600
          letterSpacing: 'wide',
        },
        sizes: {
          md: {
            fontSize: 'sm', // can change to 'md' if preferred
          },
        },
      },
    },
  });

export default theme;
