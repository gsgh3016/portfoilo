# 옵션 4: 설정 파일 (JSON/TypeScript)

## 구조

```typescript
// config/grid-layout.ts
export const dashboardLayout = [
  { id: "a", col: 1, row: 1, colSpan: 2, rowSpan: 1 },
  { id: "b", col: 3, row: 1, colSpan: 1, rowSpan: 2 },
] as const;

// components/dashboard.tsx
const componentMap = {
  a: ComponentA,
  b: ComponentB,
};

<GridContainer layout={dashboardLayout} componentMap={componentMap} />;
```

## Pros

- ✅ 배치 정보를 완전히 분리하여 관리
- ✅ 설정 파일을 여러 곳에서 import하여 재사용
- ✅ 타입 안정성 확보 (as const 사용)
- ✅ 향후 CMS나 서버에서 설정을 가져올 수 있음

## Cons

- ❌ 파일이 많아질 수 있음
- ❌ 컴포넌트와 배치 정보의 연결 관계 파악 필요
- ❌ 초기 설정이 복잡할 수 있음

---

## 관련 문서

- **옵션 목록**: [README.md](./README.md)
- **컴포넌트 구조 규칙**: [../rules/component-structure.md](../rules/component-structure.md)

