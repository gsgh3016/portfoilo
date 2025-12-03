# 옵션 3: 하이브리드 방식

## 구조

```tsx
const gridLayout = [
  { id: "a", col: 1, row: 1, colSpan: 2, rowSpan: 1 },
  { id: "b", col: 3, row: 1, colSpan: 1, rowSpan: 2 },
];

const components = {
  a: <ComponentA />,
  b: <ComponentB />,
};

<GridContainer
  gap={10}
  rowHeight={150}
  colWidth={150}
  layout={gridLayout}
  components={components}
/>;
```

## Pros

- ✅ 배치 정보와 컴포넌트를 분리하여 관리
- ✅ 배치 정보만 수정하여 레이아웃 변경 용이
- ✅ 컴포넌트는 별도로 관리하여 재사용 가능

## Cons

- ❌ 배치 정보와 컴포넌트를 매핑하는 로직 필요
- ❌ 구조가 복잡해질 수 있음
- ❌ id 기반 매핑으로 인한 실수 가능성

---

## 관련 문서

- **옵션 목록**: [README.md](./README.md)
- **컴포넌트 구조 규칙**: [../rules/component-structure.md](../rules/component-structure.md)

