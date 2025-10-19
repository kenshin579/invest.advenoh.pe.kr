# TODO: Next.js Static Export 전환 작업

## 작업 개요
- **목표**: Express + Next.js 하이브리드 구조를 Next.js Static Export로 전환
- **배포**: Netlify 정적 호스팅
- **예상 소요 시간**: 8-10일
- **우선순위**: High

---

## Phase 0: 사전 준비 및 백업 (Day 1)
> **목표**: 현재 상태 백업 및 작업 환경 준비

### 백업 및 브랜치 생성
- [ ] 현재 코드베이스 전체 백업
- [ ] 새로운 Git 브랜치 생성: `feature/static-export`
- [ ] 현재 프로덕션 데이터 백업 (필요 시)

### 환경 준비
- [ ] Netlify 계정 생성/확인
- [ ] 도메인 설정 확인
- [ ] 현재 동작하는 기능 목록 문서화
- [ ] Replit 프로젝트 백업

### Replit 관련 파일 정리
- [ ] `.replit` 파일 제거
- [ ] Replit 전용 환경 변수 정리
- [ ] Replit 배포 스크립트 제거
- [ ] Replit 관련 의존성 제거

---

## Phase 1: 빌드 스크립트 작성 (Day 2-3)
> **목표**: 정적 데이터 생성을 위한 빌드 스크립트 구현

### 데이터 생성 스크립트
- [ ] `scripts/` 디렉토리 생성
- [ ] `scripts/generateStaticData.ts` 작성
  - [ ] 마크다운 파일 읽기 로직
  - [ ] Frontmatter 파싱
  - [ ] JSON 데이터 구조 설계
  - [ ] posts.json 생성
  - [ ] categories.json 생성
  - [ ] series.json 생성
  - [ ] tags.json 생성
- [ ] `scripts/utils/markdown.ts` - 마크다운 처리 유틸리티

### 메타데이터 생성 스크립트
- [ ] `scripts/generateSitemap.ts` 작성
  - [ ] sitemap.xml 생성 로직
  - [ ] 동적 URL 포함
  - [ ] 이미지 sitemap 생성
- [ ] `scripts/generateRssFeed.ts` 작성
  - [ ] RSS 2.0 포맷 생성
  - [ ] 최근 20개 포스트 포함
- [ ] `scripts/generateRobots.ts` 작성

### 스크립트 테스트
- [ ] 각 스크립트 단독 실행 테스트
- [ ] 생성된 JSON 파일 검증
- [ ] 생성된 메타 파일 검증

---

## Phase 2: Next.js 설정 변경 (Day 4)
> **목표**: Next.js를 정적 Export 모드로 설정

### Next.js 설정
- [ ] `next.config.ts` 수정
  - [ ] `output: 'export'` 설정
  - [ ] `trailingSlash: true` 설정
  - [ ] `images.unoptimized: true` 설정
  - [ ] 불필요한 설정 제거

### 패키지 스크립트 수정
- [ ] `package.json` scripts 업데이트
  ```json
  {
    "dev": "next dev",
    "prebuild": "tsx scripts/generateStaticData.ts",
    "build": "next build",
    "postbuild": "tsx scripts/generateSitemap.ts && tsx scripts/generateRssFeed.ts"
  }
  ```
- [ ] 서버 관련 스크립트 제거
- [ ] 테스트 스크립트 추가

### 환경 변수 정리
- [ ] `.env.local` 파일 정리
- [ ] 불필요한 서버 환경 변수 제거
- [ ] 클라이언트 전용 환경 변수 확인

---

## Phase 3: 페이지 컴포넌트 리팩토링 (Day 5-6)
> **목표**: 서버 의존성 제거 및 정적 생성 구현

### 동적 라우트 수정
- [ ] `src/app/page.tsx` - 홈페이지
  - [ ] 서버 API 호출 제거
  - [ ] JSON 파일 직접 import
- [ ] `src/app/[category]/page.tsx` - 카테고리 페이지
  - [ ] `generateStaticParams` 구현
  - [ ] 정적 데이터 로드
