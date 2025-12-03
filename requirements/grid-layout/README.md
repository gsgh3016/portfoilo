# 그리드 레이아웃 시스템 요구사항 문서

## 개요

개인 블로그 웹사이트의 대시보드 페이지를 위한 고정폭/고정높이 그리드 레이아웃 시스템 요구사항 문서입니다.

벽걸이 네트 망처럼 전체 화면을 그리드로 나누어, 다양한 크기의 컴포넌트를 수동으로 배치할 수 있도록 합니다.

---

## 문서 구조

### 📋 [goal-context.md](./goal-context.md)

**목표 및 컨텍스트**

- Goal
- Context
- 필수 참조 문서

### 📐 [rules/](./rules/) - 규칙 디렉토리

**확정된 규칙 (Confirmed Rules)**

- [grid-structure.md](./rules/grid-structure.md) - R1, R2, R5: 그리드 구조
- [item-sizing.md](./rules/item-sizing.md) - R3: 아이템 크기
- [item-placement.md](./rules/item-placement.md) - R4: 아이템 배치
- [responsive.md](./rules/responsive.md) - R6: 반응형 동작
- [validation.md](./rules/validation.md) - R7: 검증
- [component-structure.md](./rules/component-structure.md) - R8, R9: 컴포넌트 구조

### ✅ [assumptions.md](./assumptions.md)

**확정된 가정**

- A1~A7: 구현 시 가정 사항

### ⚠️ [constraints.md](./constraints.md)

**제약사항 및 Edge Cases**

- Input Domain 제약
- State/Layout 제약
- Performance 고려사항

### 🎨 [design-options/](./design-options/) - 설계 옵션 디렉토리

**배치 정보 저장 방식 비교**

- [README.md](./design-options/README.md) - 옵션 목록 및 권장 사항
- [option-1-props.md](./design-options/option-1-props.md) - Props 직접 전달
- [option-2-array.md](./design-options/option-2-array.md) - 배열 데이터 구조 ⭐
- [option-3-hybrid.md](./design-options/option-3-hybrid.md) - 하이브리드 방식
- [option-4-config.md](./design-options/option-4-config.md) - 설정 파일

### 🔧 [implementation.md](./implementation.md)

**기술적 구현 가이드**

- 구현 방향 및 검증 로직
- IMPL_MODE 참조용

---

## 빠른 참조

| 문서              | 목적               | 대상 모드                      |
| ----------------- | ------------------ | ------------------------------ |
| goal-context.md   | 목표 및 컨텍스트  | REQ_MODE, TEST_MODE, IMPL_MODE |
| rules/            | 확정된 규칙        | REQ_MODE, TEST_MODE, IMPL_MODE |
| assumptions.md    | 확정된 가정        | IMPL_MODE                      |
| constraints.md    | 제약사항 확인      | TEST_MODE, IMPL_MODE           |
| design-options/   | 구현 방식 결정     | IMPL_MODE                      |
| implementation.md | 기술적 가이드      | IMPL_MODE                      |

---

## 주요 결정 사항

- **컬럼 너비**: 150px (고정)
- **행 높이**: 150px (고정)
- **그리드 간격**: 10px
- **아이템 겹침**: 허용 안 함 (에러 발생)
- **오버플로우**: 에러 발생
- **배치 정보 저장**: 옵션 2 (배열 데이터 구조) 권장

---

## 관련 문서

- 프로젝트: `/requirements/`
- 규칙: `/.cursor/rules/`
