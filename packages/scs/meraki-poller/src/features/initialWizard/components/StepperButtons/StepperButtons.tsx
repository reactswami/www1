import { Button, Flex, Spacer } from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';

import { type ReactElement } from 'react';

interface Props {
   onNext: () => void;
   onPrevious?: () => void;
   canPrevious: boolean;
   isLoading?: boolean;
   buttonLabel?: string;
   buttonIcon?: ReactElement;
}
export const StepperButtons = ({
   onNext,
   onPrevious,
   canPrevious,
   isLoading,
   buttonLabel,
   buttonIcon,
}: Props) => {
   return (
      <Flex justifyContent={'space-between'} gap={3} paddingTop={3}>
         {canPrevious ? (
            <Button
               onClick={onPrevious}
               leftIcon={<ArrowLeftIcon />}
               variant={'outline'}
               isDisabled={isLoading}
            >
               Go Back
            </Button>
         ) : (
            <Spacer />
         )}
         <Button
            onClick={onNext}
            isLoading={isLoading}
            rightIcon={buttonIcon ?? <ArrowRightIcon />}
         >
            {buttonLabel ?? 'Continue'}
         </Button>
      </Flex>
   );
};