- [ ] `src/app/[category]/[slug]/page.tsx` - 포스트 상세
  - [ ] `generateStaticParams` 구현
  - [ ] 마크다운 렌더링 클라이언트 사이드로 이동
- [ ] `src/app/series/page.tsx` - 시리즈 목록
- [ ] `src/app/series/[series]/page.tsx` - 시리즈 상세

### 데이터 Fetching 변경
- [ ] `src/lib/blog-server.ts` 수정
  - [ ] API 호출을 JSON 파일 읽기로 변경
  - [ ] 캐싱 로직 제거
- [ ] `src/lib/blog-client.ts` 제거 또는 수정
- [ ] 각 컴포넌트의 fetch 로직 업데이트

### 컴포넌트 수정
- [ ] `src/components/blog-post-card.tsx`
- [ ] `src/components/series-navigation.tsx`
- [ ] `src/components/related-posts.tsx`
- [ ] `src/components/category-list.tsx`

---

## Phase 4: 클라이언트 기능 구현 (Day 7)
> **목표**: 서버 없이 동작하는 클라이언트 기능 구현

### 검색 기능
- [ ] `src/components/search-client.tsx` 생성
  - [ ] 클라이언트 사이드 검색 로직
  - [ ] Fuse.js 라이브러리 추가 (선택적)
  - [ ] 실시간 필터링
- [ ] 검색 상태 관리 (useState/useReducer)
- [ ] URL 쿼리 파라미터 동기화

### 필터링 기능
- [ ] 카테고리 필터링 클라이언트 구현
- [ ] 태그 필터링 클라이언트 구현
- [ ] 시리즈 필터링 클라이언트 구현
- [ ] 다중 필터 조합 로직

### 페이지네이션
- [ ] 클라이언트 사이드 페이징 구현
- [ ] URL 파라미터 관리
- [ ] 페이지 상태 유지

### 성능 최적화
- [ ] useMemo 활용한 필터링 최적화
- [ ] 가상 스크롤링 검토 (100+ 포스트)
- [ ] 초기 로드 최적화

---

## Phase 5: 서버 코드 제거 (Day 8)
> **목표**: 모든 서버 관련 코드 제거

### 디렉토리/파일 제거
- [ ] `server/` 디렉토리 전체 제거
  - [ ] `server/index.ts`
  - [ ] `server/routes.ts`
  - [ ] `server/storage.ts`
  - [ ] `server/services/`
- [ ] `src/app/api/` 디렉토리 제거
- [ ] `shared/schema.ts` 제거
- [ ] `drizzle.config.ts` 제거
- [ ] 데이터베이스 마이그레이션 파일 제거

### 의존성 제거
- [ ] Express 관련 패키지 제거
  ```bash
  npm uninstall express @types/express
  ```
- [ ] 데이터베이스 관련 패키지 제거
  ```bash
  npm uninstall drizzle-orm @neondatabase/serverless
  ```
- [ ] 서버 전용 패키지 제거
  ```bash
  npm uninstall tsx esbuild
  ```

### 코드 정리
- [ ] 불필요한 import 문 제거
- [ ] 사용하지 않는 유틸리티 함수 제거
- [ ] TypeScript 타입 정리

---

## Phase 6: 빌드 및 로컬 테스트 (Day 9)
> **목표**: 정적 빌드 검증 및 로컬 테스트

### 빌드 테스트
- [ ] `npm run build` 실행
- [ ] 빌드 에러 해결
- [ ] out/ 디렉토리 생성 확인
- [ ] 생성된 HTML 파일 확인

### 로컬 서버 테스트
- [ ] `npx serve out` 실행
- [ ] 모든 페이지 접근 테스트
  - [ ] 홈페이지
  - [ ] 카테고리 페이지
  - [ ] 포스트 상세 페이지
  - [ ] 시리즈 페이지
- [ ] 기능 테스트
  - [ ] 검색 기능
  - [ ] 필터링 기능
  - [ ] 네비게이션

