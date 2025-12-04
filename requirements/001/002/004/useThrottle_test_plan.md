# useThrottle 테스트 기획

**Requirement ID**: REQ-001-002-004 (Responsive), REQ-001-004 (Constraints)  
**테스트 레벨**: Unit Test, Integration Test  
**작성 일자**: 2025-01-XX

---

## 1. Test Overview

useThrottle 훅은 빈번한 이벤트(예: window.resize)를 쓰로틀링하여 성능을 최적화하는 유틸리티 훅입니다. GridContainer의 리사이즈 이벤트 처리에 사용되며, delay 시간 내 다중 호출을 제어합니다.

**테스트 범위**:
- useThrottle의 기본 동작 (delay 내 다중 호출 제어)
- 타이밍 검증 (delay 경계에서의 정확한 동작)
- 인자 전달 검증
- GridContainer와의 통합 (실제 window.resize 이벤트)

**테스트 레벨**:
- **Unit Test**: useThrottle 훅 자체의 동작 검증 (jest.useFakeTimers 사용)
- **Integration Test**: GridContainer + useThrottle 통합 플로우 검증

---

## 2. Test Case List

### TS-R6.4.1: useThrottle 기본 동작
- **Requirement**: R6.1, R6.2 (성능 최적화)
- **설명**: delay 시간 내 다중 호출 시 마지막 호출만 실행되는지 검증
- **테스트 케이스**:
  1. delay 내 다중 호출 → 첫 번째 즉시 실행, 이후 delay 후 마지막 호출만 실행
  2. delay 경과 후 호출 → 즉시 실행

### TS-R6.4.2: useThrottle 타이밍 검증
- **Requirement**: R6.1, R6.2 (성능 최적화)
- **설명**: delay 경계에서의 정확한 타이밍 동작 검증
- **테스트 케이스**:
  1. 50ms 후 재호출 → 첫 번째 즉시 실행, 두 번째 50ms 후 실행
  2. 100ms 이상 경과 후 재호출 → 두 번째도 즉시 실행

### TS-R6.4.3: useThrottle 인자 전달
- **Requirement**: R6.1, R6.2 (성능 최적화)
- **설명**: 쓰로틀링된 함수에 인자가 올바르게 전달되는지 검증
- **테스트 케이스**:
  1. 단일 인자 전달 → 원본 함수에 인자 전달 확인
  2. 여러 인자 전달 → 모든 인자 전달 확인

### TS-R6.4.4: GridContainer와 useThrottle 통합
- **Requirement**: R6.1, R6.2 (성능 최적화)
- **설명**: GridContainer의 리사이즈 이벤트에 useThrottle이 적용되는지 검증
- **테스트 케이스**:
  1. 빠른 연속 resize 이벤트 → 쓰로틀링으로 과도한 재렌더링 방지
  2. window.innerWidth 변경 + resize 이벤트 → 컬럼 수 올바르게 업데이트

---

## 3. Test Scenario Report

테스트 시나리오는 [responsive_test_scenario.md](./responsive_test_scenario.md)의 "R6.4. 리사이즈 이벤트 최적화 (useThrottle)" 섹션을 참조하세요.

---

## 4. File Structure / Locations

### 새로 생성할 테스트 파일

```
tests/
├── unit/
│   └── lib/
│       └── hooks/
│           └── useThrottle.test.ts          # useThrottle 단위 테스트
└── integration/
    └── grid-resize-throttle.test.tsx        # GridContainer + useThrottle 통합 테스트
```

---

## 5. Test Code Skeletons

### 5.1. useThrottle 단위 테스트 (`tests/unit/lib/hooks/useThrottle.test.ts`)

