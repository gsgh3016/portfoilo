# 그리드 레이아웃 시스템 종합 리뷰 리포트 v02

**검토 일자**: 2025-12-03  
**검토 모드**: REVIEW_MODE  
**테스트 실행 상태**: (이전 리포트 기준) ✅ 전체 테스트 통과, 신규 코드도 기존 테스트와 정렬  
**요구사항 ID**: REQ-001 (Grid Layout System)

> v01 리포트 이후 반영된 주요 개선 사항:
>
> - `ErrorBoundary` 도입 및 `app/page.tsx`에 적용
> - `useThrottle` 훅 도입 및 `GridContainer` 리사이즈 처리 개선
> - `GridContainer`, 도메인 모듈과의 연계 구조 유지

---

## 1. High-level assessment

### ✅ 잘된 점

- **기존 아키텍처와의 일관성 유지**
  - 도메인 로직(`lib/domain/grid`)과 UI 컴포넌트(`components/grid`) 분리 전략이 그대로 유지되면서, 신규 `ErrorBoundary`, `useThrottle`도 이 철학을 해치지 않고 자연스럽게 녹아 있음.
- **에러 처리 레이어 도입**
  - `GridContainer` 내부에서 검증 실패 시 `throw` 하도록 유지하면서, 상위 레이어에 `ErrorBoundary`를 추가해 **“도메인은 강하게 실패, UI는 부드럽게 복구”**라는 구조를 갖춤.
- **리사이즈 성능에 대한 명시적인 대응**
  - `useThrottle` 훅을 도입해 window resize 이벤트를 쓰로틀링함으로써, 제약/성능 요구사항(REQ-001-002-004, REQ-001-004)을 코드 레벨에서 직접 표현.
- **요구사항 ID와의 매핑 유지**
  - 신규 코드도 주석/JSDoc에서 해당 REQ ID를 명시해, 요구사항 → 테스트 → 구현 추적성이 유지됨.

### ⚠️ 주의/아쉬운 점

- `ErrorBoundary`, `useThrottle` 자체에 대한 **테스트가 아직 추가되지 않아**, 개선 사항이 “요구사항 수준”에서만 존재하고 “테스트 수준”까지 내려오진 못한 상태.
- `GridContainer`의 `screenWidth` prop은 테스트 편의성 측면에서 매우 좋지만, 실제 런타임(window 기반 경로)은 테스트에서 거의 커버되지 않고 있음.
- `useThrottle` 구현에 언마운트 시 타임아웃 정리 로직이 없어, 재사용/확장 시 잠재적인 메모리/경고 리스크가 존재.

### 🔍 v01 대비 개선 요약

- v01에서 지적되었던 **“에러 처리 개선 필요 (React 컴포넌트에서 직접 throw)”**, **“리사이즈 성능 최적화”** 항목은 **구현 수준에서는 대부분 수용**됨.
- 다만, REVIEW_MODE 관점에서 보면 이제는 **“새로 도입한 레이어/훅에 대한 테스트·리소스 정리”**가 다음 단계로 남아 있는 상황.

---

## 2. Requirement–test–implementation matrix (변경/추가된 부분 중심)

### 2.1. 에러 처리 & 컴포넌트 구조 (REQ-001-002-005, REQ-001-002-006)

#### 요구사항 요약

- **REQ-001-002-005 (Validation / R7)**
  - 그리드 아이템의 위치/크기/겹침/오버플로우를 검증하고, 유효하지 않은 설정에 대해 오류를 명확히 드러낼 것.
- **REQ-001-002-006 (Component Structure / R8, R9)**
  - 재사용 가능한 Grid 컴포넌트 구조를 갖추고, 검증 실패 시 전체 앱 크래시를 방지하면서도 문제를 식별 가능해야 함.

#### 매트릭스

