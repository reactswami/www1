import { Component, type ReactNode } from 'react';

import { ErrorScreen } from './ErrorScreen';

export class ErrorBoundary extends Component<Props, State> {
   override state: State = {
      hasError: false,
   };

   static getDerivedStateFromError(): State {
      return { hasError: true };
   }

   override render() {
      if (this.state.hasError) {
         return <ErrorScreen message={this.props.errorMessage} />;
      }

      return this.props.children;
   }
}

interface Props {
   children: ReactNode;
   errorMessage: string;
}

interface State {
   hasError: boolean;
}
