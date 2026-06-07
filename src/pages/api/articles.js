import { getLatestArticles } from '../../lib/newsData';

export default async function handler(req, res) {
  // Vercel CDN cache + stale-while-revalidate keeps homepage fast.
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600');

  const latestArticles = await getLatestArticles(3);
  res.status(200).json(latestArticles);
}