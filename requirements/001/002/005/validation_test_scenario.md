# 검증 규칙 테스트 시나리오

## R7. 아이템 겹침 방지

### TS-R7.1: 겹침 허용 안 함

**ID**: TS-R7.1  
**규칙**: R7.1  
**설명**: 아이템 간 겹침이 허용되지 않는지 검증

**Given**: 그리드 컨테이너가 생성됨  
**When**: 겹치는 아이템을 배치하려고 할 때  
**Then**: 겹침은 허용되지 않음

---

### TS-R7.2: 겹침 감지 시 에러 발생

**ID**: TS-R7.2  
**규칙**: R7.2  
**설명**: 겹침이 감지되면 에러가 발생하거나 경고가 표시되는지 검증

**Given**: 아이템 A가 (1, 1) 위치에 2x2 크기로 배치됨  
**When**: 아이템 B를 (2, 2) 위치에 1x1 크기로 배치하려고 할 때  
**Then**: 겹침이 감지되어 에러가 발생하거나 경고가 표시됨

**Given**: 아이템 A가 (1, 1) 위치에 2x2 크기로 배치됨  
**When**: 아이템 B를 (1, 1) 위치에 2x2 크기로 배치하려고 할 때  
**Then**: 완전히 겹치므로 에러가 발생함

**Given**: 아이템 A가 (1, 1) 위치에 2x1 크기로 배치됨  
**When**: 아이템 B를 (2, 1) 위치에 2x1 크기로 배치하려고 할 때  
**Then**: 부분적으로 겹치므로 에러가 발생함

---

### TS-R7.3: 겹침 검증 시점

**ID**: TS-R7.3  
**규칙**: R7.3  
**설명**: 겹침 검증이 개발 시점 또는 런타임 초기화 시점에 수행되는지 검증

**Given**: 그리드 컨테이너가 생성됨  
**When**: 겹치는 아이템 배열을 전달할 때  
**Then**: 개발 시점 또는 런타임 초기화 시점에 겹침 검증이 수행됨

**Given**: 그리드 컨테이너가 생성됨  
**When**: 겹치지 않는 아이템 배열을 전달할 때  
**Then**: 검증이 통과하여 정상적으로 렌더링됨

---

### TS-R7.4: 위치 유효성 검증

**ID**: TS-R7.4  
**규칙**: R7.3 (제약사항 반영)  
**설명**: 위치 유효성 검증 (음수 위치, 0 또는 음수 colSpan/rowSpan)

**Given**: 그리드 컨테이너가 생성됨  
**When**: 음수 위치(col 또는 row)를 전달할 때  
**Then**: 에러가 발생함

**Given**: 그리드 컨테이너가 생성됨  
**When**: 0 또는 음수 colSpan을 전달할 때  
**Then**: 에러가 발생함

**Given**: 그리드 컨테이너가 생성됨  
**When**: 0 또는 음수 rowSpan을 전달할 때  
**Then**: 에러가 발생함

---

## R7.5. 에러 처리 (ErrorBoundary)

### TS-R7.5.1: ErrorBoundary 기본 동작

**ID**: TS-R7.5.1  
**규칙**: R7.2, R7.3  
**설명**: 자식 컴포넌트가 에러를 throw할 때 ErrorBoundary가 fallback UI를 렌더링하는지 검증

**Given**: ErrorBoundary 컴포넌트가 생성되고, 에러를 throw하는 자식 컴포넌트가 있음  
**When**: 자식 컴포넌트가 에러를 throw할 때  
**Then**: ErrorBoundary가 에러를 catch하고 기본 fallback UI를 렌더링함

**Given**: ErrorBoundary 컴포넌트가 생성되고, 정상적인 자식 컴포넌트가 있음  
**When**: 자식 컴포넌트가 정상적으로 렌더링될 때  
**Then**: ErrorBoundary는 children을 그대로 렌더링함

---

### TS-R7.5.2: 커스텀 Fallback 컴포넌트

**ID**: TS-R7.5.2  
**규칙**: R7.2  
**설명**: fallback prop으로 전달된 커스텀 컴포넌트가 사용되는지 검증

**Given**: ErrorBoundary 컴포넌트가 생성되고, fallback prop에 커스텀 컴포넌트가 전달됨  
**When**: 자식 컴포넌트가 에러를 throw할 때  
**Then**: 기본 fallback UI 대신 커스텀 fallback 컴포넌트가 렌더링됨

**Given**: ErrorBoundary 컴포넌트가 생성되고, fallback prop에 커스텀 컴포넌트가 전달됨  
**When**: 자식 컴포넌트가 에러를 throw할 때  
**Then**: 커스텀 fallback 컴포넌트에 error와 resetError가 prop으로 전달됨

---

### TS-R7.5.3: 에러 리셋 기능

**ID**: TS-R7.5.3  
**규칙**: R7.2  
**설명**: resetError 버튼 클릭 시 에러 상태가 초기화되고 children이 다시 렌더링되는지 검증

**Given**: ErrorBoundary가 에러를 catch하여 fallback UI를 표시 중임  
**When**: "다시 시도" 버튼을 클릭할 때  
**Then**: 에러 상태가 초기화되고 children이 다시 렌더링됨

**Given**: ErrorBoundary가 에러를 catch하여 커스텀 fallback을 표시 중임  
**When**: 커스텀 fallback의 resetError 함수를 호출할 때  
**Then**: 에러 상태가 초기화되고 children이 다시 렌더링됨

---

### TS-R7.5.4: 개발 모드 상세 정보 표시

**ID**: TS-R7.5.4  
**규칙**: R7.2  
**설명**: 개발 모드에서만 에러 스택 트레이스가 표시되는지 검증

**Given**: ErrorBoundary가 에러를 catch하여 fallback UI를 표시 중임  
**When**: NODE_ENV가 "development"일 때  
**Then**: 에러 스택 트레이스가 details 요소로 표시됨

**Given**: ErrorBoundary가 에러를 catch하여 fallback UI를 표시 중임  
**When**: NODE_ENV가 "production"일 때  
**Then**: 에러 스택 트레이스가 표시되지 않음

---

### TS-R7.5.5: GridContainer와 ErrorBoundary 통합

**ID**: TS-R7.5.5  
**규칙**: R7.2, R7.3  
**설명**: GridContainer의 검증 실패 시 ErrorBoundary가 에러를 처리하는지 검증

**Given**: ErrorBoundary로 감싼 GridContainer가 있고, invalid items(오버플로우)가 전달됨  
**When**: GridContainer가 검증 실패로 에러를 throw할 때  
**Then**: ErrorBoundary가 에러를 catch하고 fallback UI를 표시함

**Given**: ErrorBoundary로 감싼 GridContainer가 있고, invalid items(겹침)가 전달됨  
**When**: GridContainer가 검증 실패로 에러를 throw할 때  
**Then**: ErrorBoundary fallback UI에 에러 메시지가 표시됨

**Given**: ErrorBoundary로 감싼 GridContainer가 있고, valid items가 전달됨  
**When**: GridContainer가 정상적으로 렌더링될 때  
**Then**: ErrorBoundary는 children을 그대로 렌더링함

---

## 관련 문서

- **규칙**: [validation.md](./validation.md)
- **아이템 배치**: [../003/item-placement.md](../003/item-placement.md)
- **제약사항**: [../../004/constraints.md](../../004/constraints.md)
