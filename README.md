# AuraWorks Assignment — HIDDEN KICE

제공된 히든카이스 스토어 화면을 Next.js App Router로 구현한 과제입니다. 교재 정보는 Supabase PostgreSQL에 저장하고, 브라우저에서 조회해 표시합니다.

- GitHub: https://github.com/torisKR/auraworks_assignment
- Supabase: 과제 전용 `auraworks_assignment` 프로젝트
- Vercel: 배포 연결 진행 중. 실제 배포가 확인되면 URL을 기록합니다.

## 구현 범위

- 원본 배너·단품·패스 에셋을 활용한 헤더, 배너, 4열 교재 목록, 푸터
- 데스크톱 4열, 태블릿 3열, 모바일 2열 반응형 레이아웃
- 제목·과목 검색과 전체 / 패스 / 단품 필터
- Supabase에서 CSR로 교재 12개 조회
- 로딩 스켈레톤, 빈 목록, 검색 결과 없음, 조회 실패 및 재시도
- 교재 상세 모달과 세션 내 임시 장바구니 담기·삭제·합계
- 키보드 포커스, 검색 레이블, 필터 상태, `dialog`, reduced-motion 지원

AI OMR, 챌린지, 로그인, 약관 전문, 주문·결제는 안내만 제공하는 데모 범위입니다. 장바구니는 새로고침하면 초기화됩니다. 실제 판매 기능으로 오해하지 않도록 상세 안내를 표시합니다.

## 실행

Node.js 22 이상과 pnpm 11.6.0을 사용합니다.

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
```

`.env.local`에 아래 두 값을 설정합니다. 키 값은 저장소에 올리지 않습니다.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

```bash
pnpm dev
# http://localhost:3000
```

설정이 없거나 조회에 실패하면 오류와 재시도 UI가 표시됩니다. 실제 Supabase 조회 대신 로컬 배열을 보여 주는 fallback은 없습니다.

## 데이터베이스 재현

새 Supabase 프로젝트의 SQL Editor에서 순서대로 실행합니다.

1. `supabase/migrations/20261008023540_create_textbooks.sql`
2. `supabase/seed.sql`
3. `supabase/verify.sql`

검증 기대값은 교재 `12`, 단품 `3`, 패스 `9`, RLS `true`, 익명 SELECT `true`, INSERT/UPDATE/DELETE `false`입니다. seed는 같은 ID의 더미 교재를 갱신하므로 반복 실행할 수 있습니다. 스키마 migration은 새 프로젝트에서 한 번 적용합니다.

현재 과제용 원격 프로젝트에 스키마와 seed를 적용했습니다. SQL Editor에서 `anon` 역할로 12개 조회와 쓰기 권한 차단을 확인했습니다. 브라우저의 REST 호출 및 실제 페이지 표시는 배포 후 별도로 확인해야 합니다.

제공 화면에는 정가 76,000원, 판매가 64,800원, 5% 배지가 함께 표시되어 있습니다. 화면 재현을 위해 이 값을 그대로 저장했습니다. 실제 할인율 계산을 적용하려면 할인 정책과 표시값을 먼저 일치시켜야 합니다.

## 구조

```text
src/
  app/                  # 라우팅, 메타데이터, 전역 스타일
  components/store/     # UI와 스토어 인터랙션
  hooks/use-textbooks.ts # 비동기 상태, 요청 취소, 재시도
  lib/
    supabase.ts         # typed browser client
    textbooks.ts        # SELECT 쿼리
    catalog.ts          # 순수 검색/필터/가격 함수
    catalog.test.ts     # 핵심 로직 테스트
  types/database.ts     # 교재·데이터베이스 계약
public/images/          # 원본 제공 이미지
supabase/               # migration, seed, 권한 검증 SQL
scripts/                # 원격 조회 검증
docs/                   # 설계·면접·배포 설명
```

자세한 설명은 [설계 문서](docs/architecture.md), [면접 준비](docs/interview.md), [배포 안내](docs/deployment.md)를 참고하세요.

## 검증

```bash
pnpm check             # ESLint + TypeScript + unit tests
pnpm build             # Next.js production build
pnpm verify:supabase   # 실제 익명 REST 조회 및 seed 검증
```

GitHub Actions에서도 lint, typecheck, unit tests, build를 실행합니다. 빌드 통과는 Supabase 연결 성공이나 UI 검증을 대신하지 않습니다. 테스트는 공백·대소문자·한글 정규화, 카테고리와 검색의 교집합, 빈 결과, 입력 불변성, 원화 표시를 다룹니다.

## 커밋 규칙

Conventional Commits의 `type(scope): subject`를 사용하고 설정, 화면, DB, 테스트, 리팩터링, 문서를 독립 커밋으로 남깁니다. [`AGENTS.md`](AGENTS.md)에 개발 규칙을 기록했습니다.

## 참고 문서

- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase JavaScript SELECT](https://supabase.com/docs/reference/javascript/select)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Vercel 환경변수](https://vercel.com/docs/environment-variables)
