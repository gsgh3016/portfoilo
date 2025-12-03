/**
 * 그리드 레이아웃 시스템 통합 테스트
 *
 * 전체 시스템 동작 및 반응형 동작 검증
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GridContainer } from "@/components/grid/GridContainer";
import { GridItem } from "@/lib/domain/grid/types";
import { validateGridItems } from "@/lib/domain/grid/gridValidator";
import { calculateColumnCount } from "@/lib/domain/grid/gridCalculator";

const TestComponentA = () => <div>Component A</div>;
const TestComponentB = () => <div>Component B</div>;
const TestComponentC = () => <div>Component C</div>;

describe("GridLayout Integration", () => {
  describe("R6. 반응형 동작", () => {
    it("TS-R6.1: 컬럼 너비 유지 - 1920px → 768px", () => {
      // Given: 1920px 화면에서 그리드가 렌더링됨
      // When: 화면 너비가 768px로 변경될 때
      // Then: 컬럼 너비는 여전히 150px로 유지됨
      const items: GridItem[] = [
        {
          id: "a",
          col: 1,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponentA,
        },
      ];

      const { rerender } = render(
        <GridContainer items={items} screenWidth={1920} />
      );
      const container1 = screen.getByTestId("grid-container");
      const style1 = container1.getAttribute("style");
      expect(style1).toContain("150px");

      rerender(<GridContainer items={items} screenWidth={768} />);
      const container2 = screen.getByTestId("grid-container");
      const style2 = container2.getAttribute("style");
      expect(style2).toContain("150px");
    });

    it("TS-R6.1: 컬럼 너비 유지 - 768px → 375px", () => {
      // Given: 768px 화면에서 그리드가 렌더링됨
      // When: 화면 너비가 375px로 변경될 때
      // Then: 컬럼 너비는 여전히 150px로 유지됨
      const items: GridItem[] = [
        {
          id: "a",
          col: 1,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponentA,
        },
      ];

      const { rerender } = render(
        <GridContainer items={items} screenWidth={768} />
      );
      const container1 = screen.getByTestId("grid-container");
      const style1 = container1.getAttribute("style");
      expect(style1).toContain("150px");

      rerender(<GridContainer items={items} screenWidth={375} />);
      const container2 = screen.getByTestId("grid-container");
      const style2 = container2.getAttribute("style");
      expect(style2).toContain("150px");
    });

    it("TS-R6.2: 컬럼 수만 변경, 아이템 배치 유지 - (5, 1) 위치", () => {
      // Given: 1920px 화면에서 12개 컬럼 그리드가 있고, 아이템이 (5, 1) 위치에 배치됨
      // When: 화면 너비가 768px로 줄어들 때
      // Then: 컬럼 수는 5개로 감소하고, 아이템은 여전히 (5, 1) 위치에 배치됨
      const items: GridItem[] = [
        {
          id: "a",
          col: 5,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponentA,
        },
      ];

      const { rerender } = render(
        <GridContainer items={items} screenWidth={1920} />
      );
      const container1 = screen.getByTestId("grid-container");
      expect(container1).toHaveAttribute("data-column-count", "12");

      const item1 = screen.getByTestId("grid-item-a");
      expect(item1).toHaveStyle({
        gridColumnStart: "5",
      });

      rerender(<GridContainer items={items} screenWidth={768} />);
      const container2 = screen.getByTestId("grid-container");
      expect(container2).toHaveAttribute("data-column-count", "5");

      const item2 = screen.getByTestId("grid-item-a");
      expect(item2).toHaveStyle({
        gridColumnStart: "5",
      });
    });

    it("TS-R6.2: 컬럼 수만 변경, 아이템 배치 유지 - (3, 1) 위치", () => {
      // Given: 1920px 화면에서 12개 컬럼 그리드가 있고, 아이템이 (3, 1) 위치에 배치됨
      // When: 화면 너비가 768px로 줄어들 때
      // Then: 컬럼 수는 5개로 감소하고, 아이템은 여전히 (3, 1) 위치에 배치됨
      const items: GridItem[] = [
        {
          id: "a",
          col: 3,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponentA,
        },
      ];

      const { rerender } = render(
        <GridContainer items={items} screenWidth={1920} />
      );
      const container1 = screen.getByTestId("grid-container");
      expect(container1).toHaveAttribute("data-column-count", "12");

      rerender(<GridContainer items={items} screenWidth={768} />);
      const container2 = screen.getByTestId("grid-container");
      expect(container2).toHaveAttribute("data-column-count", "5");

      const item2 = screen.getByTestId("grid-item-a");
      expect(item2).toHaveStyle({
        gridColumnStart: "3",
      });
    });

    it("TS-R6.3: 오버플로우 에러 발생 - (10, 1) 위치에서 768px로 변경", () => {
      // Given: 1920px 화면에서 12개 컬럼 그리드가 있고, 아이템이 (10, 1) 위치에 배치됨
      // When: 화면 너비가 768px로 줄어들어 5개 컬럼이 될 때
      // Then: 아이템이 그리드 영역(5개 컬럼)을 벗어나므로 에러가 발생함
      const items: GridItem[] = [
        {
          id: "a",
          col: 10,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponentA,
        },
      ];

      // 검증 함수를 직접 호출하여 오버플로우 확인
      const columnCount = calculateColumnCount(768);
      const validation = validateGridItems(items, columnCount);
      expect(validation.isValid).toBe(false);
      expect(
        validation.errors?.some((e) => e.message.includes("overflows grid"))
      ).toBe(true);
    });

    it("TS-R6.3: 오버플로우 에러 발생 - (6, 1) 위치에서 768px 화면", () => {
      // Given: 768px 화면에서 5개 컬럼 그리드가 생성됨
      // When: 아이템을 (6, 1) 위치에 배치하려고 할 때
      // Then: 그리드 영역을 벗어나므로 에러가 발생함
      const items: GridItem[] = [
        {
          id: "a",
          col: 6,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponentA,
        },
      ];

      // 검증 함수를 직접 호출하여 오버플로우 확인
      const columnCount = calculateColumnCount(768);
      const validation = validateGridItems(items, columnCount);
      expect(validation.isValid).toBe(false);
      expect(
        validation.errors?.some((e) => e.message.includes("overflows grid"))
      ).toBe(true);
    });

    it("TS-R6.3: 오버플로우 에러 발생 - (3, 1) 위치에서 375px 화면", () => {
      // Given: 375px 화면에서 2개 컬럼 그리드가 생성됨
      // When: 아이템을 (3, 1) 위치에 배치하려고 할 때
      // Then: 그리드 영역을 벗어나므로 에러가 발생함
      const items: GridItem[] = [
        {
          id: "a",
          col: 3,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponentA,
        },
      ];

      // 검증 함수를 직접 호출하여 오버플로우 확인
      const columnCount = calculateColumnCount(375);
      const validation = validateGridItems(items, columnCount);
      expect(validation.isValid).toBe(false);
      expect(
        validation.errors?.some((e) => e.message.includes("overflows grid"))
      ).toBe(true);
    });
  });

  describe("전체 시스템 동작", () => {
    it("다양한 크기의 아이템이 올바르게 배치됨", () => {
      const items: GridItem[] = [
        {
          id: "a",
          col: 1,
          row: 1,
          colSpan: 2,
          rowSpan: 1,
          component: TestComponentA,
        },
        {
          id: "b",
          col: 3,
          row: 1,
          colSpan: 1,
          rowSpan: 2,
          component: TestComponentB,
        },
        {
          id: "c",
          col: 4,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponentC,
        },
      ];

      render(<GridContainer items={items} screenWidth={1920} />);

      expect(screen.getByText("Component A")).toBeInTheDocument();
      expect(screen.getByText("Component B")).toBeInTheDocument();
      expect(screen.getByText("Component C")).toBeInTheDocument();

      const itemA = screen.getByTestId("grid-item-a");
      expect(itemA).toHaveStyle({
        gridColumnStart: "1",
        gridColumnEnd: "3",
      });

      const itemB = screen.getByTestId("grid-item-b");
      expect(itemB).toHaveStyle({
        gridColumnStart: "3",
        gridColumnEnd: "4",
        gridRowStart: "1",
        gridRowEnd: "3",
      });
    });

    it("컬럼 수가 화면 너비에 따라 자동 조정됨", () => {
      const items: GridItem[] = [
        {
          id: "a",
          col: 1,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponentA,
        },
      ];

      const { rerender } = render(
        <GridContainer items={items} screenWidth={1920} />
      );
      expect(screen.getByTestId("grid-container")).toHaveAttribute(
        "data-column-count",
        "12"
      );

      rerender(<GridContainer items={items} screenWidth={768} />);
      expect(screen.getByTestId("grid-container")).toHaveAttribute(
        "data-column-count",
        "5"
      );

      rerender(<GridContainer items={items} screenWidth={375} />);
      expect(screen.getByTestId("grid-container")).toHaveAttribute(
        "data-column-count",
        "2"
      );
    });
  });
});