```typescript
/**
 * useThrottle 훅 테스트
 *
 * REQ-001-002-004 (R6.1, R6.2): 반응형 동작 - 성능 최적화
 * REQ-001-004: 제약사항 - 성능
 */

import { renderHook, act } from "@testing-library/react";
import { useThrottle } from "@/lib/hooks/useThrottle";

describe("useThrottle", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("TS-R6.4.1: useThrottle 기본 동작", () => {
    it("delay 내 다중 호출 → 첫 번째 즉시 실행, 이후 delay 후 마지막 호출만 실행", () => {
      // Given: useThrottle 훅이 생성되고, delay가 100ms로 설정됨
      // When: delay 시간(100ms) 내에 함수가 여러 번 호출될 때
      // Then: 첫 번째 호출은 즉시 실행되고, 이후 호출은 delay 경과 후 마지막 호출만 실행됨
      const callback = jest.fn();
      const { result } = renderHook(() => useThrottle(callback, 100));

      // 첫 번째 호출: 즉시 실행
      act(() => {
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // 50ms 후 두 번째 호출: 아직 delay 경과 전이므로 실행되지 않음
      act(() => {
        jest.advanceTimersByTime(50);
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // 50ms 후 (총 100ms): 남은 시간 후 실행됨
      act(() => {
        jest.advanceTimersByTime(50);
      });
      expect(callback).toHaveBeenCalledTimes(2);

      // 30ms 후 세 번째 호출: 아직 delay 경과 전
      act(() => {
        jest.advanceTimersByTime(30);
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(2);

      // 70ms 후 (총 200ms): 남은 시간 후 실행됨
      act(() => {
        jest.advanceTimersByTime(70);
      });
      expect(callback).toHaveBeenCalledTimes(3);
    });

    it("delay 시간(100ms) 이상 경과 후 함수가 호출될 때 → 함수가 즉시 실행됨", () => {
      // Given: useThrottle 훅이 생성되고, delay가 100ms로 설정됨
      // When: delay 시간(100ms) 이상 경과 후 함수가 호출될 때
      // Then: 함수가 즉시 실행됨
      const callback = jest.fn();
      const { result } = renderHook(() => useThrottle(callback, 100));

      // 첫 번째 호출
      act(() => {
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // 100ms 이상 경과 후 두 번째 호출: 즉시 실행
      act(() => {
        jest.advanceTimersByTime(100);
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(2);

      // 150ms 경과 후 세 번째 호출: 즉시 실행
      act(() => {
        jest.advanceTimersByTime(150);
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(3);
    });
  });

  describe("TS-R6.4.2: useThrottle 타이밍 검증", () => {
    it("50ms 후 재호출 → 첫 번째 즉시 실행, 두 번째 50ms 후 실행", () => {
      // Given: useThrottle 훅이 생성되고, delay가 100ms로 설정됨
      // When: 함수가 호출되고, 50ms 후 다시 호출될 때
      // Then: 첫 번째 호출은 즉시 실행되고, 두 번째 호출은 50ms 후(남은 시간) 실행됨
      const callback = jest.fn();
      const { result } = renderHook(() => useThrottle(callback, 100));

      const startTime = Date.now();
      jest.spyOn(Date, "now").mockReturnValue(startTime);

      // 첫 번째 호출
      act(() => {
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // 50ms 경과
      jest.spyOn(Date, "now").mockReturnValue(startTime + 50);

      // 두 번째 호출: 아직 delay 경과 전이므로 실행되지 않음
      act(() => {
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // 남은 50ms 경과: 두 번째 호출 실행
      act(() => {
        jest.advanceTimersByTime(50);
      });
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it("100ms 이상 경과 후 재호출 → 두 번째도 즉시 실행", () => {
      // Given: useThrottle 훅이 생성되고, delay가 100ms로 설정됨
      // When: 함수가 호출되고, 100ms 이상 경과 후 다시 호출될 때
      // Then: 두 번째 호출도 즉시 실행됨
      const callback = jest.fn();
      const { result } = renderHook(() => useThrottle(callback, 100));

      // 첫 번째 호출
      act(() => {
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // 100ms 이상 경과
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // 두 번째 호출: 즉시 실행
      act(() => {
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe("TS-R6.4.3: useThrottle 인자 전달", () => {
    it("단일 인자 전달 → 원본 함수에 인자 전달 확인", () => {
      // Given: useThrottle 훅이 생성되고, 인자를 받는 함수가 전달됨
      // When: 쓰로틀링된 함수에 인자를 전달하여 호출할 때
      // Then: 원본 함수에 인자가 올바르게 전달됨
      const callback = jest.fn();
      const { result } = renderHook(() => useThrottle(callback, 100));

      act(() => {
        result.current("test-arg");
      });

      expect(callback).toHaveBeenCalledWith("test-arg");
    });

    it("여러 인자 전달 → 모든 인자 전달 확인", () => {
      // Given: useThrottle 훅이 생성되고, 여러 인자를 받는 함수가 전달됨
      // When: 쓰로틀링된 함수에 여러 인자를 전달하여 호출할 때
      // Then: 원본 함수에 모든 인자가 올바르게 전달됨
      const callback = jest.fn();
      const { result } = renderHook(() => useThrottle(callback, 100));

      act(() => {
        result.current("arg1", "arg2", 123);
      });

      expect(callback).toHaveBeenCalledWith("arg1", "arg2", 123);
    });

    it("delay 내 다중 호출 시 마지막 호출의 인자만 전달됨", () => {
      // Given: useThrottle 훅이 생성되고, delay가 100ms로 설정됨
      // When: delay 내에 여러 번 호출하고 각각 다른 인자를 전달할 때
      // Then: 마지막 호출의 인자만 원본 함수에 전달됨
      const callback = jest.fn();
      const { result } = renderHook(() => useThrottle(callback, 100));

      // 첫 번째 호출
      act(() => {
        result.current("first");
      });
      expect(callback).toHaveBeenCalledWith("first");

      // 50ms 후 두 번째 호출
      act(() => {
        jest.advanceTimersByTime(50);
        result.current("second");
      });
      expect(callback).toHaveBeenCalledTimes(1); // 아직 실행되지 않음

      // 30ms 후 세 번째 호출
      act(() => {
        jest.advanceTimersByTime(30);
        result.current("third");
      });
      expect(callback).toHaveBeenCalledTimes(1); // 아직 실행되지 않음

      // 남은 시간 후 실행: 마지막 호출("third")만 실행됨
      act(() => {
        jest.advanceTimersByTime(20);
      });
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith("third");
      expect(callback).not.toHaveBeenCalledWith("second");
    });
  });
});
```

