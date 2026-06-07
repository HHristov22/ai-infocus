import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function formatDate(dateValue) {
  if (!dateValue) {
    return 'Unknown Date';
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown Date';
  }

  return date
    .toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
    .replace(' at ', ' - ');
}

function normalizeTags(tags) {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags
      .map((tag) => {
        if (tag && typeof tag === 'object') {
          const label = Object.keys(tag)[0];
          const value = Object.values(tag)[0];
          return label ? { label, value } : null;
        }
        return null;
      })
      .filter(Boolean);
  }

  if (typeof tags === 'object') {
    return Object.entries(tags).map(([label, value]) => ({ label, value }));
  }

  return [];
}

async function queryDatabase(queryText, values = []) {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  let Client;
  try {
    const pgModuleName = 'pg';
    ({ Client } = await import(pgModuleName));
  } catch (error) {
    console.error('Postgres driver is not installed. Falling back to markdown files.', error);
    return null;
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    const result = await client.query(queryText, values);
    return result.rows;
  } finally {
    await client.end();
  }
}

function getNewsDirectory() {
  return path.join(process.cwd(), 'news');
}

function readMarkdownArticles() {
  const newsDirectory = getNewsDirectory();
  if (!fs.existsSync(newsDirectory)) {
    return [];
  }

  const filenames = fs
    .readdirSync(newsDirectory)
    .filter((filename) => filename.endsWith('.md'));

  return filenames.map((filename) => {
    const filePath = path.join(newsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const date = data.date ? new Date(data.date).toISOString() : null;

    return {
      slug: filename.replace('.md', ''),
      title: data.title || 'Untitled',
      source: data.source || null,
      link: data.link || null,
      date,
      formattedDate: formatDate(date),
      content,
      tags: normalizeTags(data.tags || []),
    };
  });
}

function normalizeDbArticle(row) {
  const date = row.published_at ? new Date(row.published_at).toISOString() : null;

  return {
    slug: row.slug,
    title: row.title || 'Untitled',
    source: row.source || null,
    link: row.link || null,
    date,
    formattedDate: formatDate(date),
    content: row.content || '',
    tags: normalizeTags(row.tags),
  };
}

function isMissingArticlesTableError(error) {
  return error && (error.code === '42P01' || String(error.message || '').includes('relation "articles" does not exist'));
}

function logDatabaseFallback(context, error) {
  if (isMissingArticlesTableError(error)) {
    console.warn(`[newsData] ${context}: таблицата articles липсва. Ползвам markdown fallback.`);
    return;
  }

  console.error(`[newsData] ${context}: fallback към markdown.`, error?.message || error);
}

export async function getAllArticles() {
  try {
    const rows = await queryDatabase(
      `
        SELECT slug, title, source, link, published_at, tags, content
        FROM articles
        ORDER BY published_at DESC NULLS LAST
      `
    );

    if (rows) {
      return rows.map(normalizeDbArticle);
    }
  } catch (error) {
    logDatabaseFallback('getAllArticles', error);
  }

  const articles = readMarkdownArticles();
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getLatestArticles(limit = 3) {
  const articles = await getAllArticles();
  return articles.slice(0, limit);
}

export async function getArticleSlugs() {
  try {
    const rows = await queryDatabase(
      `
        SELECT slug
        FROM articles
        ORDER BY published_at DESC NULLS LAST
      `
    );

    if (rows) {
      return rows.map((row) => row.slug);
    }
  } catch (error) {
    logDatabaseFallback('getArticleSlugs', error);
  }

  return readMarkdownArticles().map((article) => article.slug);
}

export async function getArticleBySlug(slug) {
  try {
    const rows = await queryDatabase(
      `
        SELECT slug, title, source, link, published_at, tags, content
        FROM articles
        WHERE slug = $1
        LIMIT 1
      `,
      [slug]
    );

    if (rows && rows.length > 0) {
      return normalizeDbArticle(rows[0]);
    }
  } catch (error) {
    logDatabaseFallback('getArticleBySlug', error);
  }

  const filePath = path.join(getNewsDirectory(), `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  const cleanedContent = content.replace(/[\r\uFEFF\xA0]+/g, '').trim();
  const date = data.date ? new Date(data.date).toISOString() : null;

  return {
    slug,
    title: data.title || 'Untitled',
    source: data.source || null,
    link: data.link || null,
    date,
    formattedDate: formatDate(date),
    content: cleanedContent,
    tags: normalizeTags(data.tags || []),
  };
}
