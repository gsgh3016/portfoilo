# 옵션 2: 배열 데이터 구조로 전달 (Data-Driven) ⭐ 권장

## 구조

```tsx
const gridItems = [
  { id: "a", col: 1, row: 1, colSpan: 2, rowSpan: 1, component: ComponentA },
  { id: "b", col: 3, row: 1, colSpan: 1, rowSpan: 2, component: ComponentB },
];

<GridContainer gap={10} rowHeight={150} colWidth={150} items={gridItems} />;
```

## Pros

- ✅ 배치 정보를 데이터로 분리하여 관리 용이
- ✅ JSON 파일이나 별도 설정 파일로 관리 가능
- ✅ 동일한 레이아웃을 여러 페이지에서 재사용 가능
- ✅ 배치 정보만 수정하여 레이아웃 변경 용이
- ✅ 아이템이 많아도 코드가 깔끔함

## Cons

- ❌ JSX에서 레이아웃을 한눈에 파악하기 어려움
- ❌ 컴포넌트와 배치 정보가 분리되어 있어 연결 관계 파악 필요

## 적합한 경우

- 아이템 수가 많을 때 (10개 이상)
- 레이아웃을 여러 페이지에서 재사용할 때
- 향후 동적 레이아웃 확장을 고려할 때

---

## 관련 문서

- **옵션 목록**: [README.md](./README.md)
- **컴포넌트 구조 규칙**: [../rules/component-structure.md](../rules/component-structure.md)

