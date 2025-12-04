# ErrorBoundary 테스트 기획

**Requirement ID**: REQ-001-002-005 (Validation), REQ-001-002-006 (Component Structure)  
**테스트 레벨**: Unit Test, Integration Test  
**작성 일자**: 2025-01-XX

---

## 1. Test Overview

ErrorBoundary 컴포넌트는 React의 에러 바운더리 패턴을 구현하여, 자식 컴포넌트에서 발생한 에러를 catch하고 fallback UI를 표시하는 역할을 합니다. 특히 GridContainer의 검증 실패 시 앱 전체 크래시를 방지하는 핵심 레이어입니다.

**테스트 범위**:

- ErrorBoundary의 기본 동작 (에러 catch, fallback 렌더링)
- 커스텀 fallback 컴포넌트 지원
- 에러 리셋 기능
- 개발/프로덕션 모드별 동작 차이
- GridContainer와의 통합 플로우

**테스트 레벨**:

- **Unit Test**: ErrorBoundary 컴포넌트 자체의 동작 검증
- **Integration Test**: GridContainer + ErrorBoundary 통합 플로우 검증

---

## 2. Test Case List

### TS-R7.5.1: ErrorBoundary 기본 동작

- **Requirement**: R7.2, R7.3
- **설명**: 자식 컴포넌트가 에러를 throw할 때 ErrorBoundary가 fallback UI를 렌더링하는지 검증
- **테스트 케이스**:
  1. 에러를 throw하는 자식 컴포넌트 → fallback UI 렌더링
  2. 정상적인 자식 컴포넌트 → children 그대로 렌더링

### TS-R7.5.2: 커스텀 Fallback 컴포넌트

- **Requirement**: R7.2
- **설명**: fallback prop으로 전달된 커스텀 컴포넌트가 사용되는지 검증
- **테스트 케이스**:
  1. fallback prop 전달 시 → 커스텀 컴포넌트 렌더링
  2. 커스텀 fallback에 error, resetError prop 전달 확인

### TS-R7.5.3: 에러 리셋 기능

- **Requirement**: R7.2
- **설명**: resetError 버튼 클릭 시 에러 상태가 초기화되고 children이 다시 렌더링되는지 검증
- **테스트 케이스**:
  1. 기본 fallback의 "다시 시도" 버튼 클릭 → 에러 상태 초기화
  2. 커스텀 fallback의 resetError 호출 → 에러 상태 초기화

### TS-R7.5.4: 개발 모드 상세 정보 표시

- **Requirement**: R7.2
- **설명**: 개발 모드에서만 에러 스택 트레이스가 표시되는지 검증
- **테스트 케이스**:
  1. NODE_ENV="development" → 스택 트레이스 표시
  2. NODE_ENV="production" → 스택 트레이스 미표시

### TS-R7.5.5: GridContainer와 ErrorBoundary 통합

- **Requirement**: R7.2, R7.3
- **설명**: GridContainer의 검증 실패 시 ErrorBoundary가 에러를 처리하는지 검증
- **테스트 케이스**:
  1. 오버플로우 에러 → ErrorBoundary catch 및 fallback 표시
  2. 겹침 에러 → ErrorBoundary catch 및 에러 메시지 표시
  3. 정상 items → ErrorBoundary는 children 그대로 렌더링

---

## 3. Test Scenario Report

테스트 시나리오는 [validation_test_scenario.md](./validation_test_scenario.md)의 "R7.5. 에러 처리 (ErrorBoundary)" 섹션을 참조하세요.

---

## 4. File Structure / Locations

### 새로 생성할 테스트 파일

```
tests/
├── unit/
│   └── app/
│       └── error-boundary.test.tsx          # ErrorBoundary 단위 테스트
└── integration/
    └── grid-error-boundary.test.tsx         # GridContainer + ErrorBoundary 통합 테스트
```

---

## 5. Test Code Skeletons

### 5.1. ErrorBoundary 단위 테스트 (`tests/unit/app/error-boundary.test.tsx`)

