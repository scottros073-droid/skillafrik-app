import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
          <div className="max-w-lg text-center bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-xl p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">Something went wrong</h1>
            <p className="text-gray-700 dark:text-gray-200 mb-6">
              Please refresh the page or try again later. If the issue persists, contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
