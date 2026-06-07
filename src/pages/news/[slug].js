import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Layout from '../../components/layout/Layout';
import ReactMarkdown from 'react-markdown';
import { getArticleBySlug, getArticleSlugs } from '../../lib/newsData';

export async function getStaticPaths() {
  const slugs = await getArticleSlugs();

  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      title: article.title,
      date: article.date,
      formattedDate: article.formattedDate,
      content: article.content,
      tags: article.tags,
    },
  };
}

export default function NewsPage({
  title,
  formattedDate,
  content,
  tags,
  darkMode,
  toggleDarkMode,
}) {


  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom style={{ textAlign: 'justify', fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {formattedDate}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {tags.map((tag, index) => (
            <Box
            key={index}
            sx={{
              position: 'relative',
              borderRadius: '25px', // Заоблени ъгли
              padding: '3px 12px',
              color: `rgba(${darkMode ? '0, 0, 0' : '255, 255, 255'}, ${Math.max(((tag.value - 20) / 30), 0) + 0.75})`,
              fontWeight: 'bold',
              backgroundColor: `rgba(28, 123, 196, ${Math.max(((tag.value - 40) / 60), 0) + 0.15})`,
              // boxShadow: `0px 0px 6px rgba(${darkMode ? '255, 255, 255' : '0, 0, 0'}, ${Math.max(((tag.value - 30) / 65), 0) + 0.15})`,
            }}
          >
            {tag.label}
          </Box>
          ))}
        </Box>
        <div style={{ textAlign: 'justify' }}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </Container>
    </Layout>
  );
}
