import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[React Error Boundary Caught]:', error, errorInfo);
    
    // Auto-heal dynamic import chunk loading errors caused by fresh Vercel deployments
    const isChunkError =
      error.name === 'ChunkLoadError' ||
      error.message?.includes('Failed to fetch dynamically imported module') ||
      error.message?.includes('Importing a module script failed');

    if (isChunkError) {
      console.warn('[Vite Dynamic Chunk Stale] Auto-reloading page to fetch latest deployed bundle...');
      window.location.reload();
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center justify-center p-6 text-center select-none font-['Public_Sans']">
          <div className="bg-white border border-[#3A3A38]/20 rounded-[16px] p-8 max-w-md w-full space-y-4 shadow-sm">
            <div className="h-12 w-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">
              Temporary Display Error
            </h2>
            <p className="text-xs text-[#3A3A38] leading-relaxed">
              {this.state.error?.message || 'An unexpected rendering error occurred. Please click below to reload.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-2.5 bg-[#1A3C2B] text-white font-semibold text-xs rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
