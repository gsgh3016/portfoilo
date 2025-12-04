/**
 * useThrottle 훅
 *
 * REQ-001-002-004, REQ-001-004: 성능 최적화
 * 리사이즈 이벤트 등의 빈번한 이벤트를 쓰로틀링하여 성능 개선
 */

import { useRef, useCallback } from "react";

/**
 * 함수를 쓰로틀링하는 훅
 * @param callback 쓰로틀링할 함수
 * @param delay 지연 시간 (ms)
 * @returns 쓰로틀링된 함수
 */
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 100
): T {
  const lastRun = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();

      // 마지막 실행으로부터 delay 시간이 지났으면 즉시 실행
      if (now - lastRun.current >= delay) {
        lastRun.current = now;
        callback(...args);
      } else {
        // 아직 delay 시간이 지나지 않았으면, 남은 시간 후에 실행하도록 예약
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        const remainingTime = delay - (now - lastRun.current);
        timeoutRef.current = setTimeout(() => {
          lastRun.current = Date.now();
          callback(...args);
        }, remainingTime);
      }
    }) as T,
    [callback, delay]
  );
}