```typescript
/**
 * ErrorBoundary 컴포넌트 테스트
 *
 * REQ-001-002-005 (R7.2, R7.3): 에러 처리
 * REQ-001-002-006 (R8, R9): 컴포넌트 구조
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ErrorBoundary } from "@/app/error-boundary";

// 에러를 throw하는 테스트 컴포넌트
const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({
  shouldThrow = true,
}) => {
  if (shouldThrow) {
    throw new Error("Test error message");
  }
  return <div>Normal content</div>;
};

describe("ErrorBoundary", () => {
  // 원래 console.error를 저장하고 복원
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn(); // React의 에러 로그 억제
  });
  afterAll(() => {
    console.error = originalError;
  });

  describe("TS-R7.5.1: ErrorBoundary 기본 동작", () => {
    it("에러를 throw하는 자식 컴포넌트 → fallback UI 렌더링", () => {
      // Given: ErrorBoundary로 감싼 ThrowError 컴포넌트
      // When: ThrowError가 에러를 throw할 때
      // Then: ErrorBoundary가 fallback UI를 렌더링함
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText("그리드 레이아웃 오류")).toBeInTheDocument();
      expect(screen.getByText("Test error message")).toBeInTheDocument();
    });

    it("정상적인 자식 컴포넌트 → children 그대로 렌더링", () => {
      // Given: ErrorBoundary로 감싼 정상 컴포넌트
      // When: 자식 컴포넌트가 정상적으로 렌더링될 때
      // Then: ErrorBoundary는 children을 그대로 렌더링함
      render(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText("Normal content")).toBeInTheDocument();
      expect(
        screen.queryByText("그리드 레이아웃 오류")
      ).not.toBeInTheDocument();
    });
  });

  describe("TS-R7.5.2: 커스텀 Fallback 컴포넌트", () => {
    it("fallback prop 전달 시 → 커스텀 컴포넌트 렌더링", () => {
      // Given: ErrorBoundary에 커스텀 fallback 컴포넌트가 전달됨
      // When: 자식 컴포넌트가 에러를 throw할 때
      // Then: 기본 fallback UI 대신 커스텀 fallback 컴포넌트가 렌더링됨
      const CustomFallback: React.FC<{
        error: Error;
        resetError: () => void;
      }> = ({ error, resetError }) => (
        <div>
          <p>Custom error: {error.message}</p>
          <button onClick={resetError}>Reset</button>
        </div>
      );

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(
        screen.getByText("Custom error: Test error message")
      ).toBeInTheDocument();
      expect(
        screen.queryByText("그리드 레이아웃 오류")
      ).not.toBeInTheDocument();
    });

    it("커스텀 fallback에 error, resetError가 prop으로 전달됨", () => {
      // Given: ErrorBoundary에 커스텀 fallback 컴포넌트가 전달됨
      // When: 자식 컴포넌트가 에러를 throw할 때
      // Then: 커스텀 fallback 컴포넌트에 error와 resetError가 prop으로 전달됨
      const CustomFallback: React.FC<{
        error: Error;
        resetError: () => void;
      }> = ({ error, resetError }) => {
        expect(error).toBeInstanceOf(Error);
        expect(typeof resetError).toBe("function");
        return <div>Custom fallback</div>;
      };

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError />
        </ErrorBoundary>
      );
    });
  });

  describe("TS-R7.5.3: 에러 리셋 기능", () => {
    it("기본 fallback의 '다시 시도' 버튼 클릭 → 에러 상태 초기화", () => {
      // Given: ErrorBoundary가 에러를 catch하여 fallback UI를 표시 중임
      // When: "다시 시도" 버튼을 클릭할 때
      // Then: 에러 상태가 초기화되고 children이 다시 렌더링됨
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText("그리드 레이아웃 오류")).toBeInTheDocument();

      const resetButton = screen.getByText("다시 시도");
      fireEvent.click(resetButton);

      // 에러가 해결된 컴포넌트로 재렌더링
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(
        screen.queryByText("그리드 레이아웃 오류")
      ).not.toBeInTheDocument();
      expect(screen.getByText("Normal content")).toBeInTheDocument();
    });

    it("커스텀 fallback의 resetError 호출 → 에러 상태 초기화", () => {
      // Given: ErrorBoundary가 에러를 catch하여 커스텀 fallback을 표시 중임
      // When: 커스텀 fallback의 resetError 함수를 호출할 때
      // Then: 에러 상태가 초기화되고 children이 다시 렌더링됨
      let capturedResetError: (() => void) | null = null;
      const CustomFallback: React.FC<{
        error: Error;
        resetError: () => void;
      }> = ({ error, resetError }) => {
        capturedResetError = resetError;
        return (
          <div>
            <p>Custom error</p>
            <button onClick={resetError}>Custom Reset</button>
          </div>
        );
      };

      const { rerender } = render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Custom error")).toBeInTheDocument();

      if (capturedResetError) {
        capturedResetError();
      }

      rerender(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.queryByText("Custom error")).not.toBeInTheDocument();
      expect(screen.getByText("Normal content")).toBeInTheDocument();
    });
  });

  describe("TS-R7.5.4: 개발 모드 상세 정보 표시", () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it("NODE_ENV='development' → 스택 트레이스 표시", () => {
      // Given: ErrorBoundary가 에러를 catch하여 fallback UI를 표시 중임
      // When: NODE_ENV가 "development"일 때
      // Then: 에러 스택 트레이스가 details 요소로 표시됨
      process.env.NODE_ENV = "development";

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText("상세 정보 (개발 모드)")).toBeInTheDocument();
      const details = screen
        .getByText("상세 정보 (개발 모드)")
        .closest("details");
      expect(details).toBeInTheDocument();
    });

    it("NODE_ENV='production' → 스택 트레이스 미표시", () => {
      // Given: ErrorBoundary가 에러를 catch하여 fallback UI를 표시 중임
      // When: NODE_ENV가 "production"일 때
      // Then: 에러 스택 트레이스가 표시되지 않음
      process.env.NODE_ENV = "production";

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(
        screen.queryByText("상세 정보 (개발 모드)")
      ).not.toBeInTheDocument();
    });
  });
});
```

