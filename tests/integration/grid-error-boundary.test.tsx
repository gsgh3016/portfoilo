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
      // Note: resetError는 state만 초기화하므로, resetError 호출 전에 valid items로 변경해야 정상 렌더링됨
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

      // resetError 호출 전에 valid items로 변경
      rerender(
        <ErrorBoundary>
          <GridContainer items={validItems} screenWidth={768} />
        </ErrorBoundary>
      );

      // resetError 호출
      const resetButton = screen.getByText("다시 시도");
      fireEvent.click(resetButton);

      // resetError 후 GridContainer가 정상적으로 렌더링됨
      expect(screen.getByText("Test Component")).toBeInTheDocument();
      expect(
        screen.queryByText("그리드 레이아웃 오류")
      ).not.toBeInTheDocument();
    });
  });
});


