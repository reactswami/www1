import {
   Accordion as ChakraAccordion,
   AccordionItem as ChakraAccordionItem,
   AccordionButton as ChakraAccordionButton,
   AccordionPanel as ChakraAccordionPanel,
   AccordionIcon as ChakraAccordionIcon,
   type AccordionProps,
   type AccordionItemProps,
   type AccordionButtonProps,
   type AccordionPanelProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>((props, ref) => {
   return <ChakraAccordion {...props} ref={ref} />;
});

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>((props, ref) => {
   return <ChakraAccordionItem {...props} ref={ref} />;
});

export const AccordionButton = forwardRef<HTMLButtonElement, AccordionButtonProps>((props, ref) => {
   return <ChakraAccordionButton {...props} ref={ref} />;
});

export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>((props, ref) => {
   return <ChakraAccordionPanel {...props} ref={ref} />;
});

export { ChakraAccordionIcon as AccordionIcon };