### 5.2. GridContainer + ErrorBoundary 통합 테스트 (`tests/integration/grid-error-boundary.test.tsx`)

```typescript
/**
 * GridContainer + ErrorBoundary 통합 테스트
 *
 * REQ-001-002-005 (R7.2, R7.3): 에러 처리
 * REQ-001-002-006 (R8, R9): 컴포넌트 구조
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ErrorBoundary } from "@/app/error-boundary";
import { GridContainer } from "@/components/grid/GridContainer";
import { GridItem } from "@/lib/domain/grid/types";

const TestComponent = () => <div>Test Component</div>;

describe("GridContainer + ErrorBoundary Integration", () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  describe("TS-R7.5.5: GridContainer와 ErrorBoundary 통합", () => {
    it("오버플로우 에러 → ErrorBoundary catch 및 fallback 표시", () => {
      // Given: ErrorBoundary로 감싼 GridContainer가 있고, invalid items(오버플로우)가 전달됨
      // When: GridContainer가 검증 실패로 에러를 throw할 때
      // Then: ErrorBoundary가 에러를 catch하고 fallback UI를 표시함
      const invalidItems: GridItem[] = [
        {
          id: "a",
          col: 10, // 768px 화면에서 5개 컬럼인데 10번째 컬럼에 배치 → 오버플로우
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponent,
        },
      ];

      render(
        <ErrorBoundary>
          <GridContainer items={invalidItems} screenWidth={768} />
        </ErrorBoundary>
      );

      expect(screen.getByText("그리드 레이아웃 오류")).toBeInTheDocument();
      expect(screen.getByText(/Grid validation failed/)).toBeInTheDocument();
    });

    it("겹침 에러 → ErrorBoundary catch 및 에러 메시지 표시", () => {
      // Given: ErrorBoundary로 감싼 GridContainer가 있고, invalid items(겹침)가 전달됨
      // When: GridContainer가 검증 실패로 에러를 throw할 때
      // Then: ErrorBoundary fallback UI에 에러 메시지가 표시됨
      const overlappingItems: GridItem[] = [
        {
          id: "a",
          col: 1,
          row: 1,
          colSpan: 2,
          rowSpan: 2,
          component: TestComponent,
        },
        {
          id: "b",
          col: 2,
          row: 2,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponent,
        },
      ];

      render(
        <ErrorBoundary>
          <GridContainer items={overlappingItems} screenWidth={1920} />
        </ErrorBoundary>
      );

      expect(screen.getByText("그리드 레이아웃 오류")).toBeInTheDocument();
      expect(screen.getByText(/Grid validation failed/)).toBeInTheDocument();
    });

    it("정상 items → ErrorBoundary는 children 그대로 렌더링", () => {
      // Given: ErrorBoundary로 감싼 GridContainer가 있고, valid items가 전달됨
      // When: GridContainer가 정상적으로 렌더링될 때
      // Then: ErrorBoundary는 children을 그대로 렌더링함
      const validItems: GridItem[] = [
        {
          id: "a",
          col: 1,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponent,
        },
      ];

      render(
        <ErrorBoundary>
          <GridContainer items={validItems} screenWidth={1920} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Test Component")).toBeInTheDocument();
      expect(
        screen.queryByText("그리드 레이아웃 오류")
      ).not.toBeInTheDocument();
    });

    it("에러 후 reset → GridContainer가 다시 렌더링됨", () => {
      // Given: ErrorBoundary로 감싼 GridContainer가 있고, invalid items가 전달됨
      // When: 에러가 발생하고 reset 버튼을 클릭한 후 valid items로 변경할 때
      // Then: GridContainer가 정상적으로 렌더링됨
      const invalidItems: GridItem[] = [
        {
          id: "a",
          col: 10,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponent,
        },
      ];

      const validItems: GridItem[] = [
        {
          id: "a",
          col: 1,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponent,
        },
      ];

      const { rerender } = render(
        <ErrorBoundary>
          <GridContainer items={invalidItems} screenWidth={768} />
        </ErrorBoundary>
      );

      expect(screen.getByText("그리드 레이아웃 오류")).toBeInTheDocument();

      const resetButton = screen.getByText("다시 시도");
      fireEvent.click(resetButton);

      // valid items로 재렌더링
      rerender(
        <ErrorBoundary>
          <GridContainer items={validItems} screenWidth={768} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Test Component")).toBeInTheDocument();
      expect(
        screen.queryByText("그리드 레이아웃 오류")
      ).not.toBeInTheDocument();
    });
  });
});
```

