/**
 * ErrorBoundary 컴포넌트 테스트
 *
 * REQ-001-002-005 (R7.2, R7.3): 에러 처리
 * REQ-001-002-006 (R8, R9): 컴포넌트 구조
 */

import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { ErrorBoundary } from "@/app/error-boundary";

// 에러를 throw하는 테스트 컴포넌트
const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({
  shouldThrow = true,
}) => {
  if (shouldThrow) {
    throw new Error("Test error message");
  }
  return <div>Normal content</div>;
};

describe("ErrorBoundary", () => {
  // 원래 console.error를 저장하고 복원
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn(); // React의 에러 로그 억제
  });
  afterAll(() => {
    console.error = originalError;
  });

  describe("TS-R7.5.1: ErrorBoundary 기본 동작", () => {
    it("에러를 throw하는 자식 컴포넌트 → fallback UI 렌더링", () => {
      // Given: ErrorBoundary로 감싼 ThrowError 컴포넌트
      // When: ThrowError가 에러를 throw할 때
      // Then: ErrorBoundary가 fallback UI를 렌더링함
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText("그리드 레이아웃 오류")).toBeInTheDocument();
      expect(screen.getByText("Test error message")).toBeInTheDocument();
    });

    it("정상적인 자식 컴포넌트 → children 그대로 렌더링", () => {
      // Given: ErrorBoundary로 감싼 정상 컴포넌트
      // When: 자식 컴포넌트가 정상적으로 렌더링될 때
      // Then: ErrorBoundary는 children을 그대로 렌더링함
      render(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText("Normal content")).toBeInTheDocument();
      expect(
        screen.queryByText("그리드 레이아웃 오류")
      ).not.toBeInTheDocument();
    });
  });

  describe("TS-R7.5.2: 커스텀 Fallback 컴포넌트", () => {
    it("fallback prop 전달 시 → 커스텀 컴포넌트 렌더링", () => {
      // Given: ErrorBoundary에 커스텀 fallback 컴포넌트가 전달됨
      // When: 자식 컴포넌트가 에러를 throw할 때
      // Then: 기본 fallback UI 대신 커스텀 fallback 컴포넌트가 렌더링됨
      const CustomFallback: React.FC<{
        error: Error;
        resetError: () => void;
      }> = ({ error, resetError }) => (
        <div>
          <p>Custom error: {error.message}</p>
          <button onClick={resetError}>Reset</button>
        </div>
      );

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(
        screen.getByText("Custom error: Test error message")
      ).toBeInTheDocument();
      expect(
        screen.queryByText("그리드 레이아웃 오류")
      ).not.toBeInTheDocument();
    });

    it("커스텀 fallback에 error, resetError가 prop으로 전달됨", () => {
      // Given: ErrorBoundary에 커스텀 fallback 컴포넌트가 전달됨
      // When: 자식 컴포넌트가 에러를 throw할 때
      // Then: 커스텀 fallback 컴포넌트에 error와 resetError가 prop으로 전달됨
      const CustomFallback: React.FC<{
        error: Error;
        resetError: () => void;
      }> = ({ error, resetError }) => {
        expect(error).toBeInstanceOf(Error);
        expect(typeof resetError).toBe("function");
        return <div>Custom fallback</div>;
      };

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError />
        </ErrorBoundary>
      );
    });
  });

  describe("TS-R7.5.3: 에러 리셋 기능", () => {
    it("기본 fallback의 '다시 시도' 버튼 클릭 → 에러 상태 초기화", () => {
      // Given: ErrorBoundary가 에러를 catch하여 fallback UI를 표시 중임
      // When: "다시 시도" 버튼을 클릭할 때
      // Then: 에러 상태가 초기화되고 children이 다시 렌더링됨
      // Note: resetError는 state만 초기화하므로, children이 에러를 throw하지 않아야 정상 렌더링됨
      // 따라서 resetError 호출 전에 children을 에러를 throw하지 않는 컴포넌트로 변경해야 함
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      expect(screen.getByText("그리드 레이아웃 오류")).toBeInTheDocument();

      // resetError 호출 전에 children을 에러를 throw하지 않는 컴포넌트로 변경
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // resetError 호출
      const resetButton = screen.getByText("다시 시도");
      fireEvent.click(resetButton);

      // resetError 후 children이 정상적으로 렌더링됨
      expect(
        screen.queryByText("그리드 레이아웃 오류")
      ).not.toBeInTheDocument();
      expect(screen.getByText("Normal content")).toBeInTheDocument();
    });

    it("커스텀 fallback의 resetError 호출 → 에러 상태 초기화", async () => {
      // Given: ErrorBoundary가 에러를 catch하여 커스텀 fallback을 표시 중임
      // When: 커스텀 fallback의 resetError 함수를 호출할 때
      // Then: 에러 상태가 초기화되고 children이 다시 렌더링됨
      // Note: resetError는 state만 초기화하므로, children이 에러를 throw하지 않아야 정상 렌더링됨
      let capturedResetError: (() => void) | null = null;
      const CustomFallback: React.FC<{
        error: Error;
        resetError: () => void;
      }> = ({ error, resetError }) => {
        capturedResetError = resetError;
        return (
          <div>
            <p>Custom error</p>
            <button onClick={resetError}>Custom Reset</button>
          </div>
        );
      };

      const { rerender } = render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      expect(screen.getByText("Custom error")).toBeInTheDocument();

      // resetError 호출 전에 children을 에러를 throw하지 않는 컴포넌트로 변경
      rerender(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // resetError 호출
      if (capturedResetError) {
        act(() => {
          capturedResetError && capturedResetError();
        });
      }

      // resetError 후 children이 정상적으로 렌더링됨
      await waitFor(() => {
        expect(screen.queryByText("Custom error")).not.toBeInTheDocument();
      });
      expect(screen.getByText("Normal content")).toBeInTheDocument();
    });
  });

  describe("TS-R7.5.4: 개발 모드 상세 정보 표시", () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it("NODE_ENV='development' → 스택 트레이스 표시", () => {
      // Given: ErrorBoundary가 에러를 catch하여 fallback UI를 표시 중임
      // When: NODE_ENV가 \"development\"일 때
      // Then: 에러 스택 트레이스가 details 요소로 표시됨
      process.env.NODE_ENV = "development";

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText("상세 정보 (개발 모드)")).toBeInTheDocument();
      const details = screen
        .getByText("상세 정보 (개발 모드)")
        .closest("details");
      expect(details).toBeInTheDocument();
    });

    it("NODE_ENV='production' → 스택 트레이스 미표시", () => {
      // Given: ErrorBoundary가 에러를 catch하여 fallback UI를 표시 중임
      // When: NODE_ENV가 \"production\"일 때
      // Then: 에러 스택 트레이스가 표시되지 않음
      process.env.NODE_ENV = "production";

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(
        screen.queryByText("상세 정보 (개발 모드)")
      ).not.toBeInTheDocument();
    });
  });
});
