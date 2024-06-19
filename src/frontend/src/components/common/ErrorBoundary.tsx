import { Component } from 'react';

// From - https://www.developerway.com/posts/how-to-handle-errors-in-react
export class ErrorBoundary extends Component<any, any> {
  constructor(props) {
    super(props);
    // initialize the error state
    this.state = { hasError: false, error: Error };
  }

  // if an error happened, set the state to true
  static getDerivedStateFromError(error: Error) {
    console.error(error);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
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
