/**
 * Error Boundary 컴포넌트
 *
 * REQ-001-002-005, REQ-001-002-006: 에러 처리 개선
 * GridContainer의 검증 실패 시 앱 크래시 방지
 */

"use client";

import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 개발 모드에서만 콘솔에 에러 정보 출력
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      // 기본 fallback UI
      return (
        <div
          style={{
            padding: "20px",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            backgroundColor: "#f5f5f5",
          }}
        >
          <h2 style={{ color: "#d32f2f", marginTop: 0 }}>
            그리드 레이아웃 오류
          </h2>
          <p style={{ color: "#666" }}>
            {this.state.error.message || "알 수 없는 오류가 발생했습니다."}
          </p>
          {process.env.NODE_ENV === "development" && (
            <details style={{ marginTop: "10px" }}>
              <summary style={{ cursor: "pointer", color: "#1976d2" }}>
                상세 정보 (개발 모드)
              </summary>
              <pre
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  overflow: "auto",
                  fontSize: "12px",
                }}
              >
                {this.state.error.stack}
              </pre>
            </details>
          )}
          <button
            onClick={this.resetError}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
