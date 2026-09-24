import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography
} from '@mui/material';
import Layout from '../../components/layout/Layout';
import NewsGrid from '../../components/home/NewsGrid';
import { getAllArticles } from '../../lib/newsData';
import { getText } from '../../utils/i18n';

export default function NewsPage({ articles, darkMode, toggleDarkMode, locale, toggleLocale }) {
  const [filteredArticles, setFilteredArticles] = useState(articles); // To store filtered articles
  const text = getText(locale);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/news')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setFilteredArticles(data);
        }
      })
      .catch(() => {
        // Keep the ISR-cached articles if the refresh fetch fails.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} locale={locale} toggleLocale={toggleLocale}>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
          {text.news.latest}
        </Typography>

        {/* News grid */}
        <NewsGrid articles={filteredArticles} locale={locale} />
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  const sortedArticles = await getAllArticles();

  return {
    props: {
      articles: sortedArticles,
    },
    // On-demand revalidation handles instant updates; this is just a safety net.
    revalidate: 3600,
  };
}
