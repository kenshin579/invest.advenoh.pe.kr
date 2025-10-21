import { writeFile } from 'fs/promises';

async function generateRobots() {
  console.log('🤖 Generating robots.txt...');

  const baseUrl = process.env.SITE_URL || 'https://invest.advenoh.pe.kr';

  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Crawl-delay: 1

Sitemap: ${baseUrl}/sitemap.xml

# Host
Host: ${baseUrl}

# Investment Insights Blog
# Professional financial blog about stocks, ETFs, bonds, and funds`;

  await writeFile('public/robots.txt', robots, 'utf-8');
  console.log('✅ Generated: public/robots.txt');
}

generateRobots().catch(console.error);
