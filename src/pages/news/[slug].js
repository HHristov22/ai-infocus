import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Layout from '../../components/layout/Layout';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';

export async function getStaticPaths() {
  const dirPath = path.join(process.cwd(), 'news');
  const filenames = fs.readdirSync(dirPath);

  const paths = filenames.map((filename) => ({
    params: { slug: filename.replace('.md', '') },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'news', `${params.slug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  const cleanedContent = content.replace(/[\r\uFEFF\xA0]+/g, '').trim();

  const date = data.date ? new Date(data.date).toISOString() : null;

  const tags = data.tags || [];

  return {
    props: {
      title: data.title || 'Untitled',
      date: date,
      formattedDate: date
        ? new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23'
          }).replace(' at ', ' - ')
        : 'Unknown Date',
      content: cleanedContent,
      tags: tags.map((tag) => ({
        label: Object.keys(tag)[0],
        value: Object.values(tag)[0],
      })),
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
