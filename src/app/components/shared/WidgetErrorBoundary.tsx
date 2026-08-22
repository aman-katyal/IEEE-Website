import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export interface WidgetErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  className?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WidgetErrorBoundary extends Component<WidgetErrorBoundaryProps, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('[WidgetErrorBoundary] Caught child rendering exception:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      const {
        fallbackTitle = 'Section temporarily unavailable',
        fallbackDescription = 'An unexpected error occurred while displaying this content.',
        className = '',
      } = this.props;

      return (
        <div
          role="alert"
          data-testid="widget-error-fallback"
          className={`flex flex-col items-center justify-center p-6 rounded-xl border border-red-500/20 bg-red-950/10 text-center text-slate-300 ${className}`}
        >
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-3">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-slate-100 mb-1">{fallbackTitle}</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">{fallbackDescription}</p>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-cyber-gold/10 text-cyber-gold hover:bg-cyber-gold/20 border border-cyber-gold/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyber-gold"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Retry loading
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
