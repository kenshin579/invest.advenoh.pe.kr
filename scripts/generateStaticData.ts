import { readFile, readdir, stat, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

interface MarkdownFrontMatter {
  title: string;
  description?: string;
  date: string;
  update?: string;
  category?: string;
  tags?: string[];
  series?: string;
}

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  series?: string;
  featuredImage?: string;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  createdAt: string;
  updatedAt?: string;
}

interface CategoryData {
  category: string;
  count: number;
}

interface SeriesData {
  name: string;
  count: number;
  latestDate: string;
  posts: {
    title: string;
    slug: string;
    date: string;
  }[];
}

function parseMarkdownFile(content: string): { frontMatter: MarkdownFrontMatter; content: string } {
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!frontMatterMatch) {
    throw new Error('No front matter found in markdown file');
  }

  const frontMatterText = frontMatterMatch[1];
  const markdownContent = frontMatterMatch[2];

  const frontMatter: any = {};
  const lines = frontMatterText.split('\n');
  let currentKey = '';
  let inArray = false;
  let arrayItems: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('- ')) {
      if (inArray) {
        arrayItems.push(trimmed.substring(2));
      }
    } else if (trimmed.includes(':')) {
      if (inArray && currentKey) {
        frontMatter[currentKey] = arrayItems;
        inArray = false;
        arrayItems = [];
      }

      const colonIndex = trimmed.indexOf(':');
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();

      currentKey = key;

      if (value === '') {
        inArray = true;
        arrayItems = [];
      } else {
        frontMatter[key] = value.replace(/^["']|["']$/g, '');
      }
    }
  }

  if (inArray && currentKey) {
    frontMatter[currentKey] = arrayItems;
  }

  return {
    frontMatter: frontMatter as MarkdownFrontMatter,
    content: markdownContent.trim()
  };
}

function createSlug(folderName: string): string {
  return folderName;
}

function extractExcerpt(content: string): string {
  const plainText = content
    .replace(/^#+ .+$/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();

  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
}

function extractFirstImageFromMarkdown(content: string): string | null {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);

  if (match && match[1]) {
    const imageSrc = match[1].trim();
    if (imageSrc.startsWith('http')) {
      return imageSrc;
    }
    return imageSrc;
  }

  return null;
}

async function importMarkdownFiles(contentDir: string = 'contents'): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  try {
    const categories = await readdir(contentDir);

    for (const category of categories) {
      const categoryDir = join(contentDir, category);
      const categoryStat = await stat(categoryDir);

      if (!categoryStat.isDirectory()) {
        continue;
      }

      const folders = await readdir(categoryDir);

      for (const folder of folders) {
        const folderPath = join(categoryDir, folder);
        const folderStat = await stat(folderPath);

        if (folderStat.isDirectory()) {
          const markdownPath = join(folderPath, 'index.md');

          try {
            const content = await readFile(markdownPath, 'utf-8');
            const { frontMatter, content: markdownContent } = parseMarkdownFile(content);

            const slug = createSlug(folder);
            const excerpt = extractExcerpt(markdownContent);
            const firstImage = extractFirstImageFromMarkdown(markdownContent);

            const finalCategory = frontMatter.category || category;

            let featuredImagePath = null;
            if (firstImage && !firstImage.startsWith('http')) {
              featuredImagePath = `/contents/${category}/${folder}/${firstImage}`;
            } else if (firstImage) {
              featuredImagePath = firstImage;
            }

            const blogPost: BlogPost = {
              title: frontMatter.title,
              slug,
              content: markdownContent,
              excerpt,
              category: finalCategory,
              tags: frontMatter.tags || [],
              series: frontMatter.series,
              featuredImage: featuredImagePath,
              published: true,
              seoTitle: `${frontMatter.title} | 투자 인사이트`,
              seoDescription: frontMatter.description || excerpt,
              seoKeywords: frontMatter.tags?.join(', ') || '',
              createdAt: frontMatter.date,
              updatedAt: frontMatter.update
            };

            posts.push(blogPost);
            console.log(`✓ Imported: ${frontMatter.title}`);

          } catch (error) {
            console.error(`Failed to import ${folder}:`, error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error importing markdown files:', error);
  }

  return posts;
}

function generateCategories(posts: BlogPost[]): CategoryData[] {
  const categoryCount: { [key: string]: number } = {};

  posts.forEach(post => {
    const category = post.category || 'uncategorized';
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  return Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));
}

function generateSeries(posts: BlogPost[]): SeriesData[] {
  const seriesPosts = posts.filter(post => post.series);

  const seriesMap = new Map<string, BlogPost[]>();
  seriesPosts.forEach(post => {
    if (!seriesMap.has(post.series!)) {
      seriesMap.set(post.series!, []);
    }
    seriesMap.get(post.series!)!.push(post);
  });

  return Array.from(seriesMap.entries()).map(([seriesName, seriesPosts]) => {
    const sortedPosts = seriesPosts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      name: seriesName,
      count: seriesPosts.length,
      latestDate: sortedPosts[0].createdAt,
      posts: sortedPosts.map(post => ({
        title: post.title,
        slug: post.slug,
        date: post.createdAt
      }))
    };
  });
}

function generateTags(posts: BlogPost[]): { tag: string; count: number }[] {
  const tagCount: { [key: string]: number } = {};

  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));
}

async function main() {
  console.log('🚀 Starting static data generation...\n');

  const posts = await importMarkdownFiles();
  const categories = generateCategories(posts);
  const series = generateSeries(posts);
  const tags = generateTags(posts);

  console.log(`\n📊 Generated data:`);
  console.log(`  - Posts: ${posts.length}`);
  console.log(`  - Categories: ${categories.length}`);
  console.log(`  - Series: ${series.length}`);
  console.log(`  - Tags: ${tags.length}`);

  await mkdir('public/data', { recursive: true });

  await writeFile(
    'public/data/posts.json',
    JSON.stringify(posts, null, 2),
    'utf-8'
  );
  console.log('\n✅ Generated: public/data/posts.json');

  await writeFile(
    'public/data/categories.json',
    JSON.stringify(categories, null, 2),
    'utf-8'
  );
  console.log('✅ Generated: public/data/categories.json');

  await writeFile(
    'public/data/series.json',
    JSON.stringify(series, null, 2),
    'utf-8'
  );
  console.log('✅ Generated: public/data/series.json');

  await writeFile(
    'public/data/tags.json',
    JSON.stringify(tags, null, 2),
    'utf-8'
  );
  console.log('✅ Generated: public/data/tags.json');

  console.log('\n🎉 Static data generation complete!');
}

main().catch(console.error);
