/**
 * 그리드 계산 함수
 *
 * REQ-001-002-001 (R1, R2, R5): 그리드 구조
 * REQ-001-002-002 (R3): 아이템 크기
 * - 컬럼 수 계산, 픽셀 크기 계산
 */

export const COL_WIDTH = 150;
export const ROW_HEIGHT = 150;
export const DEFAULT_GAP = 10;

/**
 * 화면 너비에 따른 컬럼 수 계산 (REQ-001-002-001: R1.3)
 *
 * ## 계산 공식
 * ```
 * columnCount = Math.floor(screenWidth / colWidth)
 * ```
 *
 * 가정 A4에 따르면 gap을 고려하지 않고 계산합니다.
 * 결과는 항상 내림 처리되며, 최소 1개 컬럼을 보장합니다.
 *
 * ## 예시
 * - 1920px 화면 너비, 150px 컬럼 너비: 1920 ÷ 150 = 12.8 → 12개
 * - 800px 화면 너비, 150px 컬럼 너비: 800 ÷ 150 = 5.33 → 5개
 * - 100px 화면 너비, 150px 컬럼 너비: 100 ÷ 150 = 0.67 → 1개 (최소값 보장)
 *
 * @param screenWidth 화면 너비 (px)
 * @param colWidth 컬럼 너비 (px, 기본값 150)
 * @param gap 그리드 간격 (px, 기본값 10) - 계산에는 사용하지 않음 (향후 확장 가능성)
 * @returns 컬럼 수 (최소 1개 보장)
 */
export function calculateColumnCount(
  screenWidth: number,
  colWidth: number = COL_WIDTH,
  gap: number = DEFAULT_GAP
): number {
  // 가정 A4에 따르면 gap을 고려하지 않고 계산
  const calculated = Math.floor(screenWidth / colWidth);
  return Math.max(1, calculated);
}

/**
 * 아이템의 실제 픽셀 크기 계산 (REQ-001-002-002: R3.3)
 * 규칙: 셀 수 × 셀 크기, gap 미포함
 * @param colSpan 컬럼 스팬
 * @param rowSpan 행 스팬
 * @param colWidth 컬럼 너비 (px, 기본값 150)
 * @param rowHeight 행 높이 (px, 기본값 150)
 * @returns { width, height } 픽셀 크기
 */
export function calculatePixelSize(
  colSpan: number,
  rowSpan: number,
  colWidth: number = COL_WIDTH,
  rowHeight: number = ROW_HEIGHT
): { width: number; height: number } {
  return {
    width: colSpan * colWidth,
    height: rowSpan * rowHeight,
  };
}

/**
 * CSS Grid 속성 값 계산 (REQ-001-002-003: R4.2)
 * grid-column-start/end, grid-row-start/end 계산
 * @param col 컬럼 위치
 * @param row 행 위치
 * @param colSpan 컬럼 스팬
 * @param rowSpan 행 스팬
 * @returns CSS Grid 속성 값
 */
export function calculateGridPosition(
  col: number,
  row: number,
  colSpan: number,
  rowSpan: number
): {
  gridColumnStart: number;
  gridColumnEnd: number;
  gridRowStart: number;
  gridRowEnd: number;
} {
  return {
    gridColumnStart: col,
    gridColumnEnd: col + colSpan,
    gridRowStart: row,
    gridRowEnd: row + rowSpan,
  };
}