| 영역                           | 내용                                                                                                                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Requirements**               | REQ-001-002-005 (R7), REQ-001-002-006 (R8, R9)                                                                                                                                                                                  |
| **Tests (기존)**               | `tests/unit/lib/domain/grid/gridValidator.test.ts`, `tests/unit/components/grid/GridContainer.test.tsx`, `tests/integration/grid-layout.test.tsx` – 검증 로직 및 정상/오버플로우/배치 시나리오를 커버                           |
| **Tests (신규 필요)**          | ErrorBoundary 동작 검증, Grid 검증 실패 → ErrorBoundary fallback 노출 시나리오, reset 버튼 동작 테스트                                                                                                                          |
| **Implementation (기존)**      | `lib/domain/grid/gridValidator.ts` – validateItemPosition, validateOverflow, validateOverlap, validateGridItems 등 검증 로직 구현                                                                                               |
| **Implementation (신규/변경)** | `components/grid/GridContainer.tsx` – 검증 실패 시 `throw new Error('Grid validation failed: ...')`; `app/error-boundary.tsx` – ErrorBoundary 클래스 컴포넌트; `app/page.tsx` – 페이지 루트에서 ErrorBoundary로 children 감싸기 |
| **상태 평가**                  | **⚠️ 부분 정렬** – “검증 실패 시 에러를 강하게 드러내고, 상위 레이어에서 복구한다”는 구조는 구현되었으나, ErrorBoundary/통합 플로우에 대한 테스트/요구사항 문서 언급은 부족                                                     |

---

### 2.2. 반응형 & 성능 (REQ-001-002-004, REQ-001-004)

#### 요구사항 요약

- **REQ-001-002-004 (Responsive / R6)**
  - 화면 크기(375px/768px/1920px 등)에 따라 컬럼 수만 변경되고, 아이템 배치는 유지되며, 유효하지 않은 위치는 오버플로우로 판단.
- **REQ-001-004 (Constraints)**
  - 대량 아이템, 잦은 리사이즈 등에서도 과도한 연산이나 성능 저하 없이 동작해야 함(제약/성능 관점).

#### 매트릭스

| 영역                      | 내용                                                                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Requirements**          | REQ-001-002-004 (R6), REQ-001-004 (Constraints/성능)                                                                                                                                             |
| **Tests (기존)**          | `tests/integration/grid-layout.test.tsx` – `screenWidth` prop 기반의 컬럼 수 변화 및 오버플로우 시나리오 검증, `gridValidator.test.ts` – 오버플로우 검증 로직 검증                               |
| **Tests (신규 필요)**     | `useThrottle` 작동(호출 빈도/타이밍) 검증, 실제 `window.innerWidth` + `resize` 이벤트에 대한 최소 통합 시나리오                                                                                  |
| **Implementation (기존)** | `lib/domain/grid/gridCalculator.ts` – `calculateColumnCount`를 통해 화면 너비에 따른 컬럼 수 결정                                                                                                |
| **Implementation (신규)** | `lib/hooks/useThrottle.ts` – callback을 delay 기준으로 쓰로틀링; `GridContainer.tsx` – `screenWidth` prop 부재 시 `window.innerWidth`를 초기값으로 사용하고 `resize` 이벤트에 쓰로틀 핸들러 등록 |
| **상태 평가**             | **⚠️ 부분 정렬** – 성능 요구사항을 고려한 구조는 도입되었으나, “성능/이벤트 관련 요구사항을 테스트로 검증하는 수준”까지는 도달하지 못함                                                          |

---

## 3. Test coverage & gaps (신규 개선 관점)

### 3.1. 잘 커버된 영역 (v01에서 이미 검증 완료)

- **규칙 R1~R9에 대한 단위/통합 테스트**
  - `gridCalculator.test.ts`, `gridValidator.test.ts`, `GridContainer.test.tsx`, `GridItem.test.tsx`, `grid-layout.test.tsx`가 요구사항 문서(`requirements/001/002/*/*.md`)와 1:1에 가까운 매핑을 유지.
