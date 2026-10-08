# GitHub와 Vercel 배포

## 저장소

대상은 public 저장소 `torisKR/auraworks_assignment`입니다. 기존 README와 원격 커밋을 보존하고 force push는 사용하지 않습니다. `.env.local`, `.vercel`, `node_modules`, `.next`, 제출용 bundle은 올리지 않습니다.

## Vercel 프로젝트

- 프로젝트: `auraworks-assignment`
- Production URL: https://auraworks-assignment-seven.vercel.app
- 2026-10-08: `f51d1ef`의 페이지·검색 기능, `6a50378`의 SEO·모션 구현 배포 성공. 각 GitHub CI Success와 실제 사이트 확인

1. 로그인한 Vercel 계정에서 **Add New → Project**를 선택합니다.
2. `torisKR/auraworks_assignment`를 Import합니다.
3. Framework Preset은 **Next.js**, Root Directory는 저장소 루트로 설정합니다.
4. Node.js 24를 선택하고 Install Command는 `pnpm install --frozen-lockfile`, Build Command는 `pnpm build`로 설정합니다.
5. 공개 Supabase 환경변수 두 개를 Preview와 Production에 입력합니다. 대표 주소를 바꾸려면 `NEXT_PUBLIC_SITE_URL`도 설정합니다(현재 Production 주소가 코드 기본값입니다).

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

secret/service-role 키는 입력하지 않습니다. `NEXT_PUBLIC_*`는 빌드 시 번들에 포함되므로 환경변수를 변경한 뒤 반드시 다시 배포합니다.

## 완료 기준

- GitHub에 구현 파일과 Conventional Commits 이력이 올라와 있어야 합니다.
- Vercel의 상태가 `Ready`여야 합니다.
- 실제 배포 URL에서 배너·교재 12개가 표시되어야 합니다.
- 교재 조회가 브라우저의 Supabase REST 요청으로 이루어져야 합니다.
- 검색, 필터, 빈 결과, 상세 페이지, 장바구니 동작을 확인합니다.
- 모바일 레이아웃과 콘솔 오류를 확인합니다.
- 확인한 URL과 범위를 README에 반영합니다.

## 환경 제한

초기 작업 환경에서는 원본 폴더의 `.git` 쓰기, 외부 DNS, localhost listen이 제한되어 있습니다. 구현·빌드는 로컬에서 진행했고 별도 제출용 체크아웃에 중간 커밋을 생성했습니다. 현재 원격 게시에는 별도 제출용 체크아웃을 사용해 기존 이력을 보존하고 push했습니다. 원본 작업 폴더의 `.git`은 이 실행 환경에서 읽기 전용이므로, 일반 터미널의 동기화 스크립트로 연결할 수 있습니다. 원격 push가 막힐 때는 검증한 Git bundle도 사용할 수 있습니다.

```bash
bash scripts/publish-from-bundle.sh
```

스크립트는 bundle을 별도 임시 폴더로 clone하고 기존 GitHub 이력과 병합한 뒤 main을 push합니다. 기존 원격 README는 별도 문서로 보존합니다. 예상하지 않은 파일 충돌이 생기면 멈춥니다. 작업 중인 원본 폴더나 브라우저 세션을 지우지 않습니다.

최초 게시 이후 원본 작업 폴더에서 미추적 파일 충돌로 pull이 거부된다면 `bash scripts/sync-checkout.sh`를 사용합니다. 소스를 백업한 뒤 커밋 없는 로컬 main에 원격 이력을 연결하고 pull·commit·push를 수행합니다. 이미 커밋이 있는 저장소에는 reset을 적용하지 않습니다.
