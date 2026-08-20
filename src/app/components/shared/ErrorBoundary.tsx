import { Component, ErrorInfo, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundaryClass extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-4">
          <div className="mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-500"
              aria-hidden="true"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Something went wrong.</h1>
          <p className="text-neutral-400 mb-8 max-w-md text-center">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorBoundary({ children }: Props) {
  return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>;
}