### 5.2. GridContainer + useThrottle 통합 테스트 (`tests/integration/grid-resize-throttle.test.tsx`)

```typescript
/**
 * GridContainer + useThrottle 통합 테스트
 *
 * REQ-001-002-004 (R6.1, R6.2): 반응형 동작 - 성능 최적화
 * REQ-001-004: 제약사항 - 성능
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GridContainer } from "@/components/grid/GridContainer";
import { GridItem } from "@/lib/domain/grid/types";

const TestComponent = () => <div>Test Component</div>;

describe("GridContainer + useThrottle Integration", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // window.innerWidth 모킹
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1920,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("TS-R6.4.4: GridContainer와 useThrottle 통합", () => {
    it("빠른 연속 resize 이벤트 → 쓰로틀링으로 과도한 재렌더링 방지", async () => {
      // Given: GridContainer가 렌더링되고, screenWidth prop이 제공되지 않음
      // When: window.resize 이벤트가 빠르게 여러 번 발생할 때
      // Then: 리사이즈 핸들러가 쓰로틀링되어 과도한 재렌더링이 발생하지 않음
      const items: GridItem[] = [
        {
          id: "a",
          col: 1,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponent,
        },
      ];

      const { container } = render(<GridContainer items={items} />);

      // 초기 상태: 1920px → 12개 컬럼
      expect(container.querySelector('[data-column-count="12"]')).toBeInTheDocument();

      // window.innerWidth를 768px로 변경
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 768,
      });

      // 빠르게 여러 번 resize 이벤트 발생
      for (let i = 0; i < 10; i++) {
        window.dispatchEvent(new Event("resize"));
      }

      // 아직 delay(100ms) 경과 전이므로 컬럼 수는 변경되지 않음
      expect(container.querySelector('[data-column-count="12"]')).toBeInTheDocument();

      // 100ms 경과: 쓰로틀링된 핸들러 실행
      jest.advanceTimersByTime(100);

      await waitFor(() => {
        expect(container.querySelector('[data-column-count="5"]')).toBeInTheDocument();
      });

      // 10번 호출했지만 실제로는 1번만 실행됨 (쓰로틀링 효과)
    });

    it("window.innerWidth 변경 + resize 이벤트 → 컬럼 수 올바르게 업데이트", async () => {
      // Given: GridContainer가 렌더링되고, screenWidth prop이 제공되지 않음
      // When: window.innerWidth가 변경되고 resize 이벤트가 발생할 때
      // Then: 쓰로틀링된 핸들러가 실행되어 컬럼 수가 올바르게 업데이트됨
      const items: GridItem[] = [
        {
          id: "a",
          col: 1,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponent,
        },
      ];

      const { container } = render(<GridContainer items={items} />);

      // 초기: 1920px → 12개 컬럼
      expect(container.querySelector('[data-column-count="12"]')).toBeInTheDocument();

      // 768px로 변경
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 768,
      });
      window.dispatchEvent(new Event("resize"));

      // 100ms 경과 후 업데이트
      jest.advanceTimersByTime(100);

      await waitFor(() => {
        expect(container.querySelector('[data-column-count="5"]')).toBeInTheDocument();
      });

      // 375px로 변경
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 375,
      });
      window.dispatchEvent(new Event("resize"));

      // 100ms 경과 후 업데이트
      jest.advanceTimersByTime(100);

      await waitFor(() => {
        expect(container.querySelector('[data-column-count="2"]')).toBeInTheDocument();
      });
    });

    it("screenWidth prop 제공 시 → window.resize 이벤트 무시", () => {
      // Given: GridContainer가 렌더링되고, screenWidth prop이 제공됨
      // When: window.resize 이벤트가 발생할 때
      // Then: screenWidth prop 값만 사용하고 window 이벤트는 무시됨
      const items: GridItem[] = [
        {
          id: "a",
          col: 1,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponent,
        },
      ];

      const { container } = render(<GridContainer items={items} screenWidth={768} />);

      // screenWidth prop 기반: 768px → 5개 컬럼
      expect(container.querySelector('[data-column-count="5"]')).toBeInTheDocument();

      // window.innerWidth를 변경하고 resize 이벤트 발생
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1920,
      });
      window.dispatchEvent(new Event("resize"));

      jest.advanceTimersByTime(100);

      // screenWidth prop이 있으면 window 이벤트를 무시하므로 여전히 5개 컬럼
      expect(container.querySelector('[data-column-count="5"]')).toBeInTheDocument();
    });
  });
});
```

