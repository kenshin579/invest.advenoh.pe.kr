import { readFile, writeFile } from 'fs/promises';

interface BlogPost {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  tags: string[];
  createdAt: string;
}

async function generateRssFeed() {
  console.log('📰 Generating RSS feed...');

  const postsData = await readFile('public/data/posts.json', 'utf-8');
  const posts: BlogPost[] = JSON.parse(postsData);

  const baseUrl = process.env.SITE_URL || 'https://stock.advenoh.pe.kr';

  const sortedPosts = posts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);

  const rssItems = sortedPosts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/${(post.category || 'etc').toLowerCase()}/${post.slug}</link>
      <guid>${baseUrl}/${(post.category || 'etc').toLowerCase()}/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <category>${post.category}</category>
      ${post.tags?.map(tag => `<category><![CDATA[${tag}]]></category>`).join('') || ''}
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>투자 인사이트 블로그</title>
    <link>${baseUrl}</link>
    <description>국내외 주식, ETF, 채권, 펀드에 대한 전문적인 투자 정보와 분석</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Investment Insights Blog</generator>
    ${rssItems}
  </channel>
</rss>`;

  await writeFile('public/rss.xml', rss, 'utf-8');
  console.log('✅ Generated: public/rss.xml');
}

generateRssFeed().catch(console.error);
