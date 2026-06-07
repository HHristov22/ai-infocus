import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Layout from '../../components/layout/Layout';
import ReactMarkdown from 'react-markdown';
import { getArticleBySlug, getArticleSlugs } from '../../lib/newsData';
import { formatDisplayDate, getText } from '../../utils/i18n';

export async function getStaticPaths() {
  const slugs = await getArticleSlugs();

  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  return {
    props: {
      slug: article.slug,
      title: article.title,
      titleBg: article.titleBg,
      date: article.date,
      content: article.content,
      contentBg: article.contentBg,
      tags: article.tags,
      initialViews: article.views || 0,
    },
    revalidate: 60,
  };
}

export default function NewsPage({
  slug,
  title,
  titleBg,
  date,
  content,
  contentBg,
  tags,
  initialViews,
  darkMode,
  toggleDarkMode,
  locale,
  toggleLocale,
}) {
  const text = getText(locale);
  const [views, setViews] = useState(Number(initialViews) || 0);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!slug || hasTrackedView.current) {
      return;
    }

    hasTrackedView.current = true;

    const trackView = async () => {
      try {
        const response = await fetch(`/api/views/${encodeURIComponent(slug)}`, {
          method: 'POST',
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        if (typeof payload.views === 'number') {
          setViews(payload.views);
        }
      } catch (error) {
        // Ignore tracking errors to avoid breaking article rendering.
      }
    };

    trackView();
  }, [slug]);


  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} locale={locale} toggleLocale={toggleLocale}>
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom style={{ textAlign: 'justify', fontWeight: 'bold' }}>
          {locale === 'bg' && titleBg ? titleBg : title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {formatDisplayDate(date, locale)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 2, color: 'text.secondary' }}>
          <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
          <Typography variant="body2">{views} {text.news.views}</Typography>
        </Box>
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
          <ReactMarkdown>{locale === 'bg' && contentBg ? contentBg : content}</ReactMarkdown>
        </div>
      </Container>
    </Layout>
  );
}