---

## 6. Monitoring / Expectation

### 테스트 커버리지 목표

- **useThrottle 훅**: 95% 이상 Statements, 90% 이상 Branch
- **타이밍 로직**: 모든 delay 경계 케이스 커버
- **통합 테스트**: GridContainer + useThrottle 플로우 100% 커버

### 예상 테스트 결과

- **단위 테스트**: 6-8개 테스트 케이스
- **통합 테스트**: 3개 테스트 케이스
- **전체 실행 시간**: < 3초 (타이머 사용으로 인해 다소 길어질 수 있음)

### 리소스 사용

- **메모리**: 최소 (타이머 ref만 유지)
- **CPU**: 낮음 (단순 타이머 로직)

### 주의 사항

- `jest.useFakeTimers()`를 사용하므로 테스트 간 타이머 상태를 초기화해야 함
- `Date.now()` 모킹이 필요한 경우가 있을 수 있음

---

## 7. Notes / Assumptions

### 가정 사항

1. **타이머 동작**
   - `jest.useFakeTimers()`를 사용하여 실제 시간 경과를 시뮬레이션
   - `jest.advanceTimersByTime()`으로 시간을 수동으로 진행
   - 테스트 후 `jest.useRealTimers()`로 복원

2. **window 객체 모킹**
   - `Object.defineProperty`를 사용하여 `window.innerWidth`를 모킹
   - `window.dispatchEvent`를 사용하여 resize 이벤트 발생 시뮬레이션

3. **React Hook 테스트**
   - `@testing-library/react`의 `renderHook`을 사용하여 훅 테스트
   - `act()`로 상태 업데이트를 감싸서 React 경고 방지

### 주의 사항

- useThrottle은 `useCallback`을 사용하므로, `callback`이나 `delay`가 변경되면 새로운 함수가 반환됨
- 테스트에서는 `callback`과 `delay`를 고정하여 안정적인 테스트 수행
- 언마운트 시 타임아웃 정리 로직이 추가되면 해당 부분도 테스트 필요

### 향후 개선 사항

- 언마운트 시 타임아웃 정리 로직 추가 후 테스트 보강
- 대량 아이템(100개+) 렌더링 시 성능 테스트 추가 고려

---

## 관련 문서

- **테스트 시나리오**: [responsive_test_scenario.md](./responsive_test_scenario.md)
- **규칙**: [responsive.md](./responsive.md)
- **제약사항**: [../../004/constraints.md](../../004/constraints.md)
- **구현 코드**: `lib/hooks/useThrottle.ts`

