import { Box, Flex } from '@chakra-ui/react';
import { CheckIcon } from '@radix-ui/react-icons';
import { theme } from '@statseeker/ui/theme';

interface Props {
   title: string;
   isCurrent: boolean;
   isCompleted: boolean;
   stepIndex: number;
}

export const StepIndicator = ({
   isCurrent,
   isCompleted,
   title,
   stepIndex,
}: Props) => {
   return (
      <Flex
         paddingY={0}
         paddingX={4}
         alignItems={'enter'}
         justifyContent={'center'}
         gap={1}
         flexWrap={'nowrap'}
         position="relative"
         color={isCurrent ? undefined : 'gray.500'}
         flexGrow={0}
         flexShrink={0}
         flexBasis="auto"
      >
         <Box
            border={'1px'}
            borderColor={isCurrent ? theme.colors.primary[500] : 'gray.500'}
            marginRight={' 0.25rem'}
            borderRadius={' 0.125rem'}
            display={' flex'}
            justifyContent={' center'}
            alignItems={' center'}
            height={6}
            width={6}
            flex-grow={0}
            backgroundColor={isCurrent ? theme.colors.primary[500] : undefined}
            color={isCurrent ? theme.colors.white[500] : undefined}
         >
            {isCompleted ? (
               <CheckIcon color={theme.colors.green[500]} />
            ) : (
               stepIndex
            )}
         </Box>
         {title}
      </Flex>
   );
};
