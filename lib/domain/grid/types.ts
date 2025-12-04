/**
 * 그리드 레이아웃 시스템 타입 정의
 */

import React from "react";

export interface GridItem {
  id: string;
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  component: React.ComponentType;
}

export interface GridValidationError {
  type: "invalid_position" | "overflow" | "overlap";
  message: string;
  itemId?: string;
}
