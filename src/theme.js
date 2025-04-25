import { extendTheme } from "@chakra-ui/react";

const colors = {
    brand: {
      10: '#F6F9FA',
      50: '#EBF1F3',
      100: '#DAE4E8',
      200: '#B0C7D0',
      300: '#92B1BC',
      400: '#73A0AF',
      500: '#548293', // Main color
      600: '#3E6576',
      700: '#194859',
      800: '#103543',
      900: '#072935',
    }
  };

const theme = extendTheme({
    colors,
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
          fontWeight: 'bold',
          lineHeight: 'short',
        },
        sizes: {
          '3xl': {
            fontSize: '3xl',
          },
          '2xl': {
            fontSize: '2xl',
          },
          xl: {
            fontSize: 'xl',
          },
          lg: {
            fontSize: 'lg',
          },
          md: {
            fontSize: 'md',
          },
          sm: {
            fontSize: 'sm',
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