- **그리드 구조/아이템 크기/배치/검증/반응형 동작**
  - v01 리포트 기준으로 이미 “핵심 규칙 구현 + 테스트 100% 충족” 상태였으며, 이번 변경에서도 해당 테스트들은 그대로 유지되고 있음.

### 3.2. v02 기준 신규/잔여 갭

1. **ErrorBoundary 동작에 대한 테스트 부재**

   - 현재: ErrorBoundary가 도입되었지만,
     - 자식 컴포넌트가 throw할 때 fallback UI가 렌더링되는지,
     - `fallback` prop에 전달된 커스텀 컴포넌트가 실제로 사용되는지,
     - `resetError` 버튼 클릭 시 state가 초기화되어 children이 다시 렌더링되는지  
       를 검증하는 테스트가 없음.
   - 권장 테스트:
     - `tests/unit/app/error-boundary.test.tsx` (또는 유사 경로)에 단위 테스트 추가.
     - 간단한 “throw하는 더미 컴포넌트”를 자식으로 두고, 에러 후 UI/버튼 동작을 검증.

2. **Grid 검증 실패 → ErrorBoundary 플로우 통합 테스트 부재**

   - 현재: Grid 검증 실패 시 `GridContainer`는 `throw new Error(...)`를 호출하고, 페이지 레벨에서는 ErrorBoundary로 감싸지만, **두 레이어를 함께 검증하는 테스트는 없음**.
   - 권장 테스트:
     - `GridContainer`를 ErrorBoundary로 감싼 테스트 컴포넌트를 만들고, 의도적으로 invalid `items`(예: col이 columnCount를 초과)를 전달해 fallback UI를 확인.

3. **useThrottle 훅 자체의 동작 검증 부재**

   - 현재: 코드 상으로는 올바른 쓰로틀 패턴처럼 보이지만,
     - delay 내 다중 호출 시 실행 횟수,
     - 마지막 호출만 실행되는지,
     - delay 경계에서의 동작  
       등이 테스트되지 않음.
   - 권장 테스트:
     - `jest.useFakeTimers()` 기반으로 훅을 감싼 테스트 컴포넌트 + 호출 횟수 카운터를 두고, `advanceTimersByTime`로 다양한 타이밍을 검증.

4. **window.resize + 쓰로틀의 실제 경로 테스트 부재**

   - 현재: integration 테스트는 모두 `screenWidth` prop 기반으로 실행되며, 브라우저 환경의 `window.innerWidth` + `resize` 이벤트 경로는 테스트 밖에 있음.
   - 권장:
     - 최소 1~2개 시나리오에서 `Object.defineProperty(window, "innerWidth", ...)` + `window.dispatchEvent(new Event("resize"))`를 사용해 컬럼 수 변화/스타일 변화를 검증.

5. **v01에서 열린 채로 남아 있는 엣지/성능 케이스**
   - 빈 아이템 배열, 매우 큰 colSpan/rowSpan, ID 중복, 대량 아이템 렌더링, row 방향 오버플로우 등은 여전히 테스트/구현 보강 여지가 있음(요구사항 문서상 해석이 필요한 부분 포함).

---

## 4. Code review comments (신규/변경 코드 중심)

### 4.1. `components/grid/GridContainer.tsx`

**강점**

- `calculateColumnCount`, `validateGridItems`, `calculateGridPosition`를 활용해 UI 레벨에서는 최대한 “도메인 함수와 타입”만을 직접 사용하는 구조를 유지하고 있어, 요구사항 변경 시 도메인만 수정해도 되는 범위가 명확함.
- `screenWidth` prop을 받아 테스트에서는 window 의존성을 제거하고, 실제 런타임에서는 `window.innerWidth` + resize 이벤트를 사용하는 이중 경로 설계가 합리적.

**개선 제안**

