# 커뮤니티 게시판

Reddit 스타일의 커뮤니티 게시판입니다. Next.js, Tailwind CSS, Supabase로 구축되었습니다.

## 🚀 기능

- ✅ 회원가입 / 로그인 / 로그아웃
- ✅ 게시글 작성 / 수정 / 삭제
- ✅ 댓글 작성 / 수정 / 삭제
- ✅ 좋아요 / 싫어요 (투표 시스템)
- ✅ 게시글 검색
- ✅ 내 정보 페이지 (작성한 게시글/댓글 확인)

## 🛠️ 기술 스택

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Date Formatting**: date-fns

## 📦 설치 및 실행

### 1. 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 아래 내용을 입력하세요:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://epxzidpmbgzmiwdmwiso.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweHppZHBtYmd6bWl3ZG13aXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MDI2MzEsImV4cCI6MjA3NjQ3ODYzMX0.nJAo3D5tYk9D2Bn3eh1nhZrDJbDUnqsOw6YEfUX9W4c
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweHppZHBtYmd6bWl3ZG13aXNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDkwMjYzMSwiZXhwIjoyMDc2NDc4NjMxfQ.2-MjlhbuYqZ8aYc1mHFIXm008a5PlXxUQPrP6qR0Bbg
\`\`\`

### 2. 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 3. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🗄️ 데이터베이스 스키마

데이터베이스는 이미 Supabase MCP를 통해 설정되었습니다:

- **profiles**: 사용자 프로필 정보
- **posts**: 게시글
- **comments**: 댓글
- **post_votes**: 게시글 투표 (좋아요/싫어요)

모든 테이블에 Row Level Security (RLS) 정책이 적용되어 있습니다.

## 📁 프로젝트 구조

\`\`\`
reddit/
├── app/                      # Next.js App Router 페이지
│   ├── login/               # 로그인 페이지
│   ├── signup/              # 회원가입 페이지
│   ├── post/
│   │   ├── create/          # 글쓰기 페이지
│   │   └── [id]/            # 게시글 상세 페이지
│   │       └── edit/        # 게시글 수정 페이지
│   ├── profile/             # 내 정보 페이지
│   ├── search/              # 검색 결과 페이지
│   └── page.tsx             # 메인 게시판
├── components/              # React 컴포넌트
│   ├── Header.tsx           # 헤더 (네비게이션)
│   ├── PostList.tsx         # 게시글 목록
│   ├── VoteButtons.tsx      # 투표 버튼
│   ├── CommentSection.tsx   # 댓글 섹션
│   └── ...
├── lib/
│   ├── supabase/            # Supabase 클라이언트 설정
│   └── types/               # TypeScript 타입 정의
└── middleware.ts            # 인증 미들웨어
\`\`\`

## 🎨 주요 디자인

- Reddit 스타일의 투표 시스템 (⬆ ⬇)
- 깔끔하고 모던한 UI
- 반응형 디자인
- Orange 컬러 테마

## 📝 라이센스

MIT
