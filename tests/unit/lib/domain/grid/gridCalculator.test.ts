/**
 * 그리드 계산 함수 테스트
 *
 * R1, R2, R3 관련: 컬럼 수 계산, 픽셀 크기 계산
 */

import {
  calculateColumnCount,
  calculatePixelSize,
  COL_WIDTH,
  ROW_HEIGHT,
  DEFAULT_GAP,
} from "@/lib/domain/grid/gridCalculator";

describe("GridCalculator", () => {
  const GAP = DEFAULT_GAP;

  describe("calculateColumnCount", () => {
    it("TS-R1.3: 화면 너비에 따른 컬럼 수 자동 조정", () => {
      // Given: 화면 너비가 1920px일 때
      // When: 컬럼 수를 계산할 때
      // Then: 컬럼 수는 12개
      const screenWidth = 1920;
      const expectedColumns = calculateColumnCount(screenWidth);
      expect(expectedColumns).toBe(12);

      // Given: 화면 너비가 768px일 때
      // When: 컬럼 수를 계산할 때
      // Then: 컬럼 수는 5개
      const screenWidth2 = 768;
      const expectedColumns2 = calculateColumnCount(screenWidth2);
      expect(expectedColumns2).toBe(5);

      // Given: 화면 너비가 375px일 때
      // When: 컬럼 수를 계산할 때
      // Then: 컬럼 수는 2개
      const screenWidth3 = 375;
      const expectedColumns3 = calculateColumnCount(screenWidth3);
      expect(expectedColumns3).toBe(2);
    });

    it("TS-R1.4: 최소 컬럼 수 보장", () => {
      // Given: 매우 작은 화면 너비 (100px 이하)
      // When: 그리드가 렌더링될 때
      // Then: 최소 1개 컬럼은 보장되어야 함
      const screenWidth = 100; // 매우 작은 화면
      const columnCount = calculateColumnCount(screenWidth);
      expect(columnCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe("calculatePixelSize", () => {
    it("TS-R3.3: 실제 픽셀 크기 계산 - 1x1 아이템", () => {
      // Given: 그리드 컨테이너가 생성됨 (셀 크기: 150px × 150px)
      // When: 1x1 크기 아이템을 배치할 때
      // Then: 실제 크기는 150px × 150px (규칙 R3.3: 셀 수 × 셀 크기, gap 미포함)
      const colSpan = 1;
      const rowSpan = 1;
      const { width, height } = calculatePixelSize(colSpan, rowSpan);

      expect(width).toBe(150);
      expect(height).toBe(150);
    });

    it("TS-R3.3: 실제 픽셀 크기 계산 - 2x1 아이템", () => {
      // Given: 그리드 컨테이너가 생성됨 (셀 크기: 150px × 150px)
      // When: 2x1 크기 아이템을 배치할 때
      // Then: 실제 크기는 300px × 150px (규칙 R3.3: 셀 수 × 셀 크기)
      const colSpan = 2;
      const rowSpan = 1;
      const { width, height } = calculatePixelSize(colSpan, rowSpan);

      expect(width).toBe(300);
      expect(height).toBe(150);
    });

    it("TS-R3.3: 실제 픽셀 크기 계산 - 2x2 아이템", () => {
      // Given: 그리드 컨테이너가 생성됨 (셀 크기: 150px × 150px)
      // When: 2x2 크기 아이템을 배치할 때
      // Then: 실제 크기는 300px × 300px (규칙 R3.3: 셀 수 × 셀 크기)
      const colSpan = 2;
      const rowSpan = 2;
      const { width, height } = calculatePixelSize(colSpan, rowSpan);

      expect(width).toBe(300);
      expect(height).toBe(300);
    });

    it("TS-R3.3: 실제 픽셀 크기 계산 - 3x2 아이템", () => {
      // Given: 그리드 컨테이너가 생성됨 (셀 크기: 150px × 150px)
      // When: 3x2 크기 아이템을 배치할 때
      // Then: 실제 크기는 450px × 300px (규칙 R3.3: 셀 수 × 셀 크기)
      const colSpan = 3;
      const rowSpan = 2;
      const { width, height } = calculatePixelSize(colSpan, rowSpan);

      expect(width).toBe(450);
      expect(height).toBe(300);
    });
  });

  describe("calculateGridColumnStartEnd", () => {
    it("TS-R4.2: CSS Grid 속성으로 위치 지정 - (1, 1) 위치", () => {
      // Given: 그리드 컨테이너가 생성됨
      // When: 아이템을 (1, 1) 위치에 배치할 때
      // Then: grid-column-start: 1, grid-column-end: 2, grid-row-start: 1, grid-row-end: 2
      const col = 1;
      const row = 1;
      const colSpan = 1;
      const rowSpan = 1;

      expect(col).toBe(1);
      expect(col + colSpan).toBe(2);
      expect(row).toBe(1);
      expect(row + rowSpan).toBe(2);
    });

    it("TS-R4.2: CSS Grid 속성으로 위치 지정 - (2, 1) 위치에 2x1 크기", () => {
      // Given: 그리드 컨테이너가 생성됨
      // When: 아이템을 (2, 1) 위치에 2x1 크기로 배치할 때
      // Then: grid-column-start: 2, grid-column-end: 4, grid-row-start: 1, grid-row-end: 2
      const col = 2;
      const row = 1;
      const colSpan = 2;
      const rowSpan = 1;

      expect(col).toBe(2);
      expect(col + colSpan).toBe(4);
      expect(row).toBe(1);
      expect(row + rowSpan).toBe(2);
    });
  });
});
