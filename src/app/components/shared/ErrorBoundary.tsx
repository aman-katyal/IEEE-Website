import { Component, ErrorInfo, type ReactNode, useState } from "react";
import { useRouteError, isRouteErrorResponse } from "react-router";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp, Terminal, ShieldAlert } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundaryClass extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    const msg = error?.message || "";
    const isDynamicImportError =
      msg.includes("Failed to fetch dynamically imported module") ||
      msg.includes("error loading dynamically imported module") ||
      msg.includes("Importing a module script failed");

    if (isDynamicImportError && typeof window !== "undefined") {
      const hasReloaded = window.sessionStorage.getItem("chunk_reload");
      if (!hasReloaded) {
        window.sessionStorage.setItem("chunk_reload", "true");
        window.location.reload();
      }
    }

    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <ErrorFallbackView
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

export function ErrorBoundary({ children, fallback }: Props) {
  return <ErrorBoundaryClass fallback={fallback}>{children}</ErrorBoundaryClass>;
}

interface ErrorFallbackViewProps {
  error?: Error | unknown;
  statusText?: string;
  statusCode?: number | string;
  onReset?: () => void;
}

export function ErrorFallbackView({
  error,
  statusText,
  statusCode,
  onReset,
}: ErrorFallbackViewProps) {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "An unexpected client-side error occurred during application rendering.";

  const stackTrace = error instanceof Error ? error.stack : null;

  const handleReload = () => {
    if (onReset) {
      onReset();
    }
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 ieee-grid-bg flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-xl w-full bg-[#121214] border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-50 duration-300">
        {/* Header Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-sky-500 to-[#EBD3A9]" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Top Status & Icon */}
          <div className="flex items-start justify-between gap-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="flex flex-col items-end">
              <Badge className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono">
                {statusCode ? `HTTP ${statusCode}` : "APPLICATION STATE FAULT"}
              </Badge>
              {statusText && (
                <span className="text-[11px] text-slate-500 mt-1 font-mono">{statusText}</span>
              )}
            </div>
          </div>

          {/* Heading and Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-['Space_Grotesk']">
              Unexpected Application Error
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              We encountered an unhandled issue while rendering this view. Our client state has safely halted execution to prevent corrupted operations.
            </p>
          </div>

          {/* Error Message Callout */}
          <div className="p-3.5 bg-red-950/20 border border-red-500/30 rounded-xl text-xs font-mono text-red-300 flex items-start gap-2.5 break-all">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              type="button"
              onClick={handleReload}
              className="bg-sky-600 hover:bg-sky-500 text-white font-medium shadow-md flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Page</span>
            </Button>

            <Button
              asChild
              variant="outline"
              className="bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
            >
              <a href="/">
                <Home className="w-4 h-4 text-slate-400" />
                <span>Return to Home</span>
              </a>
            </Button>

            {stackTrace && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails((prev) => !prev)}
                className="text-xs text-slate-400 hover:text-slate-200 ml-auto flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{showDetails ? "Hide Diagnostics" : "View Diagnostics"}</span>
                {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
            )}
          </div>

          {/* Collapsible Diagnostics Accordion */}
          {showDetails && stackTrace && (
            <div className="mt-4 p-3.5 bg-black/70 border border-slate-800 rounded-xl space-y-2 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-1.5">
                <span>Stack Trace Traceback</span>
                <span className="text-slate-600">Client Runtime</span>
              </div>
              <pre className="text-[11px] font-mono text-slate-400 overflow-x-auto whitespace-pre-wrap max-h-48 leading-relaxed selection:bg-sky-900">
                {stackTrace}
              </pre>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-900/60 border-t border-slate-800/80 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Purdue IEEE Student Branch</span>
          <span>West Lafayette, IN</span>
        </div>
      </div>
    </div>
  );
}

/**
 * RouteErrorBoundary: Top-level error boundary used as errorElement in React Router 7.
 */
export function RouteErrorBoundary() {
  const error = useRouteError();

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "";

  const isDynamicImportError =
    errorMessage.includes("Failed to fetch dynamically imported module") ||
    errorMessage.includes("error loading dynamically imported module") ||
    errorMessage.includes("Importing a module script failed");

  if (isDynamicImportError && typeof window !== "undefined") {
    const hasReloaded = window.sessionStorage.getItem("chunk_reload");
    if (!hasReloaded) {
      window.sessionStorage.setItem("chunk_reload", "true");
      window.location.reload();
    }
  }

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorFallbackView
        error={error.data || error.statusText}
        statusCode={error.status}
        statusText={error.statusText}
      />
    );
  }

  return <ErrorFallbackView error={error} />;
}
