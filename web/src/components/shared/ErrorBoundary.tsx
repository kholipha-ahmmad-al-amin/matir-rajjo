"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center bg-amber-50/30">
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-red-100 max-w-md">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              কিছু একটা সমস্যা হয়েছে
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন।
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="bg-amber-800 hover:bg-amber-900 text-white rounded-xl"
            >
              <RefreshCw size={18} className="mr-2" /> পৃষ্ঠা রিফ্রেশ করুন
            </Button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <pre className="mt-6 text-left text-xs text-red-600 bg-red-50 p-4 rounded-xl overflow-auto max-h-40 border border-red-100">
                {this.state.error.message}
                {this.state.error.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
