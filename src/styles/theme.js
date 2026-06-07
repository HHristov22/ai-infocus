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
      fontFamily: 'Righteous, sans-serif',
    },
    h2: {
      fontFamily: 'Righteous, sans-serif',
    },
    h3: {
      fontFamily: 'Righteous, sans-serif',
    },
    h4: {
      fontFamily: 'Righteous, sans-serif',
    },
    h5: {
      fontFamily: 'Righteous, sans-serif',
    },
    h6: {
      fontFamily: 'Righteous, sans-serif',
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