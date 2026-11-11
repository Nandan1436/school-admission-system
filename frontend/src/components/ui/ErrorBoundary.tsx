import { Component, type ErrorInfo, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "./Button";
import { ErrorMessage } from "./Feedback";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex flex-col items-start gap-4 py-16">
        <ErrorMessage message="Something went wrong while showing this page. Reloading usually fixes it." />
        <Button variant="ghost" onClick={() => window.location.reload()}>
          <RotateCcw /> Reload page
        </Button>
      </div>
    );
  }
}
