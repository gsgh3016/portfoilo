/**
 * useThrottle 훅 테스트
 *
 * REQ-001-002-004 (R6.1, R6.2): 반응형 동작 - 성능 최적화
 * REQ-001-004: 제약사항 - 성능
 */

import { renderHook, act } from "@testing-library/react";
import { useThrottle } from "@/lib/hooks/useThrottle";

describe("useThrottle", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe("TS-R6.4.1: useThrottle 기본 동작", () => {
    it("delay 내 다중 호출 → 첫 번째 즉시 실행, 이후 delay 후 마지막 호출만 실행", () => {
      // Given: useThrottle 훅이 생성되고, delay가 100ms로 설정됨
      // When: delay 시간(100ms) 내에 함수가 여러 번 호출될 때
      // Then: 첫 번째 호출은 즉시 실행되고, 이후 호출은 delay 경과 후 마지막 호출만 실행됨
      const callback = jest.fn();
      const { result } = renderHook(() => useThrottle(callback, 100));

      // 첫 번째 호출: 즉시 실행
      act(() => {
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // 50ms 후 두 번째 호출: 아직 delay 경과 전이므로 실행되지 않음
      act(() => {
        jest.advanceTimersByTime(50);
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // 50ms 후 (총 100ms): 남은 시간 후 실행됨
      act(() => {
        jest.advanceTimersByTime(50);
      });
      expect(callback).toHaveBeenCalledTimes(2);

      // 30ms 후 세 번째 호출: 아직 delay 경과 전
      act(() => {
        jest.advanceTimersByTime(30);
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(2);

      // 70ms 후 (총 200ms): 남은 시간 후 실행됨
      act(() => {
        jest.advanceTimersByTime(70);
      });
      expect(callback).toHaveBeenCalledTimes(3);
    });

    it("delay 이상 경과 후 호출 → 즉시 실행", () => {
      // Given: useThrottle 훅이 생성되고, delay가 100ms로 설정됨
      // When: delay 시간(100ms) 이상 경과 후 함수가 호출될 때
      // Then: 함수가 즉시 실행됨
      const callback = jest.fn();
      const { result } = renderHook(() => useThrottle(callback, 100));

      // 첫 번째 호출
      act(() => {
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // 100ms 이상 경과 후 두 번째 호출: 즉시 실행
      act(() => {
        jest.advanceTimersByTime(100);
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(2);

      // 150ms 경과 후 세 번째 호출: 즉시 실행
      act(() => {
        jest.advanceTimersByTime(150);
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(3);
    });
  });

  describe("TS-R6.4.2: useThrottle 타이밍 검증", () => {
    it("50ms 후 재호출 → 첫 번째 즉시 실행, 두 번째 50ms 후 실행", () => {
      // Given: useThrottle 훅이 생성되고, delay가 100ms로 설정됨
      // When: 함수가 호출되고, 50ms 후 다시 호출될 때
      // Then: 첫 번째 호출은 즉시 실행되고, 두 번째 호출은 50ms 후(남은 시간) 실행됨
      const callback = jest.fn();
      const { result } = renderHook(() => useThrottle(callback, 100));

      const startTime = Date.now();
      jest.spyOn(Date, "now").mockReturnValue(startTime);

      // 첫 번째 호출
      act(() => {
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // 50ms 경과
      (Date.now as jest.Mock).mockReturnValue(startTime + 50);

      // 두 번째 호출: 아직 delay 경과 전이므로 실행되지 않음
      act(() => {
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // 남은 50ms 경과: 두 번째 호출 실행
      act(() => {
        jest.advanceTimersByTime(50);
      });
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it("100ms 이상 경과 후 재호출 → 두 번째도 즉시 실행", () => {
      // Given: useThrottle 훅이 생성되고, delay가 100ms로 설정됨
      // When: 함수가 호출되고, 100ms 이상 경과 후 다시 호출될 때
      // Then: 두 번째 호출도 즉시 실행됨
      const callback = jest.fn();
      const { result } = renderHook(() => useThrottle(callback, 100));

      // 첫 번째 호출
      act(() => {
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // 100ms 이상 경과
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // 두 번째 호출: 즉시 실행
      act(() => {
        result.current();
      });
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe("TS-R6.4.3: useThrottle 인자 전달", () => {
    it("단일 인자 전달 → 원본 함수에 인자 전달 확인", () => {
      // Given: useThrottle 훅이 생성되고, 인자를 받는 함수가 전달됨
      // When: 쓰로틀링된 함수에 인자를 전달하여 호출할 때
      // Then: 원본 함수에 인자가 올바르게 전달됨
      const callback = jest.fn();
      const { result } = renderHook(() => useThrottle(callback, 100));

      act(() => {
        result.current("test-arg");
      });

      expect(callback).toHaveBeenCalledWith("test-arg");
    });

    it("여러 인자 전달 → 모든 인자 전달 확인", () => {
      // Given: useThrottle 훅이 생성되고, 여러 인자를 받는 함수가 전달됨
      // When: 쓰로틀링된 함수에 여러 인자를 전달하여 호출할 때
      // Then: 원본 함수에 모든 인자가 올바르게 전달됨
      const callback = jest.fn();
      const { result } = renderHook(() => useThrottle(callback, 100));

      act(() => {
        result.current("arg1", "arg2", 123);
      });

      expect(callback).toHaveBeenCalledWith("arg1", "arg2", 123);
    });

    it("delay 내 다중 호출 시 마지막 호출의 인자만 전달됨", () => {
      // Given: useThrottle 훅이 생성되고, delay가 100ms로 설정됨
      // When: delay 내에 여러 번 호출하고 각각 다른 인자를 전달할 때
      // Then: 마지막 호출의 인자만 원본 함수에 전달됨
      const callback = jest.fn();
      const { result } = renderHook(() => useThrottle(callback, 100));

      // 첫 번째 호출
      act(() => {
        result.current("first");
      });
      expect(callback).toHaveBeenCalledWith("first");

      // 50ms 후 두 번째 호출
      act(() => {
        jest.advanceTimersByTime(50);
        result.current("second");
      });
      expect(callback).toHaveBeenCalledTimes(1); // 아직 실행되지 않음

      // 30ms 후 세 번째 호출
      act(() => {
        jest.advanceTimersByTime(30);
        result.current("third");
      });
      expect(callback).toHaveBeenCalledTimes(1); // 아직 실행되지 않음

      // 남은 시간 후 실행: 마지막 호출("third")만 실행됨
      act(() => {
        jest.advanceTimersByTime(20);
      });
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith("third");
      expect(callback).not.toHaveBeenCalledWith("second");
    });
  });
});