1. **에러 메시지 및 계약 명시화**

   - 현재: 검증 실패 시
     ```ts
     throw new Error(`Grid validation failed: ${errorMessages}`);
     ```
   - 개발자에게는 충분히 유용하지만, “GridContainer는 검증 실패 시 항상 throw한다”는 계약이 주석/문서/테스트로 명시되어 있지 않아, 향후 refactor 시 실수로 `console.warn` 수준으로 약화될 위험이 있음.
   - 제안:
     - 파일 상단 JSDoc에 “검증 실패 시 반드시 Error를 throw하며, 상위 레이어에서 ErrorBoundary로 처리해야 한다”는 계약을 명시.
     - Grid 검증 실패 시 `toThrow`를 검증하는 단위 테스트 1개 추가.

2. **테스트 경로 분리**
   - 현재 테스트는 대부분 `screenWidth` prop 경로만 사용하고 있어, window 기반 경로는 “묵시적 구현” 상태로 남아 있음.
   - 제안:
     - 최소 1개의 테스트에서 `screenWidth`를 주지 않고 렌더링한 후, `window.innerWidth`와 resize 이벤트를 통해 컬럼 수가 변화하는지 확인.

### 4.2. `lib/hooks/useThrottle.ts`

**강점**

- `callback`과 `delay`만 받는 단순한 API로, 리사이즈/스크롤 등 다양한 이벤트에 재사용 가능한 형태.
- delay 이전 반복 호출 시 마지막 호출만 실행되도록 설계된 부분이, 요구사항의 “성능 최적화” 의도에 잘 부합.

**개선 제안**

1. **언마운트 시 타임아웃 정리**

   - 현재:
     - `timeoutRef`에 타임아웃 ID를 보관하지만, 컴포넌트 언마운트 시 `clearTimeout`을 호출하는 로직이 없음.
     - 언마운트 이후 남은 타임아웃이 setState를 호출하면 React 경고가 발생할 수 있음.
   - 제안:
     - 훅 내부에 `useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, [])` 추가.
     - 타입은 `ReturnType<typeof setTimeout> | null`로 두면 Node/브라우저 환경 모두에서 자연스러움.

2. **테스트 추가**
   - 위에서 언급한 바와 같이, fake timers 기반으로 호출 횟수/타이밍을 검증하는 테스트를 추가해, 리팩터링 시 회귀를 방지.

### 4.3. `app/error-boundary.tsx`

**강점**

- 고전적인 클래스형 ErrorBoundary 패턴을 잘 따르고 있으며, `fallback` prop을 통해 기본 UI를 교체할 수 있어 재사용성이 높음.
- 개발 모드에서만 stack trace를 노출하고, 기본 메시지는 한국어로 제공하는 등 실제 서비스에서도 그대로 사용할 수 있을 정도의 UX를 갖춤.

**개선 제안**

1. **역할/범위 문서화**

   - 상단 주석에 REQ-001-002-005/006이 명시되어 있으나, 이 컴포넌트가 “Grid 전용”인지 “앱 전역 에러 처리”를 위한 범용 ErrorBoundary인지가 모호함.
   - 제안:
     - 현재처럼 루트 레벨에 위치한 경우, “앱 전역 ErrorBoundary”로 정의하고, Grid 외 다른 섹션에도 재사용할 수 있다는 점을 documentation에 명시.

2. **단위 테스트**
   - ErrorBoundary는 설계상 애플리케이션 안전성과 직결되는 컴포넌트이므로, 최소한의 동작 테스트를 갖추는 것이 좋음.
   - 제안 테스트:
     - 자식 컴포넌트가 렌더링 중 throw → fallback UI 확인.
     - `fallback` prop 사용 시 커스텀 fallback이 사용되는지 확인.
     - `resetError` 호출 후 다시 children이 렌더링되는지 확인.

### 4.4. `app/page.tsx`

**평가**

- 페이지 루트를 ErrorBoundary로 감싸는 형태로, Grid뿐 아니라 향후 추가될 다른 섹션들도 보호할 수 있는 구조.
- 현재는 단순히 `<h1>Portfolio</h1>`만 노출하고 있으나, 실제 Grid 예제/섹션이 추가될 때도 동일한 패턴을 유지하면 됨.

