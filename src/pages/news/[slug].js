import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import Layout from '../../components/layout/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { getArticleBySlug, getArticleSlugs } from '../../lib/newsData';
import { formatDisplayDate, getText } from '../../utils/i18n';

function MarkdownCodeBlock({ language, code, codeProps }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      // Ignore clipboard errors to avoid breaking rendering.
    }
  };

  return (
    <Box sx={{ my: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.6 }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontWeight: 700,
            letterSpacing: 0.3,
            color: 'text.secondary',
          }}
        >
          Code Block
        </Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={handleCopy}
          startIcon={copied ? <CheckCircleOutlineOutlinedIcon fontSize="small" /> : <ContentCopyOutlinedIcon fontSize="small" />}
          sx={{
            minWidth: 92,
            textTransform: 'none',
            borderColor: 'rgba(16, 110, 190, 0.35)',
            color: '#106EBE',
            '&:hover': {
              borderColor: '#106EBE',
              backgroundColor: 'rgba(16, 110, 190, 0.08)',
            },
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </Box>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        PreTag="div"
        customStyle={{
          borderRadius: '10px',
          margin: 0,
          padding: '14px 16px',
        }}
        {...codeProps}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
}

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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ ...props }) => (
                <Box sx={{ overflowX: 'auto', my: 2 }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      minWidth: '560px',
                    }}
                    {...props}
                  />
                </Box>
              ),
              th: ({ ...props }) => (
                <th
                  style={{
                    border: '1px solid rgba(130, 130, 130, 0.35)',
                    padding: '10px 12px',
                    textAlign: 'left',
                    background: 'rgba(16, 110, 190, 0.12)',
                  }}
                  {...props}
                />
              ),
              td: ({ ...props }) => (
                <td
                  style={{
                    border: '1px solid rgba(130, 130, 130, 0.25)',
                    padding: '9px 12px',
                    verticalAlign: 'top',
                  }}
                  {...props}
                />
              ),
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                if (!inline) {
                  return (
                    <MarkdownCodeBlock
                      language={match ? match[1] : 'text'}
                      code={String(children).replace(/\n$/, '')}
                      codeProps={props}
                    />
                  );
                }

                return (
                  <code
                    className={className}
                    style={{
                      background: 'rgba(16, 110, 190, 0.10)',
                      padding: '0.12rem 0.35rem',
                      borderRadius: '4px',
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {locale === 'bg' && contentBg ? contentBg : content}
          </ReactMarkdown>
        </div>
      </Container>
    </Layout>
  );
}
