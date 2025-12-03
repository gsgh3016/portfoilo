/**
 * GridItem 렌더링 및 스타일 테스트
 * 
 * R3, R4 관련: 아이템 크기, 배치
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// 임시 컴포넌트 (실제 구현 전 테스트용)
interface GridItemProps {
  id: string;
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  children: React.ReactNode;
}

const GridItem: React.FC<GridItemProps> = ({
  col,
  row,
  colSpan,
  rowSpan,
  children,
}) => {
  return (
    <div
      data-testid={`grid-item-${col}-${row}`}
      style={{
        gridColumnStart: col,
        gridColumnEnd: col + colSpan,
        gridRowStart: row,
        gridRowEnd: row + rowSpan,
      }}
    >
      {children}
    </div>
  );
};

describe('GridItem', () => {
  describe('R3. 그리드 아이템 크기', () => {
    it('TS-R3.1: 다양한 크기 아이템 지원', () => {
      // Given: 그리드 컨테이너가 생성됨
      // When: 다양한 크기의 아이템을 배치할 때
      // Then: 1x1, 2x1, 1x2, 2x2, 3x2 등 다양한 크기가 지원됨
      const sizes = [
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 2, rowSpan: 1 },
        { colSpan: 1, rowSpan: 2 },
        { colSpan: 2, rowSpan: 2 },
        { colSpan: 3, rowSpan: 2 },
      ];

      sizes.forEach((size, index) => {
        const { container } = render(
          <GridItem
            id={`item-${index}`}
            col={1}
            row={1}
            colSpan={size.colSpan}
            rowSpan={size.rowSpan}
          >
            <div>Item {index}</div>
          </GridItem>
        );
        const item = container.querySelector(`[data-testid="grid-item-1-1"]`);
        expect(item).toBeInTheDocument();
      });
    });

    it('TS-R3.2: 셀 단위 크기 지정', () => {
      // Given: 그리드 컨테이너가 생성됨
      // When: 아이템 크기를 지정할 때
      // Then: 크기는 셀 단위로 지정됨 (예: 1x1, 2x1, 1x2, 2x2, 3x2)
      const { container } = render(
        <GridItem id="a" col={1} row={1} colSpan={2} rowSpan={1}>
          <div>Item</div>
        </GridItem>
      );

      const item = container.querySelector('[data-testid="grid-item-1-1"]');
      expect(item).toHaveStyle({
        gridColumnStart: '1',
        gridColumnEnd: '3',
        gridRowStart: '1',
        gridRowEnd: '2',
      });
    });
  });

  describe('R4. 그리드 아이템 배치', () => {
    it('TS-R4.2: CSS Grid 속성으로 위치 지정 - (1, 1) 위치', () => {
      // Given: 그리드 컨테이너가 생성됨
      // When: 아이템을 (1, 1) 위치에 배치할 때
      // Then: grid-column-start: 1, grid-column-end: 2, grid-row-start: 1, grid-row-end: 2 속성이 적용됨
      const { container } = render(
        <GridItem id="a" col={1} row={1} colSpan={1} rowSpan={1}>
          <div>Item</div>
        </GridItem>
      );

      const item = container.querySelector('[data-testid="grid-item-1-1"]');
      expect(item).toHaveStyle({
        gridColumnStart: '1',
        gridColumnEnd: '2',
        gridRowStart: '1',
        gridRowEnd: '2',
      });
    });

    it('TS-R4.2: CSS Grid 속성으로 위치 지정 - (2, 1) 위치에 2x1 크기', () => {
      // Given: 그리드 컨테이너가 생성됨
      // When: 아이템을 (2, 1) 위치에 2x1 크기로 배치할 때
      // Then: grid-column-start: 2, grid-column-end: 4, grid-row-start: 1, grid-row-end: 2 속성이 적용됨
      const { container } = render(
        <GridItem id="a" col={2} row={1} colSpan={2} rowSpan={1}>
          <div>Item</div>
        </GridItem>
      );

      const item = container.querySelector('[data-testid="grid-item-2-1"]');
      expect(item).toHaveStyle({
        gridColumnStart: '2',
        gridColumnEnd: '4',
        gridRowStart: '1',
        gridRowEnd: '2',
      });
    });

    it('TS-R4.3: 셀 경계 정렬', () => {
      // Given: 그리드 컨테이너가 생성됨
      // When: 아이템을 배치할 때
      // Then: 아이템은 셀 경계에 정렬됨
      const { container } = render(
        <GridItem id="a" col={3} row={2} colSpan={2} rowSpan={2}>
          <div>Item</div>
        </GridItem>
      );

      const item = container.querySelector('[data-testid="grid-item-3-2"]');
      
      // grid-column-start/end, grid-row-start/end는 정수 값이므로 셀 경계에 정렬됨
      expect(item).toHaveStyle({
        gridColumnStart: '3',
        gridColumnEnd: '5',
        gridRowStart: '2',
        gridRowEnd: '4',
      });
    });
  });
});