### 성능 테스트
- [ ] Lighthouse 실행
  - [ ] Performance 점수 90+
  - [ ] Accessibility 점수 90+
  - [ ] SEO 점수 90+
- [ ] 번들 사이즈 확인
- [ ] 이미지 최적화 확인

---

## Phase 7: Netlify 배포 설정 (Day 10)
> **목표**: Netlify에 배포 및 프로덕션 환경 설정

### Netlify 프로젝트 설정
- [ ] Netlify 프로젝트 생성
- [ ] GitHub 저장소 연결
- [ ] 빌드 설정
  - Build command: `npm run build`
  - Publish directory: `out`
- [ ] 환경 변수 설정 (필요시)

### netlify.toml 설정
- [ ] `netlify.toml` 파일 생성
- [ ] 헤더 설정 (캐싱, 보안)
- [ ] 리다이렉트 규칙 설정
- [ ] 404 페이지 설정

### 도메인 설정
- [ ] 커스텀 도메인 연결
- [ ] SSL 인증서 확인
- [ ] DNS 설정

### 배포 테스트
- [ ] 첫 배포 실행
- [ ] 배포된 사이트 접근 테스트
- [ ] 모든 기능 재검증

---

## Phase 8: 최종 검증 및 마무리 (Day 10)
> **목표**: 프로덕션 배포 전 최종 확인

### 기능 검증 체크리스트
- [ ] ✅ 홈페이지 정상 로드
- [ ] ✅ 블로그 포스트 목록 표시
- [ ] ✅ 블로그 포스트 상세 페이지
- [ ] ✅ 카테고리별 필터링
- [ ] ✅ 태그 필터링
- [ ] ✅ 시리즈 네비게이션
- [ ] ✅ 검색 기능
- [ ] ✅ 페이지네이션
- [ ] ✅ RSS Feed 접근
- [ ] ✅ Sitemap 접근
- [ ] ✅ 이미지 로딩

### SEO 검증
- [ ] 메타 태그 확인
- [ ] Open Graph 태그
- [ ] JSON-LD 구조화 데이터
- [ ] robots.txt 확인
- [ ] sitemap.xml 확인

### 성능 최종 확인
- [ ] PageSpeed Insights 테스트
- [ ] GTmetrix 테스트
- [ ] 실제 사용자 테스트

### 문서화
- [ ] README.md 업데이트
- [ ] 배포 가이드 작성
- [ ] 콘텐츠 업데이트 가이드 작성

### 최종 배포
- [ ] main 브랜치로 PR 생성
- [ ] 코드 리뷰
- [ ] PR 머지
- [ ] 프로덕션 배포 확인

---

## 롤백 계획

### 문제 발생 시 롤백 절차
1. [ ] Netlify에서 이전 배포로 롤백
2. [ ] Git에서 이전 커밋으로 revert
3. [ ] 필요시 서버 코드 복원
4. [ ] Replit으로 임시 배포 (긴급시)

### 백업 확인
- [ ] 서버 코드 백업 위치 확인
- [ ] 데이터베이스 백업 확인
- [ ] 환경 변수 백업 확인

---

## 참고사항

### 예상 이슈 및 해결책
1. **이슈**: 빌드 시간이 너무 오래 걸림
   - **해결**: 마크다운 파싱 최적화, 병렬 처리

2. **이슈**: JSON 파일이 너무 큼
   - **해결**: 카테고리별 분할, lazy loading

3. **이슈**: 클라이언트 검색 성능 저하
   - **해결**: Web Worker 활용, 검색 인덱스 사전 생성

### 성공 지표
- [ ] 빌드 시간 < 5분
- [ ] Lighthouse 점수 90+
- [ ] 첫 페이지 로드 < 2초
- [ ] 검색 응답 시간 < 100ms

### 관련 문서
- [PRD](./prd.md)
- [Implementation Guide](./implementation.md)
- [Next.js Static Export 문서](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Netlify 문서](https://docs.netlify.com/)

---

**작성일**: 2025-10-19
**예상 완료일**: 2025-10-29
**담당자**: Development Team
**상태**: 🔄 준비 중