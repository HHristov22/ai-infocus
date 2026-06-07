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
    throw new Error('POSTGRES_URL or DATABASE_URL is not configured.');
  }

  let Client;
  try {
    const pgModuleName = 'pg';
    ({ Client } = await import(pgModuleName));
  } catch (error) {
    throw new Error(`Postgres driver is not installed: ${error?.message || error}`);
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

function normalizeDbArticle(row) {
  const date = row.published_at ? new Date(row.published_at).toISOString() : null;

  return {
    slug: row.slug,
    title: row.title || 'Untitled',
    titleBg: row.title_bg || null,
    source: row.source || null,
    link: row.link || null,
    date,
    formattedDate: formatDate(date),
    content: row.content || '',
    contentBg: row.content_bg || '',
    tags: normalizeTags(row.tags),
    views: Number(row.view_count) || 0,
  };
}

function isMissingArticlesTableError(error) {
  return error && (error.code === '42P01' || String(error.message || '').includes('relation "articles" does not exist'));
}

function logDatabaseFallback(context, error) {
  if (isMissingArticlesTableError(error)) {
    console.warn(`[newsData] ${context}: таблицата articles липсва.`);
    return;
  }

  console.error(`[newsData] ${context}: database read failed.`, error?.message || error);
}

async function ensureViewCountColumn() {
  try {
    await queryDatabase('ALTER TABLE articles ADD COLUMN IF NOT EXISTS view_count BIGINT NOT NULL DEFAULT 0;');
  } catch (error) {
    logDatabaseFallback('ensureViewCountColumn', error);
  }
}

export async function getAllArticles() {
  try {
    await ensureViewCountColumn();
    const rows = await queryDatabase(
      `
        SELECT slug, title, title_bg, source, link, published_at, tags, content, content_bg, view_count
        FROM articles
        ORDER BY published_at DESC NULLS LAST
      `
    );

    return (rows || []).map(normalizeDbArticle);
  } catch (error) {
    logDatabaseFallback('getAllArticles', error);
    return [];
  }

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

    return (rows || []).map((row) => row.slug);
  } catch (error) {
    logDatabaseFallback('getArticleSlugs', error);
    return [];
  }

}

export async function getArticleBySlug(slug) {
  try {
    await ensureViewCountColumn();
    const rows = await queryDatabase(
      `
        SELECT slug, title, title_bg, source, link, published_at, tags, content, content_bg, view_count
        FROM articles
        WHERE slug = $1
        LIMIT 1
      `,
      [slug]
    );

    if (rows && rows.length > 0) {
      return normalizeDbArticle(rows[0]);
    }
    return null;
  } catch (error) {
    logDatabaseFallback('getArticleBySlug', error);
    return null;
  }
}

export async function getArticleViewsBySlug(slug) {
  try {
    await ensureViewCountColumn();
    const rows = await queryDatabase(
      `
        SELECT view_count
        FROM articles
        WHERE slug = $1
        LIMIT 1
      `,
      [slug]
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    return Number(rows[0].view_count) || 0;
  } catch (error) {
    logDatabaseFallback('getArticleViewsBySlug', error);
    return null;
  }
}

export async function incrementArticleViewsBySlug(slug) {
  try {
    await ensureViewCountColumn();
    const rows = await queryDatabase(
      `
        UPDATE articles
        SET view_count = COALESCE(view_count, 0) + 1,
            updated_at = NOW()
        WHERE slug = $1
        RETURNING view_count
      `,
      [slug]
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    return Number(rows[0].view_count) || 0;
  } catch (error) {
    logDatabaseFallback('incrementArticleViewsBySlug', error);
    return null;
  }
}
