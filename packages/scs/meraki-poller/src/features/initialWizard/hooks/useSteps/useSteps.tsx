import { type ReactNode, useState } from 'react';
import {
   ConnectionForm,
   RateLimitSetter,
   SuccessSummary,
} from '~/features/initialWizard/components';
import { useInitialSetup } from '~/hooks';


interface Props {
   handlePrevious: () => void;
   handleNext: () => void;
   steps: Step[];
   currentStep: number;
}

type Step = { title: string; component: ReactNode; index: number };

export const useSteps = (): Props => {
   const [step, setStep] = useState(0);
   const [organizationsFound, setOrganizationsFound] = useState(0);
   const { setIsFirstVisit, refetch } = useInitialSetup();

   const handleNext = async ({
      organizationsFound,
   }: { organizationsFound?: number } = {}) => {
      if (organizationsFound) {
         setOrganizationsFound(organizationsFound);
      }
      if (step === LAST_STEP) {
         setIsFirstVisit(false);
         refetch();
         return;
      }

      setStep(step + 1);
   };

   const handlePrevious = () => setStep(Math.max(step - 1, 0));

   const steps = [
      {
         title: 'Setup connection',
         component: <ConnectionForm nextStep={handleNext} />,
         index: 0,
      },
      {
         title: 'Set the rate limit',
         component: (
            <RateLimitSetter onNext={handleNext} onPrevious={handlePrevious} />
         ),
         index: 1,
      },
      {
         title: 'Finish',
         component: (
            <SuccessSummary
               organizationsFound={organizationsFound}
               onContinue={handleNext}
            />
         ),
         index: 2,
      },
   ];
   const LAST_STEP = steps.length - 1;

   return { handleNext, handlePrevious, steps, currentStep: step };
};
