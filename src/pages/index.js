import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
// import Header from '../components/layout/Header';
import Hero from '../components/home/Hero';
import NewsGrid from '../components/home/NewsGrid';
import Layout from '../components/layout/Layout';
import { getText } from '../utils/i18n';

export default function Home({ darkMode, toggleDarkMode, locale, toggleLocale }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const text = getText(locale);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch articles');
        }
        
        const data = await response.json();
        
        setArticles(data);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} locale={locale} toggleLocale={toggleLocale}>
      <Hero locale={locale} />
      <Container maxWidth="lg" sx={{ my: 8 }}>
      <Typography variant="h4" align="center" sx={{ my: 4 }}>
          {text.home.heading}
        </Typography>
        {loading ? (
          <Typography variant="h6" align="center">
            {text.home.loading}
          </Typography>
        ) : error ? (
          <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
            {`${text.home.errorPrefix}: ${error}`}
          </Typography>
        ) : (
          <NewsGrid articles={articles} locale={locale} />
        )}
      </Container>
    </Layout>
  );
}