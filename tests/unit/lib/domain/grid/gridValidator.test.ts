/**
 * 그리드 검증 로직 테스트
 *
 * REQ-001-002-005 (R7): 검증
 * REQ-001-002-004 (R6.3): 반응형 동작 - 오버플로우 검증
 * - 아이템 겹침 방지, 오버플로우 검증, 유효성 검증
 */

import { GridItem } from "@/lib/domain/grid/types";
import {
  validateItemPosition,
  validateOverflow,
  checkOverlap,
  validateOverlap,
} from "@/lib/domain/grid/gridValidator";

describe("GridValidator", () => {
  const COL_WIDTH = 150;
  const ROW_HEIGHT = 150;
  const GAP = 10;

  describe("validateItemPosition", () => {
    it("TS-R7.4: 위치 유효성 검증 - 음수 위치는 허용 안 함", () => {
      // Given: 그리드 컨테이너가 생성됨
      // When: 음수 위치(col 또는 row)를 전달할 때
      // Then: 에러가 발생함
      const item1: GridItem = {
        id: "a",
        col: -1,
        row: 1,
        colSpan: 1,
        rowSpan: 1,
      };

      const item2: GridItem = {
        id: "b",
        col: 1,
        row: -1,
        colSpan: 1,
        rowSpan: 1,
      };

      const validation1 = validateItemPosition(item1);
      const validation2 = validateItemPosition(item2);

      expect(validation1.isValid).toBe(false);
      expect(validation2.isValid).toBe(false);
    });

    it("TS-R7.4: 위치 유효성 검증 - 0 또는 음수 colSpan은 허용 안 함", () => {
      // Given: 그리드 컨테이너가 생성됨
      // When: 0 또는 음수 colSpan을 전달할 때
      // Then: 에러가 발생함
      const item1: GridItem = {
        id: "a",
        col: 1,
        row: 1,
        colSpan: 0,
        rowSpan: 1,
      };

      const item2: GridItem = {
        id: "b",
        col: 1,
        row: 1,
        colSpan: -1,
        rowSpan: 1,
      };

      const validation1 = validateItemPosition(item1);
      const validation2 = validateItemPosition(item2);

      expect(validation1.isValid).toBe(false);
      expect(validation2.isValid).toBe(false);
    });

    it("TS-R7.4: 위치 유효성 검증 - 0 또는 음수 rowSpan은 허용 안 함", () => {
      // Given: 그리드 컨테이너가 생성됨
      // When: 0 또는 음수 rowSpan을 전달할 때
      // Then: 에러가 발생함
      const item1: GridItem = {
        id: "a",
        col: 1,
        row: 1,
        colSpan: 1,
        rowSpan: 0,
      };

      const item2: GridItem = {
        id: "b",
        col: 1,
        row: 1,
        colSpan: 1,
        rowSpan: -1,
      };

      const validation1 = validateItemPosition(item1);
      const validation2 = validateItemPosition(item2);

      expect(validation1.isValid).toBe(false);
      expect(validation2.isValid).toBe(false);
    });

    it("유효한 위치는 통과해야 함", () => {
      const item: GridItem = {
        id: "a",
        col: 1,
        row: 1,
        colSpan: 2,
        rowSpan: 1,
      };

      const validation = validateItemPosition(item);
      expect(validation.isValid).toBe(true);
    });
  });

  describe("validateOverflow", () => {
    it("TS-R6.3: 오버플로우 검증 - 그리드 영역을 벗어난 위치", () => {
      // Given: 768px 화면에서 5개 컬럼 그리드가 생성됨
      // When: 아이템을 (6, 1) 위치에 배치하려고 할 때
      // Then: 그리드 영역을 벗어나므로 에러가 발생함
      const columnCount = 5;
      const item: GridItem = {
        id: "a",
        col: 6,
        row: 1,
        colSpan: 1,
        rowSpan: 1,
      };

      const validation = validateOverflow(item, columnCount);
      expect(validation.isValid).toBe(false);
    });

    it("TS-R6.3: 오버플로우 검증 - 375px 화면에서 2개 컬럼 그리드", () => {
      // Given: 375px 화면에서 2개 컬럼 그리드가 생성됨
      // When: 아이템을 (3, 1) 위치에 배치하려고 할 때
      // Then: 그리드 영역을 벗어나므로 에러가 발생함
      const columnCount = 2;
      const item: GridItem = {
        id: "a",
        col: 3,
        row: 1,
        colSpan: 1,
        rowSpan: 1,
      };

      const validation = validateOverflow(item, columnCount);
      expect(validation.isValid).toBe(false);
    });

    it("TS-R6.3: 오버플로우 검증 - colSpan이 큰 경우", () => {
      const columnCount = 5;
      const item: GridItem = {
        id: "a",
        col: 4,
        row: 1,
        colSpan: 3,
        rowSpan: 1,
      };

      const validation = validateOverflow(item, columnCount);
      expect(validation.isValid).toBe(false);
    });

    it("유효한 범위 내 위치는 통과해야 함", () => {
      const columnCount = 12;
      const item: GridItem = {
        id: "a",
        col: 5,
        row: 1,
        colSpan: 2,
        rowSpan: 1,
      };

      const validation = validateOverflow(item, columnCount);
      expect(validation.isValid).toBe(true);
    });
  });

  describe("validateOverlap", () => {
    it("TS-R7.1: 겹침 허용 안 함 - 완전히 겹치는 경우", () => {
      // Given: 아이템 A가 (1, 1) 위치에 2x2 크기로 배치됨
      // When: 아이템 B를 (1, 1) 위치에 2x2 크기로 배치하려고 할 때
      // Then: 완전히 겹치므로 에러가 발생함
      const itemA: GridItem = {
        id: "a",
        col: 1,
        row: 1,
        colSpan: 2,
        rowSpan: 2,
      };

      const itemB: GridItem = {
        id: "b",
        col: 1,
        row: 1,
        colSpan: 2,
        rowSpan: 2,
      };

      const isOverlapping = checkOverlap(itemA, itemB);
      expect(isOverlapping).toBe(true);
    });

    it("TS-R7.2: 겹침 감지 시 에러 발생 - 부분적으로 겹치는 경우", () => {
      // Given: 아이템 A가 (1, 1) 위치에 2x2 크기로 배치됨
      // When: 아이템 B를 (2, 2) 위치에 1x1 크기로 배치하려고 할 때
      // Then: 겹침이 감지되어 에러가 발생하거나 경고가 표시됨
      const itemA: GridItem = {
        id: "a",
        col: 1,
        row: 1,
        colSpan: 2,
        rowSpan: 2,
      };

      const itemB: GridItem = {
        id: "b",
        col: 2,
        row: 2,
        colSpan: 1,
        rowSpan: 1,
      };

      const isOverlapping = checkOverlap(itemA, itemB);
      expect(isOverlapping).toBe(true);
    });

    it("TS-R7.2: 겹침 감지 시 에러 발생 - 부분적으로 겹치는 경우 (2x1)", () => {
      // Given: 아이템 A가 (1, 1) 위치에 2x1 크기로 배치됨
      // When: 아이템 B를 (2, 1) 위치에 2x1 크기로 배치하려고 할 때
      // Then: 부분적으로 겹치므로 에러가 발생함
      const itemA: GridItem = {
        id: "a",
        col: 1,
        row: 1,
        colSpan: 2,
        rowSpan: 1,
      };

      const itemB: GridItem = {
        id: "b",
        col: 2,
        row: 1,
        colSpan: 2,
        rowSpan: 1,
      };

      const isOverlapping = checkOverlap(itemA, itemB);
      expect(isOverlapping).toBe(true);
    });

    it("겹치지 않는 아이템은 통과해야 함", () => {
      const itemA: GridItem = {
        id: "a",
        col: 1,
        row: 1,
        colSpan: 2,
        rowSpan: 1,
      };

      const itemB: GridItem = {
        id: "b",
        col: 3,
        row: 1,
        colSpan: 1,
        rowSpan: 1,
      };

      const isOverlapping = checkOverlap(itemA, itemB);
      expect(isOverlapping).toBe(false);
    });

    it("TS-R7.3: 겹침 검증 시점 - 겹치지 않는 아이템 배열", () => {
      // Given: 그리드 컨테이너가 생성됨
      // When: 겹치지 않는 아이템 배열을 전달할 때
      // Then: 검증이 통과하여 정상적으로 렌더링됨
      const items: GridItem[] = [
        { id: "a", col: 1, row: 1, colSpan: 2, rowSpan: 1 },
        { id: "b", col: 3, row: 1, colSpan: 1, rowSpan: 2 },
        { id: "c", col: 4, row: 1, colSpan: 1, rowSpan: 1 },
      ];

      const validation = validateOverlap(items);
      expect(validation.isValid).toBe(true);
    });

    it("TS-R7.3: 겹침 검증 시점 - 겹치는 아이템 배열", () => {
      // Given: 그리드 컨테이너가 생성됨
      // When: 겹치는 아이템 배열을 전달할 때
      // Then: 개발 시점 또는 런타임 초기화 시점에 겹침 검증이 수행됨
      const items: GridItem[] = [
        { id: "a", col: 1, row: 1, colSpan: 2, rowSpan: 2 },
        { id: "b", col: 2, row: 2, colSpan: 1, rowSpan: 1 },
      ];

      const validation = validateOverlap(items);
      expect(validation.isValid).toBe(false);
    });
  });
});
