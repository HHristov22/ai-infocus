import {
  getArticleViewsBySlug,
  incrementArticleViewsBySlug,
} from '../../../lib/newsData';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    res.status(400).json({ error: 'Invalid slug' });
    return;
  }

  if (req.method === 'GET') {
    const views = await getArticleViewsBySlug(slug);
    if (views === null) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    res.status(200).json({ slug, views });
    return;
  }

  if (req.method === 'POST') {
    const views = await incrementArticleViewsBySlug(slug);
    if (views === null) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    res.status(200).json({ slug, views });
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ error: 'Method Not Allowed' });
}
