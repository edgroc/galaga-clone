import React from 'react';

/**
 * Error boundary component to catch and handle game errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error information
    console.error('Game error:', error, errorInfo);
    this.setState({
      errorInfo
    });
    
    // Here you could also send error reports to a monitoring service
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="error-screen">
          <h1>Something went wrong</h1>
          <p>An unexpected error occurred in the game.</p>
          
          {this.state.error && (
            <div className="error-details">
              <p>{this.state.error.toString()}</p>
            </div>
          )}
          
          <button 
            className="reset-button"
            onClick={this.handleReset}
          >
            Reset Game
          </button>
          
          {/* Debug info in development mode */}
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="error-stack">
              <summary>Error Stack</summary>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    // If no error occurred, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
