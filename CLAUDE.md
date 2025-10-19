# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Korean investment insights blog built with Next.js 15 (App Router) + Express.js integration. Combines SSR capabilities with a custom Express backend for API routes and static content serving.

## Development Commands

### Running the Application
```bash
# Development (Express + Next.js HMR)
npm run dev

# Development (Next.js only - alternative)
npm run dev:nextjs

# Production build
npm run build

# Start production server
npm run start
```

### Code Quality
```bash
# Type checking
npm run check

# Linting
npm run lint
```

### Database Operations
```bash
# Push schema changes to database
npm run db:push
```

### Performance Testing
```bash
# Run Lighthouse CI performance tests
npm run test:performance
```

## Architecture Overview

### Hybrid Server Architecture

This application uses a **hybrid Express + Next.js architecture**:

- **Express Server** (`server/index.ts`): Main entry point that:
  - Initializes Next.js app programmatically
  - Registers custom API routes from `server/routes.ts`
  - Serves static assets (`/contents`, `/attached_assets`)
  - Forwards all other requests to Next.js handler
  - Runs on port 3000 by default

- **Next.js App Router** (`src/app/`): Handles SSR, routing, and client-side logic

This architecture allows:
- Custom Express middleware and API endpoints
- Next.js SSR and static optimization
- Unified deployment with single server process

### Content Management System

Blog posts are **markdown-based** with frontmatter:
- Location: `contents/{category}/{slug}/index.md`
- Categories: `etc/`, `etf/`, `stock/`, `weekly/`
- Frontmatter fields:
  ```yaml
  title: string
  description: string
  date: YYYY-MM-DD
  update: YYYY-MM-DD (optional)
  category: string
  tags: array
  series: string (optional)
  ```

**Content Import Flow**:
1. Server startup triggers `importMarkdownFiles()` in `server/routes.ts:14-16`
2. Markdown files parsed via `gray-matter`
3. Content stored in storage layer (in-memory or database)
4. Available via `/api/blog-posts` endpoints

### Path Aliases

TypeScript path resolution:
- `@/*` → `./src/*`
- `@shared/*` → `./shared/*`

### Database Layer

**Drizzle ORM** with PostgreSQL:
- Schema: `shared/schema.ts`
- Config: `drizzle.config.ts`
- Tables: `users`, `blog_posts`, `newsletter_subscribers`

**Storage Abstraction**: `server/storage.ts` provides in-memory fallback when database is unavailable

### UI Components

**shadcn/ui** components in `src/components/ui/`:
- Pre-built Radix UI primitives with Tailwind styling
- DO NOT modify these files manually
- Use `npx shadcn@latest add {component}` to add new components

**Custom Components** in `src/components/`:
- `blog-post-card.tsx`: Blog post preview cards
- `markdown-renderer.tsx`: Renders markdown with syntax highlighting
- `series-navigation.tsx`: Series post navigation
- `related-posts.tsx`: Related content suggestions

### API Routes Structure

Express API routes (`server/routes.ts`):
- `GET /api/blog-posts` - List posts with filtering (category, search, series)
- `GET /api/blog-posts/:slug` - Get single post (increments views)
- `GET /api/categories` - Top 5 categories with counts
- `GET /api/series` - All series with post lists
- `POST /api/newsletter/subscribe` - Newsletter subscription
- `GET /rss.xml` - RSS feed generation
- `GET /sitemap.xml` - Sitemap generation
- `GET /image-sitemap.xml` - Image sitemap
- `GET /robots.txt` - Robots.txt

Client-side API helpers: `src/lib/blog-client.ts`

### Key Libraries in `src/lib/`

- `blog-server.ts` / `blog-client.ts`: Blog data fetching utilities
- `markdown.ts`: Markdown processing with remark/rehype
- `json-ld-schema.ts`: Structured data for SEO
- `content-management.ts`: Content utilities
- `image-utils.ts`: Image optimization helpers
- `date-utils.ts`: Date formatting utilities
- `error-handling.ts` / `error-boundary.tsx`: Error management

## Git Commit Conventions

**IMPORTANT**: All commits MUST follow Korean commit message format from `.github/git-commit-instructions.md`:

```
[#이슈번호] <간결한 설명>

* 추가 세부 정보 (선택사항)
* 변경 사항의 동기나 맥락 설명
```

