import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/react';

/** This will be the alert used on each of the discovery pages giving a brief explanation of each discovery mode */
export function InfoCard({ text }: { text: string }) {
   return (
      <Alert
         alignItems={'start'}
         border={'1px solid'}
         borderColor={'gray.200'}
         borderRadius={'sm'}
         flexShrink={0}
      >
         <AlertIcon />
         <AlertDescription>{text}</AlertDescription>
      </Alert>
   );
}
