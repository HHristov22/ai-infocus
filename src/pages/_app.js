import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedTheme);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem('darkMode', !prev);
      return !prev;
    });
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <style>
          {`
            @font-face {
              font-family: 'Righteous';
              src: url('/assets/fonts/Righteous.ttf') format('truetype');
            }
          `}
        </style>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AI-INFOCUS</title>
      </Head>
      <Component {...pageProps} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  );
}
