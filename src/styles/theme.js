import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#106EBE',
    },
    secondary: {
      main: '#0091EA',
    },
  },
  typography: {
    h1: {
      fontFamily: 'Bitter, serif',
    },
    h2: {
      fontFamily: 'Bitter, serif',
    },
    h3: {
      fontFamily: 'Bitter, serif',
    },
    h4: {
      fontFamily: 'Bitter, serif',
    },
    h5: {
      fontFamily: 'Bitter, serif',
    },
    h6: {
      fontFamily: 'Bitter, serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;