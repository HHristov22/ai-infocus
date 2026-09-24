import { getArticleBySlug } from '../../../lib/newsData';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    res.status(400).json({ error: 'Invalid slug' });
    return;
  }

  const article = await getArticleBySlug(slug);
  if (!article) {
    res.status(404).json({ error: 'Article not found' });
    return;
  }

  res.status(200).json(article);
}
