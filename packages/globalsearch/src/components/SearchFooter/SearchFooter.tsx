import { Box, Flex, Kbd, Text, useBreakpointValue } from '@chakra-ui/react';
import { memo } from 'react';

const KeyNavHelp = ({ keyText, help }: { help: string; keyText: string }) => {
   return (
      <Flex gap="1">
         <Kbd size="smaller" color="gray.800">
            {keyText}
         </Kbd>
         <Text fontSize="smaller" color="gray.500">
            {help}
         </Text>
      </Flex>
   );
};
function SearchFooter({ count }: { count: number | undefined }) {
   const screenType = useBreakpointValue({
      base: 'mobile',
      md: 'tablet',
      lg: 'desktop',
   });
   return (
      <Box
         p={3}
         borderTop="1px solid"
         borderColor="gray.100"
         bg="var(--chakra-colors-background-500)"
         w="100%"
         borderBottomRadius={'md'}
      >
         <Flex
            direction={{ base: 'column', md: 'row' }}
            justifyContent={count !== undefined ? 'space-between' : 'flex-end'}
            gap={1}
         >
            {count !== undefined && (
               <Text fontSize="xs" color="gray.500">
                  {count} result(s) found
               </Text>
            )}
            {screenType === 'desktop' && (
               <Flex direction={{ base: 'column', md: 'row' }} gap={2}>
                  <KeyNavHelp help={'to filter'} keyText="Alt" />
                  <KeyNavHelp help={'to navigate'} keyText="↑↓" />
                  <KeyNavHelp help={'to select'} keyText="↵" />
                  <KeyNavHelp help={'to open'} keyText="⌘K" />
               </Flex>
            )}
         </Flex>
      </Box>
   );
}

export default memo(SearchFooter);
