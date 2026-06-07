import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
// import Header from '../components/layout/Header';
import Hero from '../components/home/Hero';
import NewsGrid from '../components/home/NewsGrid';
import Layout from '../components/layout/Layout';

export default function Home({ darkMode, toggleDarkMode }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch articles');
        }
        
        const data = await response.json();
        
        const formattedData = data.map((article) => ({
          ...article,
          formattedDate: article.date
            ? new Date(article.date).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hourCycle: 'h23'
            }).replace(' at ', ' - ')
            : 'Unknown Date',
        }));
        
        setArticles(formattedData);
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
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Hero />
      <Container maxWidth="lg" sx={{ my: 8 }}>
      <Typography variant="h4" align="center" sx={{ my: 4 }}>
          {/* The Latest Highlights from the AI World */}
          Discover What’s Next in AI Today
        </Typography>
        {loading ? (
          <Typography variant="h6" align="center">
            Loading articles...
          </Typography>
        ) : error ? (
          <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
            {error}
          </Typography>
        ) : (
          <NewsGrid articles={articles} />
        )}
      </Container>
    </Layout>
  );
}