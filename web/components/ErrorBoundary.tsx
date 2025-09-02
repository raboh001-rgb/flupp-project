'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // You could send this to services like Sentry, LogRocket, etc.
      console.error('Production error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-flupp-neutral-50">
          <div className="max-w-md w-full mx-4">
            <div className="flupp-card p-8 text-center">
              <div className="text-6xl mb-4">🐾</div>
              <h1 className="text-2xl font-fredoka font-bold text-flupp-neutral-900 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-flupp-neutral-600 mb-6">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="flupp-button-primary w-full"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="flupp-button-outline w-full"
                >
                  Go Home
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-flupp-neutral-500 hover:text-flupp-neutral-700">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs bg-flupp-neutral-100 p-3 rounded text-red-600 overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized error boundaries for different sections

export function PaymentErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="flupp-card p-8 text-center">
            <div className="text-red-500 text-4xl mb-4">💳</div>
            <h2 className="text-xl font-fredoka font-bold text-flupp-neutral-900 mb-4">
              Payment Error
            </h2>
            <p className="text-flupp-neutral-600 mb-6">
              There was an error processing your payment. Please try again or contact support.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="flupp-button-primary w-full"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/book/new'}
                className="flupp-button-outline w-full"
              >
                Start New Booking
              </button>
            </div>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        // Special handling for payment errors
        console.error('Payment error:', { error, errorInfo });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function BookingErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="flupp-card p-8 text-center">
            <div className="text-flupp-sage text-4xl mb-4">📋</div>
            <h2 className="text-xl font-fredoka font-bold text-flupp-neutral-900 mb-4">
              Booking Error
            </h2>
            <p className="text-flupp-neutral-600 mb-6">
              There was an error with your booking form. Please refresh and try again.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="flupp-button-primary w-full"
              >
                Refresh Form
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flupp-button-outline w-full"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// Hook for programmatic error reporting
export function useErrorHandler() {
  const reportError = (error: Error, context?: string) => {
    console.error(`Error in ${context || 'Unknown context'}:`, error);
    
    if (process.env.NODE_ENV === 'production') {
      // Report to monitoring service
      console.error('Production error report:', {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    }
  };

  return { reportError };
}