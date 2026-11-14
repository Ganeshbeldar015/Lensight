import React, { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled runtime error in UI component:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#fdf0f0] border border-[#d95757]/30 flex items-center justify-center text-[#d95757] mb-4 shadow-sm">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-[#263b40] mb-1">
            Application View Error
          </h2>
          <p className="text-xs sm:text-sm text-[#61777c] max-w-md mb-5 leading-relaxed">
            {this.state.error?.message || 'An unexpected rendering error occurred. The system has safely captured the event.'}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={this.handleReset}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Reload Dashboard
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
