# 투자 인사이트 블로그 - Next.js 정적 사이트

## 🚀 프로젝트 개요

이 프로젝트는 투자 인사이트를 공유하는 한국어 금융 블로그입니다. Next.js 15 App Router 기반의 완전한 정적 사이트로, 모든 콘텐츠가 빌드 타임에 생성되어 CDN을 통해 제공됩니다.

## 🏗️ 시스템 아키텍처

### 정적 사이트 생성 (Static Site Generation)
- **Framework**: Next.js 15 with App Router (Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Content**: Markdown (gray-matter, remark)
- **SEO**: 메타데이터, 구조화된 데이터, 사이트맵
- **Deployment**: 정적 파일 호스팅 (Netlify)
- **Build Process**: 마크다운 → JSON 변환 → 정적 HTML 생성

## 📁 프로젝트 구조

```
/
├── src/                    # Next.js 소스 코드
│   ├── app/               # App Router
│   │   ├── [category]/   # 동적 카테고리 페이지
│   │   ├── series/       # 시리즈 페이지
│   │   └── layout.tsx    # 루트 레이아웃
│   ├── components/        # React 컴포넌트
│   │   └── ui/           # shadcn/ui 컴포넌트
│   ├── hooks/            # 커스텀 훅
│   ├── lib/              # 유틸리티 함수
│   └── types/            # TypeScript 타입 정의
├── scripts/               # 빌드 스크립트
│   ├── generateStaticData.ts  # 마크다운 → JSON 변환
│   ├── generateSitemap.ts     # 사이트맵 생성
│   ├── generateRssFeed.ts     # RSS 피드 생성
│   └── generateRobots.ts      # robots.txt 생성
├── contents/              # 마크다운 콘텐츠
│   ├── etc/              # 기타 카테고리
│   ├── etf/              # ETF 카테고리
│   ├── stock/            # 주식 카테고리
│   └── weekly/           # 주간 리뷰
├── public/                # 정적 자산
│   ├── contents/         # 이미지 파일
│   └── data/             # 생성된 JSON 파일
└── out/                   # 빌드 출력 (정적 HTML)
```

## 🛠️ 기술 스택

### Frontend
- **Next.js 15** (App Router with Static Export)
- **React 19.1.0**
- **TypeScript**
- **Tailwind CSS**
- **Radix UI + shadcn/ui**

### Content & Build
- **gray-matter** (Frontmatter 파싱)
- **remark & rehype** (마크다운 처리)
- **Node.js Scripts** (정적 데이터 생성)

### Development & Quality
- **ESLint**
- **TypeScript Compiler**
- **Lighthouse CI** (성능 테스트)

### Deployment
- **Netlify** (정적 호스팅)
- **CDN** (전역 콘텐츠 배포)

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.17.0 이상
- npm, yarn, pnpm, 또는 bun

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정 (선택사항)**
   ```bash
   # .env.local 파일 생성
   SITE_URL=https://investment.advenoh.pe.kr  # SEO/사이트맵용 (기본값: localhost)
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   # 마크다운 → JSON 변환 후 Next.js 개발 서버 시작
   ```

4. **브라우저에서 확인**
   ```
   http://localhost:3000
   ```

### 빌드 및 배포

1. **프로덕션 빌드**
   ```bash
   npm run build
   # 1. 마크다운 → JSON 변환
   # 2. Next.js 정적 사이트 빌드
   # 3. 사이트맵/RSS/robots.txt 생성
   ```

2. **로컬에서 빌드 확인**
   ```bash
   npm run start
   # out/ 폴더의 정적 파일을 로컬 서버로 제공 (http://localhost:3000)
   ```

3. **배포**
   - `out/` 폴더의 정적 파일을 호스팅 서비스에 배포
   - Netlify, Vercel, GitHub Pages 등 정적 호스팅 지원

## 📊 주요 기능

### 블로그 기능
- **정적 사이트 생성**: Next.js Static Export 기반 (완전한 정적 HTML)
- **빌드 타임 데이터 생성**: 마크다운 → JSON 변환 자동화
- **마크다운 지원**: gray-matter, remark를 통한 콘텐츠 처리
- **카테고리 필터링**: 주식, ETF, 주간 리뷰 등 (클라이언트 사이드)
- **검색 기능**: 제목, 내용, 태그 기반 검색 (클라이언트 사이드)
- **시리즈 기능**: 연관 포스트 그룹화
- **이미지 최적화**: Next.js Image 컴포넌트, lazy loading

### SEO 최적화
- **메타데이터**: 동적 메타 태그 생성
- **구조화된 데이터**: JSON-LD 스키마
- **사이트맵**: 자동 생성
- **RSS 피드**: 블로그 구독 지원
- **Open Graph**: 소셜 미디어 공유 최적화

### 성능 최적화
- **Core Web Vitals**: LCP, FID, CLS 최적화
- **번들 최적화**: Tree shaking, 코드 분할
- **캐싱**: CDN을 통한 정적 자산 캐싱 (1년)
- **이미지 최적화**: Next.js Image 컴포넌트
- **완전한 정적 사이트**: 서버 없이 CDN에서 직접 제공
- **빠른 로딩**: 모든 페이지 사전 렌더링

## 🔧 개발 가이드

### 컴포넌트 작성 규칙

1. **타입 정의**: 모든 props에 TypeScript 인터페이스 정의
2. **주석**: 복잡한 로직에 JSDoc 주석 추가
3. **에러 처리**: ErrorBoundary 사용
4. **접근성**: ARIA 라벨, 키보드 네비게이션 지원

### 빌드 스크립트 작성법

빌드 타임에 실행되는 스크립트 (`scripts/` 디렉토리):

```typescript
// scripts/generateStaticData.ts 예시
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 마크다운 파일 읽기 및 파싱
const contentDir = path.join(process.cwd(), 'contents');
const posts = []; // 포스트 데이터 수집

// JSON 파일로 저장
fs.writeFileSync(
  path.join(process.cwd(), 'public/data/posts.json'),
  JSON.stringify(posts, null, 2)
);
```

빌드 스크립트는 `npm run dev` 또는 `npm run build` 시 자동으로 실행됩니다.

### 블로그 포스트 작성법

1. **마크다운 파일 생성**: `contents/category/slug/index.md`
2. **Frontmatter 작성**:
   ```yaml
   ---
   title: "포스트 제목"
   date: "2024-12-01"
   author: "작성자"
   categories: ["stock", "etf"]
   tags: ["투자", "분석"]
   excerpt: "포스트 요약"
   featuredImage: "image.jpg"
   ---
   ```
3. **콘텐츠 작성**: 마크다운 형식으로 작성

## 🧪 테스트

### 성능 테스트

```bash
# Lighthouse CI 실행
npm run test:performance

# 번들 크기 분석
npm run build
```

### 기능 테스트

```bash
# 개발 서버에서 수동 테스트
npm run dev

# 빌드 테스트
npm run build
```

## 📈 모니터링

### 성능 모니터링

- **Core Web Vitals**: 실시간 측정
- **Google Analytics**: 페이지뷰, 사용자 행동 추적
  - 실시간 사용자 모니터링
  - 인기 콘텐츠 분석
  - 트래픽 소스 추적
- **에러 추적**: 자동 에러 로깅

### 로그 확인

```bash
# 개발 서버 로그
npm run dev

# 프로덕션 로그
npm run start
```

## 🔄 배포

### Netlify 배포 (정적 호스팅)

1. **자동 배포**: Git push 시 자동 빌드 및 배포
   - 빌드 명령: `npm run build`
   - 배포 디렉토리: `out/`

2. **환경 변수 설정** (Netlify 대시보드):
   - `SITE_URL`: 배포된 사이트 URL (예: `https://investment.advenoh.pe.kr`)

3. **빌드 프로세스**:
   - 마크다운 → JSON 변환
   - Next.js 정적 사이트 빌드
   - 사이트맵/RSS/robots.txt 생성
   - CDN으로 배포

### 배포 확인 체크리스트

- [ ] 사이트 접근 가능 (https://investment.advenoh.pe.kr)
- [ ] 모든 페이지 정상 로드 (카테고리, 시리즈, 블로그 포스트)
- [ ] 이미지 및 정적 자산 로드
- [ ] 검색 및 필터링 기능 작동
- [ ] SEO 메타데이터 확인 (og:image, description 등)
- [ ] Google Analytics 작동 확인 (G-DWDKCB9644)
- [ ] 성능 지표 측정 (Lighthouse)
- [ ] 한글 인코딩 정상 표시 (UTF-8)

## 🐛 문제 해결

### 일반적인 문제

1. **빌드 실패**
   ```bash
   # 캐시 클리어
   rm -rf .next
   rm -rf node_modules/.cache
   npm run build
   ```

2. **하이드레이션 에러**
   - 클라이언트 컴포넌트에 'use client' 지시어 추가
   - 서버와 클라이언트 간 상태 불일치 확인

3. **이미지 최적화 문제**
   - next.config.ts에서 이미지 도메인 설정 확인
   - 이미지 파일 경로 및 형식 확인

### 지원

문제가 발생하면 다음을 확인하세요:

1. **로그 확인**: 개발자 도구 콘솔
2. **네트워크 탭**: API 요청/응답 확인
3. **성능 탭**: Core Web Vitals 측정

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**개발자**: 투자 인사이트 블로그 팀
**최종 업데이트**: 2025년 10월
**아키텍처**: Next.js 15 정적 사이트 (Static Export)

## 📝 최근 변경 사항

### 2025년 10월
- **도메인 통일**: 모든 URL을 `investment.advenoh.pe.kr`로 통일
  - `invest.advenoh.pe.kr` → `investment.advenoh.pe.kr`
  - `stock.advenoh.pe.kr` → `investment.advenoh.pe.kr`
  - Contents 폴더 내 모든 내부 링크 업데이트 (14개 파일, 18개 URL)
- **SEO 최적화**:
  - Google Analytics 태그 업데이트 (`G-9LNH27K1YS` → `G-DWDKCB9644`)
  - Naver 사이트 인증 코드 갱신
- **빌드 프로세스 개선**:
  - sitemap.xml, rss.xml, robots.txt 생성 타이밍 최적화
  - `postbuild` → `prebuild`로 이동하여 Static Export에 포함되도록 수정
- **GitHub Actions 추가**:
  - PR Assignee 자동 지정 워크플로우 추가 