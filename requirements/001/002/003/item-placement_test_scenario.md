# 아이템 배치 규칙 테스트 시나리오

## R4. 그리드 아이템 배치

### TS-R4.1: 수동 배치 방식

**ID**: TS-R4.1  
**규칙**: R4.1  
**설명**: 아이템 배치가 수동 배치 방식인지 검증

**Given**: 그리드 컨테이너가 생성됨  
**When**: 아이템을 배치할 때  
**Then**: 배치는 수동으로 지정해야 함 (자동 배치 불가)

**Given**: 그리드 컨테이너가 생성됨  
**When**: 아이템의 위치를 지정하지 않을 때  
**Then**: 아이템은 배치되지 않음 (에러 발생 또는 기본 위치 없음)

---

### TS-R4.2: CSS Grid 속성으로 위치 지정

**ID**: TS-R4.2  
**규칙**: R4.2  
**설명**: 각 아이템이 grid-column-start/end, grid-row-start/end 속성으로 위치를 지정할 수 있는지 검증

**Given**: 그리드 컨테이너가 생성됨  
**When**: 아이템을 (1, 1) 위치에 배치할 때  
**Then**: grid-column-start: 1, grid-column-end: 2, grid-row-start: 1, grid-row-end: 2 속성이 적용됨

**Given**: 그리드 컨테이너가 생성됨  
**When**: 아이템을 (2, 1) 위치에 2x1 크기로 배치할 때  
**Then**: grid-column-start: 2, grid-column-end: 4, grid-row-start: 1, grid-row-end: 2 속성이 적용됨

---

### TS-R4.3: 셀 경계 정렬

**ID**: TS-R4.3  
**규칙**: R4.3  
**설명**: 아이템이 그리드 셀 경계에 정렬되는지 검증

**Given**: 그리드 컨테이너가 생성됨  
**When**: 아이템을 배치할 때  
**Then**: 아이템은 셀 경계에 정렬됨

**Given**: 그리드 컨테이너가 생성됨  
**When**: 픽셀 단위 자유 배치를 시도할 때  
**Then**: 픽셀 단위 자유 배치는 불가능함 (에러 발생)

---

## 관련 문서

- **규칙**: [item-placement.md](./item-placement.md)
- **아이템 크기**: [../002/item-sizing.md](../002/item-sizing.md)
- **검증**: [../005/validation.md](../005/validation.md)

