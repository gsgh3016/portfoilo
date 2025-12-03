# 그리드 레이아웃 시스템 테스트 개요

## 테스트 개요

그리드 레이아웃 시스템의 모든 규칙(R1~R9)을 검증하는 테스트 스위트입니다.

### 테스트 레벨

1. **도메인/유닛 테스트** (`tests/unit/`)

   - 검증 로직 (겹침 검증, 오버플로우 검증, 유효성 검증)
   - 계산 함수 (컬럼 수 계산, 픽셀 크기 계산)
   - 유틸리티 함수

2. **컴포넌트 테스트** (`tests/unit/components/`)

   - GridContainer 컴포넌트
   - GridItem 렌더링 및 스타일 적용

3. **통합 테스트** (`tests/integration/`)
   - 전체 그리드 시스템 동작
   - 반응형 동작 검증

---

## 테스트 케이스 리스트

### R1. 그리드 컬럼 너비

| ID      | 규칙 | 테스트 케이스                           | 관련 파일                |
| ------- | ---- | --------------------------------------- | ------------------------ |
| TS-R1.1 | R1.1 | 컬럼 너비가 150px로 고정되는지 검증     | `grid-structure.test.ts` |
| TS-R1.2 | R1.2 | 모든 환경에서 컬럼 너비가 동일한지 검증 | `grid-structure.test.ts` |
| TS-R1.3 | R1.3 | 화면 너비에 따른 컬럼 수 자동 조정 검증 | `grid-structure.test.ts` |
| TS-R1.4 | R1.3 | 최소 컬럼 수 보장 (제약사항 반영)       | `gridCalculator.test.ts` |

### R2. 그리드 행 높이

| ID      | 규칙 | 테스트 케이스                       | 관련 파일                |
| ------- | ---- | ----------------------------------- | ------------------------ |
| TS-R2.1 | R2.1 | 행 높이가 150px로 고정되는지 검증   | `grid-structure.test.ts` |
| TS-R2.2 | R2.2 | 행 높이와 컬럼 너비가 동일한지 검증 | `grid-structure.test.ts` |

### R3. 그리드 아이템 크기

| ID      | 규칙 | 테스트 케이스                | 관련 파일             |
| ------- | ---- | ---------------------------- | --------------------- |
| TS-R3.1 | R3.1 | 다양한 크기 아이템 지원 검증 | `item-sizing.test.ts` |
| TS-R3.2 | R3.2 | 셀 단위 크기 지정 검증       | `item-sizing.test.ts` |
| TS-R3.3 | R3.3 | 실제 픽셀 크기 계산 검증     | `item-sizing.test.ts` |

### R4. 그리드 아이템 배치

| ID      | 규칙 | 테스트 케이스                    | 관련 파일                |
| ------- | ---- | -------------------------------- | ------------------------ |
| TS-R4.1 | R4.1 | 수동 배치 방식 검증              | `item-placement.test.ts` |
| TS-R4.2 | R4.2 | CSS Grid 속성으로 위치 지정 검증 | `item-placement.test.ts` |
| TS-R4.3 | R4.3 | 셀 경계 정렬 검증                | `item-placement.test.ts` |

### R5. 그리드 간격(Gap)

| ID      | 규칙 | 테스트 케이스                        | 관련 파일                |
| ------- | ---- | ------------------------------------ | ------------------------ |
| TS-R5.1 | R5.1 | 그리드 간격이 10px로 고정되는지 검증 | `grid-structure.test.ts` |
| TS-R5.2 | R5.2 | 간격 설정 가능성 검증                | `grid-structure.test.ts` |

### R6. 반응형 동작

| ID      | 규칙 | 테스트 케이스                         | 관련 파일            |
| ------- | ---- | ------------------------------------- | -------------------- |
| TS-R6.1 | R6.1 | 컬럼 너비 유지 검증                   | `responsive.test.ts` |
| TS-R6.2 | R6.2 | 컬럼 수만 변경, 아이템 배치 유지 검증 | `responsive.test.ts` |
| TS-R6.3 | R6.3 | 오버플로우 에러 발생 검증             | `responsive.test.ts` |

### R7. 아이템 겹침 방지

| ID      | 규칙 | 테스트 케이스                    | 관련 파일            |
| ------- | ---- | -------------------------------- | -------------------- |
| TS-R7.1 | R7.1 | 겹침 허용 안 함 검증             | `validation.test.ts` |
| TS-R7.2 | R7.2 | 겹침 감지 시 에러 발생 검증      | `validation.test.ts` |
| TS-R7.3 | R7.3 | 겹침 검증 시점 검증              | `validation.test.ts` |
| TS-R7.4 | R7.3 | 위치 유효성 검증 (제약사항 반영) | `validation.test.ts` |

### R8. 사용자 편집

| ID      | 규칙 | 테스트 케이스                | 관련 파일                     |
| ------- | ---- | ---------------------------- | ----------------------------- |
| TS-R8.1 | R8.1 | 사용자 편집 기능 불필요 검증 | `component-structure.test.ts` |
| TS-R8.2 | R8.2 | 개발 시점 고정 배치 검증     | `component-structure.test.ts` |

### R9. 컴포넌트 구조

| ID      | 규칙 | 테스트 케이스                     | 관련 파일                     |
| ------- | ---- | --------------------------------- | ----------------------------- |
| TS-R9.1 | R9.1 | 재사용 가능한 React 컴포넌트 검증 | `component-structure.test.ts` |
| TS-R9.2 | R9.2 | 자식 컴포넌트 주입 가능 검증      | `component-structure.test.ts` |
| TS-R9.3 | R9.3 | 위치와 크기 정보 전달 검증        | `component-structure.test.ts` |

---

## 파일 구조

```
tests/
├── README.md (이 파일)
├── unit/
│   ├── lib/
│   │   └── domain/
│   │       └── grid/
│   │           ├── gridCalculator.test.ts
│   │           ├── gridValidator.test.ts
│   │           └── gridStructure.test.ts
│   └── components/
│       └── grid/
│           ├── GridContainer.test.tsx
│           └── GridItem.test.tsx
└── integration/
    └── grid-layout.test.tsx
```

---

## 실행 방법

```bash
# 모든 테스트 실행
npm test

# Watch 모드
npm run test:watch

# Coverage 리포트 생성
npm run test:coverage
```

---

## 관련 문서

- **요구사항**: `/requirements/grid-layout/`
- **테스트 시나리오**: `/requirements/grid-layout/rules/*_test_scenario.md`
