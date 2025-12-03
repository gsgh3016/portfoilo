# 옵션 1: Props로 직접 전달 (Declarative JSX)

## 구조

```tsx
<GridContainer gap={10} rowHeight={150} colWidth={150}>
  <GridItem col={1} row={1} colSpan={2} rowSpan={1}>
    <ComponentA />
  </GridItem>
  <GridItem col={3} row={1} colSpan={1} rowSpan={2}>
    <ComponentB />
  </GridItem>
</GridContainer>
```

## Pros

- ✅ JSX에서 직관적으로 레이아웃 확인 가능
- ✅ 각 아이템의 위치와 크기를 한눈에 파악
- ✅ TypeScript 타입 체크로 props 검증 용이
- ✅ 컴포넌트와 배치 정보가 함께 있어 가독성 좋음

## Cons

- ❌ 아이템이 많아지면 JSX가 길어짐
- ❌ 배치 정보와 컴포넌트가 분리되어 재사용 시 복사 필요
- ❌ 동일한 레이아웃을 여러 페이지에서 재사용하기 어려움

## 적합한 경우

- 아이템 수가 적을 때 (10개 이하)
- 각 페이지마다 레이아웃이 다를 때

---

## 관련 문서

- **옵션 목록**: [README.md](./README.md)
- **컴포넌트 구조 규칙**: [../rules/component-structure.md](../rules/component-structure.md)

