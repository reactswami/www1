import { Tag, Tooltip } from '@chakra-ui/react';

interface Props {
   name: string;
   enabledStatus: string;
}

export const PingTablePingTag = ({ name, enabledStatus }: Props) => {
   return (
      <Tag
         margin={0}
         size="sm"
         colorScheme={enabledStatus === 'exceeded' ? 'red' : undefined}
      >
         {enabledStatus !== 'exceeded' ? (
            <span>{name}</span>
         )
         : (
            <Tooltip
               placement="right"
               label="The ping polling for this device and Observability Appliance combination exceeds current license limits"
            >
               {name}
            </Tooltip>
         )}
      </Tag>
   );
};
