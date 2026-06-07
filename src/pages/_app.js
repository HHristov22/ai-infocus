import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);
  const [locale, setLocale] = useState('bg');

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedTheme);

    const savedLocale = localStorage.getItem('locale');
    if (savedLocale === 'bg' || savedLocale === 'en') {
      setLocale(savedLocale);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem('darkMode', !prev);
      return !prev;
    });
  };

  const toggleLocale = () => {
    setLocale((prev) => {
      const next = prev === 'bg' ? 'en' : 'bg';
      localStorage.setItem('locale', next);
      return next;
    });
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    typography: {
      fontFamily: 'Bitter, serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <style>
          {`
            @font-face {
              font-family: 'Bitter';
              src: url('/assets/fonts/Bitter-VariableFont_wght.ttf') format('truetype');
              font-weight: 100 900;
              font-style: normal;
            }
          `}
        </style>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AI-INFOCUS</title>
      </Head>
      <Component
        {...pageProps}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        locale={locale}
        toggleLocale={toggleLocale}
      />
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  );
}
