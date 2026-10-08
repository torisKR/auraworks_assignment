# SEO · AI SEO · GEO 구현

## 현재 사이트의 정체성

이 사이트는 제공된 히든카이스 디자인을 재현한 AuraWorks 과제용 데모입니다. 실제 브랜드 공식 사이트, 판매자, AI 분석 서비스로 소개하지 않습니다. 제목·설명·구조화 데이터·`llms.txt`에서도 같은 범위를 안내합니다. 교재 목록과 상세 정보는 기존 요구대로 Supabase에서 CSR로 조회합니다.

## 적용한 설정

| 설정                          | 구현 위치                                                | 목적                                                                                   |
| ----------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 대표 주소와 페이지 메타데이터 | `src/lib/site.ts`, 각 `app/**/page.tsx`                  | canonical, 개별 제목·설명, 한국어 Open Graph와 Twitter 공유 이미지                     |
| 크롤링 안내                   | `src/app/robots.ts`                                      | 공개 페이지 접근 허용, Preview 배포는 전체 크롤링 제외                                 |
| 사이트맵                      | `src/app/sitemap.ts`                                     | 색인 대상으로 정한 대표 URL만 제공                                                     |
| 사이트 설명 JSON-LD           | `src/app/layout.tsx`                                     | 과제용 데모임을 명시한 `WebSite`                                                       |
| 공개 FAQ                      | `src/data/demo-faq.ts`, `components/layout/demo-faq.tsx` | 소개 페이지에서 실제 보이는 질문·답변과 동일한 `FAQPage`                               |
| AI용 링크 안내                | `src/app/llms.txt/route.ts`                              | 공개 페이지와 구현 범위를 짧은 텍스트로 제공                                           |
| Markdown 안내                 | `src/app/site-guide.md/route.ts`                         | 같은 FAQ 원문을 텍스트로 제공, 중복 검색 노출은 `X-Robots-Tag: noindex, follow`로 제외 |

`NEXT_PUBLIC_SITE_URL`은 대표 도메인입니다. 기본값은 현재 Production 도메인이며, 커스텀 도메인으로 이전하면 환경변수를 바꾸고 다시 빌드합니다. Vercel의 배포별 임시 호스트를 canonical로 사용하지 않습니다.

`/`와 `/store`는 동일한 화면이므로 canonical을 `/`로 통일하고 사이트맵에 중복해서 넣지 않습니다. `/about`, `/ai-omr`, `/challenges`는 각 URL을 대표 주소로 사용합니다. 실제 회사·정책으로 오해하기 쉬운 예시 페이지와 로그인은 `noindex, follow`를 적용합니다.

## CSR 교재와 검색 노출의 경계

교재 상세는 더미 상품이며 서버 HTML에는 Supabase 조회 결과가 포함되지 않습니다. 따라서 이름·가격·재고·실제 구매 후기처럼 서버에서 검증하지 않은 `Product`, `Offer`, `AggregateRating`을 생성하지 않습니다. 현재 상세 경로도 `noindex, follow`입니다. 순수 CSR 과제 요구를 지키면서, 소개와 기능 설명은 서버 HTML로 읽을 수 있도록 구성했습니다.

실제 판매 서비스를 구현할 때는 동일한 데이터 접근 계층을 통해 서버에서 상품 존재와 공개 상태를 확인하고, `generateMetadata`·사이트맵·상품 JSON-LD에 실제 데이터를 연결합니다. 화면의 CSR 검색을 유지하더라도 상품별 공개 정보와 메타데이터는 별도로 제공할 수 있습니다. 리뷰 수나 판매량을 꾸며 넣지 않습니다.

FAQ의 화면 내용과 JSON-LD 및 Markdown은 같은 `demoFaq` 데이터를 사용합니다. JSON-LD를 HTML에 넣기 전에 `<`를 이스케이프해 문자열 안의 HTML 태그가 스크립트 경계를 깨지 않도록 합니다. `FAQPage`가 있다고 Google FAQ 리치 결과가 보장되는 것은 아닙니다.

## AI 검색에 관한 설명

`llms.txt`는 방문자와 에이전트가 사이트의 공개 내용을 찾기 쉽게 하는 보조 안내입니다. 모든 AI 서비스가 이 파일을 읽는다는 보장이나 검색 순위 향상 수치는 제시하지 않습니다. Google은 AI 검색을 위해 별도 AI 파일이나 특별한 마크업이 필요하지 않다고 안내합니다. 읽기 쉬운 실제 내용, 접근 가능한 HTML, 정확한 제목과 canonical을 우선했습니다.

`robots.txt`는 접근 안내이고 접근 제어가 아닙니다. 회원 정보나 주문 데이터가 생기면 서버 인증과 RLS로 보호해야 합니다. OpenAI의 검색용 `OAI-SearchBot`과 학습용 `GPTBot`은 역할이 다르므로 향후 크롤러 정책을 바꿀 때 구분합니다. 현재는 공개 데모 콘텐츠에 공통 접근 규칙을 사용합니다.

## 검증과 운영

1. 프로덕션 빌드가 생성한 HTML에서 canonical·description·OG·JSON-LD를 확인합니다.
2. `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/site-guide.md`의 공개 응답과 링크를 확인합니다.
3. 소개 페이지의 FAQ가 JavaScript 실행 전 HTML에도 있는지 확인합니다.
4. 배포 뒤 대표 도메인이 최신 소스를 제공하는지, Preview가 색인 제외되는지 확인합니다.
5. 실서비스 전환 후 Search Console 소유권을 확인하고 사이트맵을 제출합니다. 현재 Search Console 등록·검색엔진 색인·AI 답변 인용 여부는 확인하지 않았습니다.

Google 검색 및 AI 검색의 실제 노출은 별도로 측정해야 합니다. 설정 파일 생성과 배포 성공을 인용 성공으로 표현하지 않습니다. 주기적으로 사이트의 기능과 FAQ가 일치하는지 검토하고, 중요한 검색 질문에 대한 실제 검색 결과와 유입을 기록합니다.

## 면접에서 설명하기

> 과제 요구인 Supabase CSR 조회는 유지했습니다. 검색엔진과 AI가 읽을 수 있는 프로젝트 소개는 서버 HTML로 제공하고, 페이지 메타데이터와 사이트맵은 한 곳의 대표 URL 설정을 공유합니다. 동일 화면인 홈과 스토어의 canonical을 통일했고, 더미 상품을 실제 판매 정보로 오인하게 만드는 상품·평점 스키마는 생성하지 않았습니다. FAQ의 화면·구조화 데이터·Markdown은 같은 데이터를 사용해 내용이 어긋나는 것을 줄였습니다.

## 참고한 공식 자료

- [Google: 생성형 AI 검색 최적화 안내](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Next.js: Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js: robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Next.js: sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [OpenAI: 크롤러별 역할과 robots.txt](https://developers.openai.com/api/docs/bots)
- [llms.txt 제안 사양](https://llmstxt.org/)
