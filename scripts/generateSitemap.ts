import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

interface BlogPost {
  title: string;
  slug: string;
  category: string;
  createdAt: string;
  updatedAt?: string;
}

async function generateSitemap() {
  console.log('🗺️  Generating sitemap.xml...');

  const postsData = await readFile('public/data/posts.json', 'utf-8');
  const posts: BlogPost[] = JSON.parse(postsData);

  const baseUrl = process.env.SITE_URL || 'https://stock.advenoh.pe.kr';

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const staticPages = [
    { url: baseUrl, changefreq: 'daily', priority: '1.0' },
    { url: `${baseUrl}/series`, changefreq: 'weekly', priority: '0.7' },
  ];

  const postUrls = posts.map(post => {
    const postDate = new Date(post.createdAt);
    const isRecent = postDate > thirtyDaysAgo;

    return {
      url: `${baseUrl}/${(post.category || 'etc').toLowerCase()}/${post.slug}`,
      changefreq: 'weekly',
      priority: isRecent ? '0.9' : '0.8',
      lastmod: post.updatedAt || post.createdAt
    };
  });

  const allUrls = [...staticPages, ...postUrls];

  const urlEntries = allUrls.map(page => `
    <url>
      <loc>${page.url}</loc>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
      ${'lastmod' in page && page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    </url>
  `).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlEntries}
</urlset>`;

  await writeFile('public/sitemap.xml', sitemap, 'utf-8');
  console.log('✅ Generated: public/sitemap.xml');
}

generateSitemap().catch(console.error);