**Commit Types** (optional):
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅 (코드 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드
- `chore`: 빌드/도구 변경, 의존성 관리

**Examples**:
```
[#3000] 주식 가격 조회 API 구현

* REST API 엔드포인트 `/api/v1/stocks/{symbol}/price` 추가
* KIS API 연동하여 실시간 주식 가격 데이터 조회 기능 구현
```

```
[#3001] fix: 주식 정보 조회 시 발생하는 NullPointerException 수정
```

## Important Considerations

### TypeScript Configuration
- Build errors and TypeScript errors are **ignored** in production builds (`ignoreBuildErrors: true`)
- Still run `npm run check` during development to catch issues early

### Content Reloading
- Markdown files are imported on **server startup only**
- To reload content changes, restart the server
- Consider adding hot reload for content in development if needed

### Image Optimization
- Images in `public/contents/` are served with 1-year cache headers
- Next.js Image component has `unoptimized: true`
- WebP/AVIF formats preferred

### Environment Variables
Required variables (create `.env.local`):
```bash
DATABASE_URL=postgresql://...  # Optional, falls back to in-memory storage
SITE_URL=http://localhost:3000 # Used for SEO/sitemap generation
```

### SEO & Analytics
- Structured data: JSON-LD schemas in `src/lib/json-ld-schema.ts`
- Google Analytics: Tag ID `G-9LNH27K1YS`
- Open Graph tags configured per page
- Sitemap auto-generated from blog posts

### Performance Optimizations
- Package imports optimized for Radix UI and icon libraries
- Static asset caching (1 year for `/contents` and `/_next/static`)
- Security headers configured in `next.config.ts`
- Compression enabled

### Text Encoding (Korean Content)

**Encoding Standard**: All files MUST be UTF-8 encoded (한글 콘텐츠 필수)

**When creating Korean/emoji content with Claude Code**:

1. **Verify encoding after file creation**:
   ```bash
   file -I path/to/file.md
   # Expected: text/plain; charset=utf-8 ✅
   # Problem:  application/octet-stream; charset=binary ❌
   ```

2. **If encoding is broken (charset=binary)**:
   ```bash
   # Option 1: Use Bash heredoc (most reliable)
   cat > file.md << 'EOF'
   한글 내용...
   EOF

   # Option 2: Re-create with Write tool
   # (usually works, but verify with file -I afterward)
   ```

3. **Prevention tips**:
   - Write tool generally handles UTF-8 correctly
   - For very large files (>5000 lines), verify encoding
   - If using Cursor/VSCode, default encoding should be UTF-8
   - System locale (`.zshrc` settings) don't affect Claude Code tools

4. **Quick encoding check**:
   ```bash
   # Check encoding
   file -I docs/**/*.md

   # View Korean content
   cat file.md | head -20
   ```

**Note**: This project contains Korean content in:
- Documentation (`docs/`)
- Markdown blog posts (`contents/`)
- Code comments and commit messages

## File Structure Notes

```
/
├── src/                   # Next.js source
│   ├── app/              # App Router pages
│   │   ├── [category]/  # Dynamic category pages
│   │   ├── api/         # Next.js API routes (minimal, most in server/)
│   │   └── series/      # Series pages
│   ├── components/       # React components
│   │   └── ui/          # shadcn/ui components (DO NOT edit manually)
│   ├── lib/             # Utilities and helpers
│   └── middleware.ts    # Next.js middleware
├── server/               # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Data storage abstraction
│   └── services/        # Service layer (RSS, sitemap, etc.)
├── shared/              # Shared between server and client
│   └── schema.ts        # Drizzle schemas and Zod validators
├── contents/            # Markdown blog posts
│   ├── etc/
│   ├── etf/
│   ├── stock/
│   └── weekly/
└── public/              # Static assets
    └── contents/        # Blog post images
```

## Development Workflow

1. **Adding Blog Posts**: Create `contents/{category}/{slug}/index.md` with frontmatter
2. **Adding Components**: Create in `src/components/` or add shadcn component via CLI
3. **API Changes**: Modify `server/routes.ts` for custom endpoints
4. **Schema Changes**: Update `shared/schema.ts` then run `npm run db:push`
5. **Type Checking**: Run `npm run check` before committing
6. **Testing**: Run build locally with `npm run build` to catch issues

## Common Tasks

### Adding a New Blog Post Category
1. Add markdown files to `contents/{new-category}/`
2. No code changes needed - categories auto-discovered from content

### Modifying API Endpoints
Edit `server/routes.ts` - hot reload works in development mode

### Adding Database Fields
1. Update schema in `shared/schema.ts`
2. Run `npm run db:push` to apply changes
3. Update TypeScript types (auto-inferred from schema)

### Working with Series
Series are defined in post frontmatter via `series: "series-name"`. Related posts automatically grouped via `/api/series` endpoint.