---

## 6. Monitoring / Expectation

### 테스트 커버리지 목표

- **ErrorBoundary 컴포넌트**: 90% 이상 Statements, 85% 이상 Branch
- **에러 처리 플로우**: 모든 에러 케이스(throw, catch, reset) 커버
- **통합 테스트**: GridContainer + ErrorBoundary 플로우 100% 커버

### 예상 테스트 결과

- **단위 테스트**: 8-10개 테스트 케이스
- **통합 테스트**: 4개 테스트 케이스
- **전체 실행 시간**: < 2초

### 리소스 사용

- **메모리**: 최소 (React 컴포넌트 렌더링만)
- **CPU**: 낮음 (타이머/비동기 로직 없음)

---

## 7. Notes / Assumptions

### 가정 사항

1. **React Error Boundary 제한사항**

   - ErrorBoundary는 클래스 컴포넌트로만 구현 가능
   - 이벤트 핸들러, 비동기 코드, 서버 사이드 렌더링 에러는 catch하지 않음
   - 테스트에서는 `console.error`를 억제하여 React의 에러 로그를 숨김

2. **테스트 환경**

   - `@testing-library/react`를 사용하여 컴포넌트 렌더링 및 상호작용 테스트
   - `jest.fn()`을 사용하여 console.error를 모킹

3. **에러 리셋 테스트**
   - ErrorBoundary의 resetError는 state만 초기화하므로, 실제로 에러가 해결되지 않으면 다시 에러가 발생함
   - 테스트에서는 에러가 해결된 컴포넌트로 재렌더링하여 검증

### 주의 사항

- ErrorBoundary는 React의 생명주기 메서드(`getDerivedStateFromError`, `componentDidCatch`)에 의존하므로, 테스트 환경에서도 React의 에러 처리 메커니즘이 정상 작동해야 함
- 개발/프로덕션 모드 테스트는 `process.env.NODE_ENV`를 조작하여 수행

---

## 관련 문서

- **테스트 시나리오**: [validation_test_scenario.md](./validation_test_scenario.md)
- **규칙**: [validation.md](./validation.md)
- **구현 코드**: `app/error-boundary.tsx`
