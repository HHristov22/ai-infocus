import React, { useState } from 'react';
import { 
  Container, 
  Typography
} from '@mui/material';
import Layout from '../../components/layout/Layout';
import NewsGrid from '../../components/home/NewsGrid';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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
  const newsDirectory = path.join(process.cwd(), 'news');
  const filenames = fs.readdirSync(newsDirectory);

  const articles = filenames.map((filename) => {
    const filePath = path.join(newsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const date = data.date ? new Date(data.date).toISOString() : null;

    return {
      slug: filename.replace('.md', ''),
      ...data,
      date,
      content,
      formattedDate: date
        ? new Date(date)
            .toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hourCycle: 'h23',
            })
            .replace(' at ', ' - ')
        : 'Unknown Date',
    };
  });

  const sortedArticles = articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    props: {
      articles: sortedArticles,
    },
  };
}
