import { Accordion, Flex, type FlexProps } from '@chakra-ui/react';
import { useState, type ReactNode } from 'react';
import DiscoveryPanelFooter from './DiscoveryPanelFooter';
import { InfoCard } from '~/components';
import { useSearch } from '@tanstack/react-router';

export type DiscoveryPanelContainerProps = {
   /**
    * @description React node/s that can be passed to the Panel component
    */
   children: ReactNode;
   /**
    * @description This prop allows you to set which accordion panels should be expanded by default
    */
   defaultExpandedPanels?: number[];
   /**
    * @description Panels passed in with this prop allows you to hide and show options with the advanced options toggle
    */
   advancedOptions?: ReactNode;
   /**
    * @description A function that will fire when the start now is clicked
    */
   onStartClick: () => void;
   /**
    * @description Whether of not the show advanced options button should be shown
    */
   showAdvancedOptionsButton?: boolean;
   /**
    * the info card text shown above the accordion container
    */
   infoCardText?: string;
   /**
    * True/False is the discovery running?
    */
   isRunning?: boolean;
   /**
    * @description Button text for the start button
    */
   startButtonText?: string;
   /**
    * @description openSchedule,
    * Handler to open the schedule form
    *
    */
   openSchedule?: () => void;
   /**
    * @description A function that will save the discovery config
    */
   onSaveConfig: () => void;
   /**
    * @description A function that will run ping discover
    */
   runPingDiscover?: () => void;
};

export function DiscoveryPanelContainer({
   children,
   defaultExpandedPanels = [0],
   advancedOptions,
   onStartClick,
   showAdvancedOptionsButton = true,
   infoCardText,
   isRunning = false,
   startButtonText = 'Run Now',
   props,
   openSchedule,
   onSaveConfig,
   runPingDiscover
}: DiscoveryPanelContainerProps & { props?: FlexProps }) {
   const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
   const search = useSearch({ strict: false });

   const isCustomize = search?.from !== undefined;
   const footerProps = {
      onStartClick, showAdvancedOptionsButton, isRunning, startButtonText, openSchedule,
      setShowAdvancedOptions, showAdvancedOptions, onSaveConfig, runPingDiscover: isCustomize ? undefined : runPingDiscover
   };

   return (
      <Flex gap={4} flexDir={'column'} {...props}>
         {infoCardText ? <InfoCard text={infoCardText} /> : null}
         <Accordion
            defaultIndex={defaultExpandedPanels}
            allowMultiple
            display={'flex'}
            gap={4}
            flexDir={'column'}
         >
            {children}
            {isCustomize ? advancedOptions : showAdvancedOptions ? advancedOptions : null}
         </Accordion>
         <Flex justifyContent={'end'} gap={2}>
            <DiscoveryPanelFooter {...footerProps} />
         </Flex>
      </Flex>
   );
}

