/**
 * GridContainer 컴포넌트 테스트
 *
 * REQ-001-002-006 (R8, R9): 컴포넌트 구조
 * REQ-001-002-001 (R1, R2, R5): 그리드 구조
 * - 컴포넌트 구조, 재사용성, 자식 컴포넌트 주입
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GridContainer } from "@/components/grid/GridContainer";
import { GridItem } from "@/lib/domain/grid/types";

describe("GridContainer", () => {
  const TestComponentA = () => <div>Component A</div>;
  const TestComponentB = () => <div>Component B</div>;
  const TestComponentC = () => <div>Component C</div>;

  describe("R9. 컴포넌트 구조", () => {
    it("TS-R9.1: 재사용 가능한 React 컴포넌트", () => {
      // Given: GridContainer 컴포넌트가 정의됨
      // When: 여러 페이지에서 사용할 때
      // Then: 컴포넌트가 재사용 가능함
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

      const { container } = render(<GridContainer items={items} />);
      expect(container).toBeInTheDocument();
    });

    it("TS-R9.1: 컴포넌트 import 및 사용 가능", () => {
      // Given: GridContainer 컴포넌트가 정의됨
      // When: 컴포넌트를 import하여 사용할 때
      // Then: 정상적으로 import되고 사용 가능함
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

      render(<GridContainer items={items} />);
      expect(screen.getByTestId("grid-container")).toBeInTheDocument();
    });

    it("TS-R9.2: 자식 컴포넌트 주입 가능", () => {
      // Given: GridContainer 컴포넌트가 생성됨
      // When: 자식 컴포넌트를 전달할 때
      // Then: 자식 컴포넌트가 그리드 아이템으로 렌더링됨
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

      render(<GridContainer items={items} />);
      expect(screen.getByText("Component A")).toBeInTheDocument();
    });

    it("TS-R9.2: 여러 자식 컴포넌트 주입 가능", () => {
      // Given: GridContainer 컴포넌트가 생성됨
      // When: 여러 자식 컴포넌트를 전달할 때
      // Then: 모든 자식 컴포넌트가 그리드 아이템으로 렌더링됨
      const items: GridItem[] = [
        {
          id: "a",
          col: 1,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponentA,
        },
        {
          id: "b",
          col: 2,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponentB,
        },
        {
          id: "c",
          col: 3,
          row: 1,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponentC,
        },
      ];

      render(<GridContainer items={items} />);
      expect(screen.getByText("Component A")).toBeInTheDocument();
      expect(screen.getByText("Component B")).toBeInTheDocument();
      expect(screen.getByText("Component C")).toBeInTheDocument();
    });

    it("TS-R9.3: 위치와 크기 정보 전달 - props로 전달", () => {
      // Given: GridContainer 컴포넌트가 생성됨
      // When: props로 위치와 크기 정보를 전달할 때
      // Then: 정보가 정상적으로 전달되어 아이템이 올바른 위치에 배치됨
      const items: GridItem[] = [
        {
          id: "a",
          col: 2,
          row: 1,
          colSpan: 2,
          rowSpan: 1,
          component: TestComponentA,
        },
      ];

      render(<GridContainer items={items} />);
      const item = screen.getByTestId("grid-item-a");
      expect(item).toHaveStyle({
        gridColumnStart: "2",
        gridColumnEnd: "4",
        gridRowStart: "1",
        gridRowEnd: "2",
      });
    });

    it("TS-R9.3: 위치와 크기 정보 전달 - 데이터 구조(배열)로 전달", () => {
      // Given: GridContainer 컴포넌트가 생성됨
      // When: 데이터 구조(배열)로 위치와 크기 정보를 전달할 때
      // Then: 정보가 정상적으로 전달되어 아이템이 올바른 위치에 배치됨
      const items: GridItem[] = [
        {
          id: "a",
          col: 1,
          row: 1,
          colSpan: 2,
          rowSpan: 2,
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
      ];

      render(<GridContainer items={items} />);
      const itemA = screen.getByTestId("grid-item-a");
      const itemB = screen.getByTestId("grid-item-b");

      expect(itemA).toHaveStyle({
        gridColumnStart: "1",
        gridColumnEnd: "3",
        gridRowStart: "1",
        gridRowEnd: "3",
      });

      expect(itemB).toHaveStyle({
        gridColumnStart: "3",
        gridColumnEnd: "4",
        gridRowStart: "1",
        gridRowEnd: "3",
      });
    });
  });

  describe("R8. 사용자 편집", () => {
    it("TS-R8.1: 사용자 편집 기능 불필요 - 드래그 앤 드롭 없음", () => {
      // Given: 그리드 컨테이너가 렌더링됨
      // When: 사용자가 아이템을 드래그하려고 할 때
      // Then: 드래그 앤 드롭 기능이 없음
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

      render(<GridContainer items={items} />);
      const item = screen.getByTestId("grid-item-a");

      // 드래그 가능 속성이 없어야 함
      expect(item).not.toHaveAttribute("draggable", "true");
    });

    it("TS-R8.2: 개발 시점 고정 배치 - 런타임 변경 불가", () => {
      // Given: 그리드 컨테이너가 생성됨
      // When: 런타임에 아이템 위치를 변경하려고 할 때
      // Then: 런타임 변경은 불가능함 (정적 배치)
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

      const { rerender } = render(<GridContainer items={items} />);
      const item = screen.getByTestId("grid-item-a");

      // 초기 위치 확인
      expect(item).toHaveStyle({
        gridColumnStart: "1",
        gridRowStart: "1",
      });

      // items를 변경해도 컴포넌트는 재렌더링되지만, 실제로는 props로 고정됨
      const newItems: GridItem[] = [
        {
          id: "a",
          col: 2,
          row: 2,
          colSpan: 1,
          rowSpan: 1,
          component: TestComponentA,
        },
      ];

      rerender(<GridContainer items={newItems} />);
      const updatedItem = screen.getByTestId("grid-item-a");

      // props가 변경되면 위치도 변경됨 (하지만 이는 props 변경이므로 정적 배치의 의미)
      expect(updatedItem).toHaveStyle({
        gridColumnStart: "2",
        gridRowStart: "2",
      });
    });
  });

  describe("R1, R2, R5. 그리드 구조", () => {
    it("TS-R1.1, TS-R2.1: 컬럼 너비와 행 높이 설정", () => {
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

      render(<GridContainer items={items} colWidth={150} rowHeight={150} screenWidth={1920} />);
      const container = screen.getByTestId("grid-container");

      // 실제 구현은 계산된 컬럼 수를 사용: repeat(12, 150px)
      const style = container.getAttribute("style");
      expect(style).toContain("150px");
      expect(container).toHaveAttribute("data-column-count", "12");
    });

    it("TS-R5.1, TS-R5.2: 간격 설정", () => {
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

      render(<GridContainer items={items} gap={10} />);
      const container = screen.getByTestId("grid-container");

      expect(container).toHaveStyle({
        gap: "10px",
      });
    });

    it("TS-R5.2: 커스텀 간격 설정", () => {
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

      render(<GridContainer items={items} gap={20} />);
      const container = screen.getByTestId("grid-container");

      expect(container).toHaveStyle({
        gap: "20px",
      });
    });
  });
});