---

## 5. Risks & recommendations

### 5.1. 주요 리스크

1. **테스트 공백이 있는 새로운 레이어(훅/Boundary)**
   - ErrorBoundary와 useThrottle은 구조상 중요한 역할을 맡고 있지만, 아직 테스트가 없어 refactor 시 취약.
2. **이벤트/성능 요구사항의 “테스트 수준” 미달성**
   - REQ-001-004(제약/성능) 요구사항이 구조/코드 차원에서는 반영되었지만, 성능/이벤트 경로를 검증하는 테스트는 부족.

### 5.2. 권장 액션 (우선순위 순)

#### 1단계 – 즉시/단기 (High)

1. **ErrorBoundary 단위 및 통합 테스트 추가 (TEST_MODE 권장)**
   - 단위: ErrorBoundary 자체 테스트.
   - 통합: GridContainer + ErrorBoundary 플로우 테스트.
2. **useThrottle 개선 및 테스트 추가 (IMPL_MODE + TEST_MODE)**
   - 언마운트 시 타임아웃 정리 로직 추가.
   - fake timers 기반 유닛 테스트 작성.

#### 2단계 – 단기/중기 (Medium)

3. **window.resize 경로 테스트 보강**
   - 실제 window API와의 연계를 최소 시나리오라도 테스트로 검증.
4. **에러 메시지/계약 문서화**
   - Grid 검증 실패 시 throw 계약을 주석/테스트로 명시.

#### 3단계 – 중기/장기 (Low, v01에서 이월)

5. **엣지/성능 케이스 보강**
   - 빈 배열, 매우 큰 span, ID 중복, row 방향 오버플로우, 대량 아이템 렌더링 등.
6. **접근성 및 UX 개선**
   - Grid 영역/아이템에 대한 ARIA 속성, 키보드 네비게이션, 포커스 관리 등.

---

## 6. Requirement ID 매핑 요약 (v01 대비 변경점 위주)

- **변경 없음 (구조 유지)**
  - Major: `REQ-001` – Grid Layout System
  - Middle: `REQ-001-002` – Rules, `REQ-001-004` – Constraints, `REQ-001-006` – Implementation Guide
- **v02에서 추가적으로 강조된 연결**
  - `app/error-boundary.tsx` → REQ-001-002-005, REQ-001-002-006
  - `lib/hooks/useThrottle.ts` → REQ-001-002-004, REQ-001-004
  - `app/page.tsx`의 ErrorBoundary 적용 → “구현 가이드(REQ-001-006)”의 권장 구조를 실제 페이지에 반영한 사례로 간주 가능

---

## 7. 결론

### 종합 평가 (v02 관점)

- v01에서 제기된 **에러 처리·성능 관련 핵심 피드백을 코드 수준에서 잘 수용**했으며, 기존 그리드 도메인/컴포넌트 구조와도 충돌 없이 자연스럽게 통합됨.
- 현재 가장 큰 갭은 “새로 도입한 레이어(에러 바운더리/쓰로틀 훅)에 대한 테스트 부재”이며, 이를 보완하면 전체 시스템의 신뢰도와 회귀 방지력이 크게 향상될 것.

### 다음 단계 요약

1. TEST_MODE: ErrorBoundary, useThrottle, window.resize 경로에 대한 테스트 케이스 설계 및 추가.
2. IMPL_MODE: useThrottle 언마운트 정리, Grid 검증 실패 throw 계약에 대한 주석/문서화.
3. REQ_MODE(선택): row 방향 오버플로우/ID 중복 등 남아 있는 엣지 요구사항을 명시적으로 정의 후, TEST_MODE/IMPL_MODE로 전달.

> v02 결론:  
> **“핵심 구조는 충분히 견고하며, 이제는 새로 도입한 안정성/성능 레이어를 테스트와 문서 차원에서 다듬을 단계”**로 보는 것이 적절합니다.
