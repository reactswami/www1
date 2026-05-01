import { Flex } from '@chakra-ui/react';
import { StepIndicator } from '../StepIndicator';
import { Loader } from '~/components/Loader';
import { useSteps } from '~/features/initialWizard/hooks/useSteps';

export const Stepper = () => {
   const { steps, currentStep } = useSteps();

   if (currentStep === 4) {
     return <Loader message={'Initiliazing the Meraki monitoring system.'} />;
   }

   return (
      <Flex direction="column" gap="sm">
         <Flex justifyContent={'space-between'}>
            {steps.map(({ title, index: stepIndex }, index) => (
               <StepIndicator
                  title={title}
                  isCurrent={stepIndex === currentStep}
                  isCompleted={stepIndex < currentStep}
                  stepIndex={stepIndex + 1}
                  key={index}
               />
            ))}
         </Flex>
         <Flex
            background={'white'}
            direction="column"
            padding={8}
            shadow="sm"
            borderRadius={'base'}
            minWidth={128}
            gap="sm"
            border="1px"
            borderColor="gray.500"
         >
            {steps.find(({ index }) => index === currentStep)?.component}
         </Flex>
      </Flex>
   );
};
