import { getAllArticles } from '../../lib/newsData';

export default async function handler(req, res) {
  const articles = await getAllArticles();
  res.status(200).json(articles);
}
