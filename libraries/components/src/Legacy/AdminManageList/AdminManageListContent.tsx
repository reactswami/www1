import { Flex, Heading } from '@chakra-ui/react';
import { type ReactNode } from 'react';

export function AdminManageListContent({ children, title }: { children: ReactNode; title: string }) {
   return (
      <Flex flexGrow={1} flexDirection={'column'} padding={'md'} gap={4}>
         <Heading size="lg" flexShrink={0} flexGrow={0}>
            {title}
         </Heading>
         { children }
      </Flex>
   );
}
