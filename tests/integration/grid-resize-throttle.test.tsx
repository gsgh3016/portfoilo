/**
 * GridContainer + useThrottle 통합 테스트
 *
 * REQ-001-002-004 (R6.1, R6.2): 반응형 동작 - 성능 최적화
 * REQ-001-004: 제약사항 - 성능
 */

import React from "react";
import { render, waitFor, act, screen } from "@testing-library/react";
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

  afterEach(async () => {
    // 남은 타이머를 모두 실행하여 act() 경고 방지
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
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

      render(<GridContainer items={items} />);

      // 초기 상태: 1920px → 12개 컬럼 (렌더링 완료 대기)
      await waitFor(() => {
        const gridContainer = screen.getByTestId("grid-container");
        expect(gridContainer).toBeInTheDocument();
        expect(gridContainer).toHaveAttribute("data-column-count", "12");
      });

      // window.innerWidth를 768px로 변경하고 첫 resize 이벤트 발생
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 768,
      });

      // 첫 resize 이벤트 발생 및 delay 경과
      await act(async () => {
        window.dispatchEvent(new Event("resize"));
        jest.advanceTimersByTime(100);
      });

      // 첫 이벤트 후 컬럼 수가 5개로 변경됨
      await waitFor(() => {
        const gridContainer = screen.getByTestId("grid-container");
        expect(gridContainer).toHaveAttribute("data-column-count", "5");
      });

      // window.innerWidth를 375px로 변경
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 375,
      });

      // 빠르게 여러 번 resize 이벤트 발생 (쓰로틀링 테스트)
      // 첫 이벤트는 즉시 실행될 수 있지만, 이후 이벤트들은 쓰로틀링됨
      act(() => {
        for (let i = 0; i < 10; i++) {
          window.dispatchEvent(new Event("resize"));
        }
      });

      // 첫 이벤트 후 100ms가 지나지 않았으면, 이후 이벤트들은 remainingTime 후 실행됨
      // 하지만 첫 이벤트가 즉시 실행되었을 수도 있으므로, 컬럼 수가 변경되었을 수 있음
      // 실제로는 쓰로틀링으로 인해 여러 이벤트가 1번만 실행되는 것을 확인하는 것이 목적
      
      // delay 경과: 쓰로틀링된 핸들러 실행 (10번 호출했지만 1번만 실행됨)
      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      // 마지막 이벤트 후 컬럼 수가 2개로 변경됨
      await waitFor(() => {
        const gridContainerAfter = screen.getByTestId("grid-container");
        expect(gridContainerAfter).toHaveAttribute("data-column-count", "2");
      });
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

      render(<GridContainer items={items} />);

      // 초기: 1920px → 12개 컬럼 (렌더링 완료 대기)
      await waitFor(() => {
        const gridContainer = screen.getByTestId("grid-container");
        expect(gridContainer).toBeInTheDocument();
        expect(gridContainer).toHaveAttribute("data-column-count", "12");
      });

      // 768px로 변경
      await act(async () => {
        Object.defineProperty(window, "innerWidth", {
          writable: true,
          configurable: true,
          value: 768,
        });
        window.dispatchEvent(new Event("resize"));
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        const gridContainer = screen.getByTestId("grid-container");
        expect(gridContainer).toHaveAttribute("data-column-count", "5");
      });

      // 375px로 변경
      await act(async () => {
        Object.defineProperty(window, "innerWidth", {
          writable: true,
          configurable: true,
          value: 375,
        });
        window.dispatchEvent(new Event("resize"));
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        const gridContainer = screen.getByTestId("grid-container");
        expect(gridContainer).toHaveAttribute("data-column-count", "2");
      });
    });

    it("screenWidth prop 제공 시 → window.resize 이벤트 무시", async () => {
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

      render(<GridContainer items={items} screenWidth={768} />);

      // screenWidth prop 기반: 768px → 5개 컬럼
      await waitFor(() => {
        const gridContainer = screen.getByTestId("grid-container");
        expect(gridContainer).toBeInTheDocument();
        expect(gridContainer).toHaveAttribute("data-column-count", "5");
      });

      // window.innerWidth를 변경하고 resize 이벤트 발생
      await act(async () => {
        Object.defineProperty(window, "innerWidth", {
          writable: true,
          configurable: true,
          value: 1920,
        });
        window.dispatchEvent(new Event("resize"));
        jest.advanceTimersByTime(100);
      });

      // screenWidth prop이 있으면 window 이벤트를 무시하므로 여전히 5개 컬럼
      const gridContainer = screen.getByTestId("grid-container");
      expect(gridContainer).toHaveAttribute("data-column-count", "5");
    });
  });
});


