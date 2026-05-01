import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, Container } from '@chakra-ui/react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Component, type ReactNode } from 'react';

interface Props {
   children: ReactNode;
}

interface State {
   hasError: boolean;
   error: null | Error;
}

export class ErrorBoundary extends Component<Props, State> {
   override state: State = {
      hasError: false,
      error: null
   };

   static getDerivedStateFromError(error: Error): State {
      return { hasError: true, error };
   }

   override render() {
      if (this.state.hasError) {
         return <ErrorScreen message={this.state.error?.message} />;
      }

      return this.props.children;
   }
}

const ErrorScreen = ({ message }: { message?: string }) => (
   <Container paddingY={8}>
      <Alert
         borderRadius="md"
         status="error"
         flexDirection="column"
         alignItems="center"
         justifyContent="center"
         textAlign="center"
         gap="sm"
         padding={8}
      >
         <AlertIcon boxSize="40px" mr={0} />
         <AlertTitle mt={4} mb={1} fontSize="lg">
            Something went wrong
         </AlertTitle>
         <AlertDescription maxWidth={'lg'}>{message}</AlertDescription>
         <Button
            colorScheme={'red'}
            onClick={() => window.location.assign(window.location.href)}
            variant={'ghost'}
            leftIcon={<ReloadIcon />}
         >
            Refresh
         </Button>
      </Alert>
   </Container>
);

export default ErrorScreen;
