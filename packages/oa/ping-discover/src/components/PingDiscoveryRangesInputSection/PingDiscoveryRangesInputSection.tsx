import {
   Alert,
   AlertDescription,
   AlertIcon,
   Box,
   Button,
   Flex,
   Textarea,
} from '@chakra-ui/react';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { type ForwardedRef, forwardRef } from 'react';

interface Props {
   isDisabled: boolean;
   isInvalid: boolean;
   reset: () => void;
   onOpen: () => void;
   defaultRanges?: string[];
}

export const PingDiscoveryRangesInputSection = forwardRef(
   (
      { isInvalid, isDisabled, reset, onOpen, defaultRanges }: Props,
      ref: ForwardedRef<HTMLTextAreaElement>
   ) => {
      return (
         <Flex direction="column" flexGrow={1} flexShrink={0} flexBasis={'50%'} gap="sm" position="relative">
            <Textarea
               data-testid="oa-ping-discovery-ip-scan-range-input"
               placeholder={
                  'Example IP scan ranges:\ninclude 10.2.*.*\nexclude 10.2.4.[0-255]\ninclude 10.13.0.0/16\ninclude 10.80.0.0/255.255.255.0\n'
               }
               defaultValue={defaultRanges?.join('\n')}
               ref={ref}
               flexGrow={1}
               isDisabled={isDisabled}
               isInvalid={isInvalid}
               onChange={reset}
               borderRadius="sm"
            />
            {isInvalid && (
               <Box
                  padding={2}
                  position={'absolute'}
                  bottom={3}
                  left={3}
                  right={3}
               >
                  <Alert status="error">
                     <AlertIcon />
                     <AlertDescription>
                        Please provide at least one IP range
                     </AlertDescription>
                  </Alert>
               </Box>
            )}

            <Button
               position="absolute"
               top={-9}
               right={0}
               borderRadius="md"
               variant="ghost"
               onClick={onOpen}
               leftIcon={<QuestionMarkCircledIcon />}
            >
               Help
            </Button>
         </Flex>
      );
   }
);
