"use client";

import React, { useEffect, type ReactNode } from "react";
import { logger } from "@/lib/logger";

/**
 * Error Boundary — catches unhandled React render errors and shows a
 * graceful fallback instead of a white screen.
 *
 * Logs the error to the structured logger and provides a retry button.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <YourComponent />
 *   </ErrorBoundary>
 */

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  /** Called when an error is caught — useful for telemetry. */
  onError?: (error: Error, info: React.ErrorInfo) => void;
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
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    logger.error("React render error caught", {
      error: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
    this.props.onError?.(error, info);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-[400px] flex items-center justify-center p-8"
          style={{ backgroundColor: "var(--color-base)" }}
        >
          <div
            className="max-w-md w-full border rounded-[16px] p-8 text-center"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-md)",
            }}
            role="alert"
          >
            <div
              className="mx-auto inline-flex items-center justify-center mb-4"
              style={{
                width: 56,
                height: 56,
                borderRadius: 999,
                backgroundColor: "var(--color-warning-light)",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="var(--color-warning)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2
              className="font-display font-bold"
              style={{
                fontSize: "var(--text-xl)",
                letterSpacing: "-0.2px",
                color: "var(--color-text-primary)",
              }}
            >
              Something went wrong
            </h2>
            <p
              className="mt-2"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
                lineHeight: "20px",
              }}
            >
              An unexpected error occurred while rendering this page. The error
              has been logged. Try again, or refresh the page.
            </p>
            {this.state.error && (
              <details
                className="mt-4 text-left"
                style={{
                  backgroundColor: "var(--color-surface-2)",
                  borderRadius: "var(--radius-sm)",
                  padding: "12px",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                  }}
                >
                  Error details
                </summary>
                <pre
                  className="mt-2 overflow-x-auto"
                  style={{
                    color: "var(--color-text-tertiary)",
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 11,
                    lineHeight: "16px",
                  }}
                >
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-[8px] transition-all duration-150 hover:shadow-[var(--shadow-md)]"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-text-inverse)",
                fontFamily: "var(--font-jakarta), sans-serif",
                fontWeight: 600,
                fontSize: "var(--text-sm)",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Global error handler hook — attaches window.onerror and
 * unhandledrejection listeners. Use in a top-level client component.
 */
export function useGlobalErrorHandler(): void {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logger.error("Unhandled window error", {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        col: event.colno,
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      logger.error("Unhandled promise rejection", {
        reason: event.reason instanceof Error
          ? event.reason.message
          : String(event.reason),
        stack: event.reason instanceof Error ? event.reason.stack : undefined,
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);
}
