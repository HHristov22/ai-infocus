import React, { useState } from 'react';
import { 
  Container, 
  Typography
} from '@mui/material';
import Layout from '../../components/layout/Layout';
import NewsGrid from '../../components/home/NewsGrid';
import { getAllArticles } from '../../lib/newsData';
import { getText } from '../../utils/i18n';

export default function NewsPage({ articles, darkMode, toggleDarkMode, locale, toggleLocale }) {
  const [filteredArticles] = useState(articles); // To store filtered articles
  const text = getText(locale);

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
    revalidate: 60,
  };
}
