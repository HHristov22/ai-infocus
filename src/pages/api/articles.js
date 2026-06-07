import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function handler(req, res) {
  // Vercel CDN cache + stale-while-revalidate keeps homepage fast.
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600');

  const dirPath = path.join(process.cwd(), 'news');
  
  if (!fs.existsSync(dirPath)) {
    return res.status(200).json([]);
  }

  const filenames = fs.readdirSync(dirPath).filter((filename) => filename.endsWith('.md'));

  const articles = filenames.map((filename) => {
    const filePath = path.join(dirPath, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    const date = data.date ? new Date(data.date).toISOString() : null;

    return {
      slug: filename.replace('.md', ''),
      ...data,
      date,
      content,
      formattedDate: date 
        ? new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23'
          }).replace(' at ', ' - ')
        : 'Unknown Date'
    };
  });

  const sortedArticles = articles.sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  ).slice(0, 3);

  res.status(200).json(sortedArticles);
}