/**
 * 그리드 검증 로직
 *
 * REQ-001-002-005 (R7): 검증
 * - 아이템 겹침 방지, 오버플로우 검증, 유효성 검증
 */

import { GridItem, GridValidationError } from "./types";

/**
 * 위치 유효성 검증 (REQ-001-002-005: R7.4)
 * @param item 그리드 아이템
 * @returns 유효성 검증 결과
 */
export function validateItemPosition(item: GridItem): {
  isValid: boolean;
  error?: GridValidationError;
} {
  if (item.col <= 0 || item.row <= 0) {
    return {
      isValid: false,
      error: {
        type: "invalid_position",
        message: `Invalid position: col and row must be positive (got col=${item.col}, row=${item.row})`,
        itemId: item.id,
      },
    };
  }

  if (item.colSpan <= 0 || item.rowSpan <= 0) {
    return {
      isValid: false,
      error: {
        type: "invalid_position",
        message: `Invalid span: colSpan and rowSpan must be positive (got colSpan=${item.colSpan}, rowSpan=${item.rowSpan})`,
        itemId: item.id,
      },
    };
  }

  return { isValid: true };
}

/**
 * 오버플로우 검증 (REQ-001-002-004: R6.3)
 * @param item 그리드 아이템
 * @param columnCount 현재 컬럼 수
 * @returns 오버플로우 검증 결과
 */
export function validateOverflow(
  item: GridItem,
  columnCount: number
): {
  isValid: boolean;
  error?: GridValidationError;
} {
  if (item.col + item.colSpan > columnCount + 1) {
    return {
      isValid: false,
      error: {
        type: "overflow",
        message: `Item ${item.id} overflows grid: col ${item.col} + colSpan ${
          item.colSpan
        } > ${columnCount + 1}`,
        itemId: item.id,
      },
    };
  }

  return { isValid: true };
}

/**
 * 두 아이템이 겹치는지 확인 (REQ-001-002-005: R7.1)
 * @param itemA 첫 번째 아이템
 * @param itemB 두 번째 아이템
 * @returns 겹침 여부
 */
export function checkOverlap(itemA: GridItem, itemB: GridItem): boolean {
  const aColEnd = itemA.col + itemA.colSpan;
  const aRowEnd = itemA.row + itemA.rowSpan;
  const bColEnd = itemB.col + itemB.colSpan;
  const bRowEnd = itemB.row + itemB.rowSpan;

  // 겹치지 않는 경우: 한 아이템이 다른 아이템의 오른쪽/아래쪽에 있음
  return !(
    itemA.col >= bColEnd ||
    aColEnd <= itemB.col ||
    itemA.row >= bRowEnd ||
    aRowEnd <= itemB.row
  );
}

/**
 * 겹침 검증 (REQ-001-002-005: R7.2, R7.3)
 * @param items 그리드 아이템 배열
 * @returns 겹침 검증 결과
 */
export function validateOverlap(items: GridItem[]): {
  isValid: boolean;
  errors?: GridValidationError[];
} {
  const errors: GridValidationError[] = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (checkOverlap(items[i], items[j])) {
        errors.push({
          type: "overlap",
          message: `Items ${items[i].id} and ${items[j].id} overlap`,
          itemId: items[i].id,
        });
      }
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  return { isValid: true };
}

/**
 * 전체 검증 (REQ-001-002-005: R7)
 * 위치 유효성 + 오버플로우 + 겹침 검증
 * @param items 그리드 아이템 배열
 * @param columnCount 현재 컬럼 수
 * @returns 검증 결과
 */
export function validateGridItems(
  items: GridItem[],
  columnCount: number
): {
  isValid: boolean;
  errors?: GridValidationError[];
} {
  const errors: GridValidationError[] = [];

  // 위치 유효성 검증
  for (const item of items) {
    const positionValidation = validateItemPosition(item);
    if (!positionValidation.isValid && positionValidation.error) {
      errors.push(positionValidation.error);
    }
  }

  // 오버플로우 검증
  for (const item of items) {
    const overflowValidation = validateOverflow(item, columnCount);
    if (!overflowValidation.isValid && overflowValidation.error) {
      errors.push(overflowValidation.error);
    }
  }

  // 겹침 검증
  const overlapValidation = validateOverlap(items);
  if (!overlapValidation.isValid && overlapValidation.errors) {
    errors.push(...overlapValidation.errors);
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  return { isValid: true };
}
