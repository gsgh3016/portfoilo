/**
 * GridContainer 컴포넌트
 *
 * 그리드 레이아웃 시스템의 메인 컨테이너 컴포넌트
 */

"use client";

import React from "react";
import { GridItem, GridConfig } from "@/lib/domain/grid/types";
import {
  calculateColumnCount,
  COL_WIDTH,
  ROW_HEIGHT,
  DEFAULT_GAP,
  calculateGridPosition,
} from "@/lib/domain/grid/gridCalculator";
import { validateGridItems } from "@/lib/domain/grid/gridValidator";

export interface GridContainerProps {
  gap?: number;
  rowHeight?: number;
  colWidth?: number;
  items: GridItem[];
  screenWidth?: number; // 테스트용, 실제로는 useWindowSize 훅 사용 권장
}

export const GridContainer: React.FC<GridContainerProps> = ({
  gap = DEFAULT_GAP,
  rowHeight = ROW_HEIGHT,
  colWidth = COL_WIDTH,
  items,
  screenWidth,
}) => {
  // 화면 너비가 제공되지 않으면 브라우저에서 가져오기 (클라이언트 사이드)
  const [currentScreenWidth, setCurrentScreenWidth] = React.useState<number>(
    screenWidth ?? (typeof window !== "undefined" ? window.innerWidth : 1920)
  );

  React.useEffect(() => {
    if (screenWidth !== undefined) {
      // 테스트용: screenWidth prop이 제공되면 사용 (prop 변경 시 업데이트)
      setCurrentScreenWidth(screenWidth);
      return;
    }

    // 실제 환경: window resize 이벤트 리스너
    const handleResize = () => {
      setCurrentScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [screenWidth]);

  // 컬럼 수 계산
  const columnCount = calculateColumnCount(currentScreenWidth, colWidth, gap);

  // 검증 수행
  const validation = validateGridItems(items, columnCount);
  if (!validation.isValid && validation.errors) {
    // 개발 시점 또는 런타임 초기화 시점에 에러 발생
    const errorMessages = validation.errors.map((e) => e.message).join("; ");
    throw new Error(`Grid validation failed: ${errorMessages}`);
  }

  return (
    <div
      data-testid="grid-container"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columnCount}, ${colWidth}px)`,
        gap: `${gap}px`,
        rowGap: `${gap}px`,
      }}
      data-column-count={columnCount}
    >
      {items.map((item) => {
        const gridPosition = calculateGridPosition(
          item.col,
          item.row,
          item.colSpan,
          item.rowSpan
        );

        return (
          <div
            key={item.id}
            data-testid={`grid-item-${item.id}`}
            style={{
              gridColumnStart: gridPosition.gridColumnStart,
              gridColumnEnd: gridPosition.gridColumnEnd,
              gridRowStart: gridPosition.gridRowStart,
              gridRowEnd: gridPosition.gridRowEnd,
            }}
          >
            <item.component />
          </div>
        );
      })}
    </div>
  );
};
