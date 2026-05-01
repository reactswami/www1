import {
   AccordionButton,
   AccordionIcon,
   AccordionItem,
   AccordionPanel,
   Flex,
   Heading,
   Text,
} from '@chakra-ui/react';
import { type ReactNode } from 'react';

/**
 * @title AccordionProps
 * @description The props for the accordion component
 */

type AccordionProps = {
   /**
    * @description The title the appears in the accordion button
    */
   title: string;
   /**
    * @description Any elements you want displayed when the accordion is expanded
    */
   children?: ReactNode;
   /**
    * @description Class names passed to the accordion item component
    */
   className?: string;
   /**
    * @description The subtitle the appears in the accordion button
    */
   subTitle?: string;
};

export function Panel({
   title,
   children,
   className,
   subTitle
}: AccordionProps) {
   return (
      <AccordionItem
         border="1px solid"
         borderColor={'gray.100'}
         borderRadius={'sm'}
         className={className}
         zIndex={100}
         background={'page.500'}
         shadow="sm"
         padding={2}
         minWidth={'600px'}
      >
         <AccordionButton
            margin={0}
            paddingX={2}
            paddingY={1}
            gap={2}
            justifyContent={'space-between'}
            alignContent={'center'}
            _hover={{
               background: 'gray.50',
            }}
         >
            <Flex gap={2} alignItems={'center'}>
               <Heading size="md" margin={0}>
                  {title}
               </Heading>
               <Text>
                  {subTitle}
               </Text>
            </Flex>
            <AccordionIcon width={'16px'} height={'16px'} />
         </AccordionButton>
         <AccordionPanel paddingTop={0} paddingBottom={2} paddingX={3} marginTop="md">
            {children}
         </AccordionPanel>
      </AccordionItem>
   );
}
