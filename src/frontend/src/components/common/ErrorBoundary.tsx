/*eslint-disable */
import React, { Component } from "react";

// From - https://www.developerway.com/posts/how-to-handle-errors-in-react
// eslint-disable-next-line
export class ErrorBoundary extends Component<any, any> {
  // eslint-disable-next-line
  constructor(props: unknown) {
    super(props);
    // initialize the error state
    // eslint-disable-next-line
    this.state = { hasError: false, error: Error };
  }

  // if an error happened, set the state to true
  static getDerivedStateFromError(error: Error) {
    console.error(error);
    return { hasError: true, error };
  }

  // eslint-disable-next-line
  componentDidCatch(error: Error, errorInfo: unknown) {
    // send error to somewhere here
    console.error(error);
    console.log(errorInfo);
  }

  render() {
    // todo make a good error component
    // if error happened, return a fallback component
    if (this.state.hasError) {
      return <div>Error!!</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
