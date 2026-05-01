import { Flex } from '@chakra-ui/react';
import { type ReactNode } from 'react';

interface SectionProps {
   children: ReactNode;
}

export const Section = ({ children }: SectionProps) => (
   <Flex
      direction="column"
      background="white"
      shadow="sm"
      minWidth={8}
      padding={2}
      borderRadius="sm"
      gap="md"
      border="1px"
      borderColor={'gray.100'}
   >
      {children}
   </Flex>
);
