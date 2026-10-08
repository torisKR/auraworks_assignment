# 추가 검증 결과와 남은 확인 항목

검증일: 2026년 10월 8일, 한국 시간. 대상은 [Production 사이트](https://auraworks-assignment-seven.vercel.app)입니다. 이 문서는 구현 완료와 외부 서비스의 실제 노출을 구분하기 위한 기록입니다.

## 모바일 스와이프

Aside의 Chromium 기기 모드에서 너비 390px, `pointerType: touch` 입력으로 기존 배포의 문제를 재현했습니다. 이미지에서 시작한 왼쪽 드래그의 좌표는 `(304, 201) → (79, 201)`이었고, 슬라이드는 1에서 바뀌지 않았습니다.

이벤트 순서는 `pointerdown(IMG) → pointermove(IMG) → lostpointercapture(IMG) → pointerup(DIV)`였습니다. 터치의 암시적 캡처가 이미지에서 캐러셀 영역으로 넘어갈 때 이미지의 `lostpointercapture`가 버블링했고, 기존 핸들러가 이를 전체 제스처 취소로 처리했습니다.

`src/components/store/hero-banner.tsx`에서 캐러셀 영역 자체가 캡처를 잃은 경우에만 취소하도록 수정했습니다. `pointercancel` 처리는 유지합니다. 수정 커밋은 `79e208a`이며, ESLint·TypeScript·기존 단위 테스트 12개·포맷 검사·Production 빌드가 통과했습니다. 단위 테스트 12개는 검색·카탈로그·JSON-LD 검증이며 터치 제스처 테스트를 뜻하지 않습니다.

수정 후 Production 배포에서 같은 입력으로 재검증했습니다.

| 입력                                                               | 관찰한 결과                                             |
| ------------------------------------------------------------------ | ------------------------------------------------------- |
| 390px, 이미지에서 왼쪽 터치 드래그 `(304, 201) → (79, 201)`        | 활성 슬라이드 `1 → 2`                                   |
| 새로고침 후 이미지에서 오른쪽 터치 드래그 `(79, 201) → (304, 201)` | 활성 슬라이드 `1 → 5`, 첫·마지막 순환                   |
| 이동 후 상태                                                       | `data-dragging=false`, 화면 너비와 문서 너비 모두 `390` |

두 입력 모두 `pointerType=touch`와 이미지의 캡처 상실 이벤트를 실제로 관찰했습니다. 이전과 같은 이벤트 순서에서도 전환되는 것을 확인했습니다. [수정 커밋의 CI](https://github.com/torisKR/auraworks_assignment/actions/runs/37732427663)는 Success이고 Vercel Production 배포도 성공했습니다.

편집 슬라이드에서 이어지는 일부 자동화 드래그는 `pointermove` 없이 `pointerdown`·`pointerup`만 전달됐으므로 성공으로 기록하지 않았습니다. 짧은 드래그·세로 스크롤의 추가 조작은 브라우저 사용자 입력 감지로 중단됐습니다. 이 항목들과 320px 터치 이동은 추가 확인 대상으로 남깁니다. 이전의 320px 가로 넘침 검증은 터치 이동 검증과 별개입니다.

### 실제 휴대전화 확인의 제한

ADB 기기 목록 조회를 시도했지만 ADB 서버가 `could not install *smartsocket* listener: Operation not permitted`로 시작하지 못했습니다. 연결된 기기 유무도 확인할 수 없었습니다. 브라우저 터치 에뮬레이션을 실제 Android/iOS 기기 검증으로 표현하지 않습니다.

실기기에서는 사이트를 열고 이미지 중앙에서 좌우 스와이프, 첫·마지막 슬라이드 순환, 짧은 드래그의 복귀, 세로 스크롤, 배너 링크 탭을 확인해야 합니다. 기기명·OS·브라우저 버전과 이동 전후 슬라이드 번호를 함께 기록합니다.

## 검색엔진 노출과 공식 색인 상태

| 확인 방법                                                    | 관찰 결과                            | 해석                                |
| ------------------------------------------------------------ | ------------------------------------ | ----------------------------------- |
| Google의 `site:auraworks-assignment-seven.vercel.app` 검색   | 일치하는 검색결과가 없다는 화면 확인 | 해당 질의에서 노출을 확인하지 못함  |
| 검색 도구의 도메인·정확한 URL·`AuraWorks Supabase 교재` 질의 | 모두 결과 없음                       | 해당 검색 도구와 질의의 범위에 한정 |
| Google Search Console의 해당 URL-prefix 속성 접근            | `이 속성에 액세스할 수 없습니다`     | 현재 세션에서 공식 URL 검사 불가    |
| Bing의 같은 `site:` 검색                                     | 사람 확인 CAPTCHA 표시               | 결과를 판정하지 않음                |

Google은 `site:` 결과가 전체 색인을 나타내지 않으며, URL이 결과에 없어도 URL 검사 도구로 확인하라고 안내합니다. 따라서 현재 상태를 "미색인 확정"으로 표현하지 않습니다. 해당 속성의 소유권 또는 접근 권한을 갖춘 뒤 `/`, `/about`, `/ai-omr`, `/challenges`를 URL 검사하고 사이트맵 처리 상태를 확인해야 합니다. 속성 권한이나 소유권을 임의로 추가하지 않았습니다.

## 실제 AI 답변의 출처

Perplexity에서 URL을 제공하지 않고 다음 질문으로 웹 검색했습니다.

> 웹 검색으로 AuraWorks 히든카이스 Next.js Supabase 교재 스토어 과제 데모 사이트를 찾아줘. 공개 웹 출처만 사용하고, 찾지 못하면 찾지 못했다고 답해줘.

답변은 공개 데모 사이트를 찾지 못했다고 밝혔으며, [프로젝트 GitHub 저장소](https://github.com/torisKR/auraworks_assignment)를 실제 출처 링크로 제시했습니다. 이는 저장소의 발견·인용 증거이며 배포 도메인의 인용 성공을 뜻하지 않습니다. 답변에 배포 도메인의 출처는 없었습니다.

별도 후속 질문에 `/about` URL을 직접 제공했을 때도 Perplexity는 페이지를 가져오지 못했다고 답했습니다. 직접 URL을 제공하는 테스트는 자연 검색에서의 발견 여부와 구분합니다. 현재 검색 도구 역시 해당 URL을 열지 못했습니다. 다른 AI 서비스 전체의 상태나 실패 원인을 이 결과만으로 단정하지 않습니다.

### 공개 HTTP 응답과 AI 도구 접근은 별도 확인

동일한 소개 URL을 `curl`로 요청하면 HTTP 200과 실제 소개·Supabase FAQ·JSON-LD가 반환됐습니다. `Googlebot`, `OAI-SearchBot`, `PerplexityBot` 문자열을 User-Agent로 지정한 요청도 HTTP 200, `index, follow`, 실제 FAQ 본문을 반환했고 보안 체크포인트 화면은 없었습니다.

이는 지정한 HTTP 요청의 응답 증거입니다. 실제 업체 크롤러의 IP·수집 로그를 확인한 것이 아니므로 크롤링·색인·AI 인용 완료를 증명하지 않습니다. 공개 HTML이 정상이어도 외부 도구의 접근 실패 원인은 별도로 조사해야 합니다.

## 면접에서 설명할 내용

> 구현과 빌드 성공만으로 모바일 동작이나 AI 노출을 완료로 판단하지 않았습니다. 실제 브라우저의 터치 이벤트 순서를 기록해 암시적 포인터 캡처 전환이 스와이프를 취소하는 문제를 찾아 수정했습니다. 공개 HTML 제공, 검색 노출, Search Console의 색인 상태, AI 답변의 출처는 각각 별도의 증거로 판단했습니다. 실기기와 권한이 필요한 검사는 확인 한계를 문서에 남겼습니다.

## 참고 자료

- [W3C Pointer Events: 암시적 포인터 캡처](https://www.w3.org/TR/pointerevents3/#implicit-pointer-capture)
- [Google: site 검색 연산자의 제한](https://developers.google.com/search/docs/monitor-debug/search-operators/all-search-site)
- [Google Search Console: URL 검사 도구](https://support.google.com/webmasters/answer/9012289?hl=ko)
- [OpenAI: 검색 및 학습 크롤러의 역할](https://developers.openai.com/api/docs/bots)
