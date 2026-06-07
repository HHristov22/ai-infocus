import React, { useState } from 'react';
import { 
  Container, 
  Typography
} from '@mui/material';
import Layout from '../../components/layout/Layout';
import NewsGrid from '../../components/home/NewsGrid';
import { getAllArticles } from '../../lib/newsData';

export default function NewsPage({ articles, darkMode, toggleDarkMode }) {
  const [filteredArticles] = useState(articles); // To store filtered articles

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
          Latest AI News
        </Typography>

        {/* News grid */}
        <NewsGrid articles={filteredArticles} />
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
  };
}
