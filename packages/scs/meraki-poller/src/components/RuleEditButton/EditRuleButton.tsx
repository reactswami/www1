import { IconButton, Tooltip } from '@chakra-ui/react';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { type MouseEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import { DynamicRoutes } from '~/types/routes';

interface Props {
   type: 'organizations' | 'networks';
   ruleId: string;
}

export const EditRuleButton = ({ type, ruleId }: Props) => {
   const navigate = useNavigate();
   const route =
      type === 'networks'
         ? `/${DynamicRoutes.networkCustomRule(ruleId)}`
         : `/${DynamicRoutes.organizationCustomRule(ruleId)}`;
   const handleClick: MouseEventHandler = (e) => {
      e.stopPropagation();
      navigate(route);
   };
   return (
      <Tooltip label="Edit rule">
         <IconButton
            size="xs"
            variant="ghost"
            onClick={handleClick}
            aria-label="edit rule"
            icon={<Pencil1Icon />}
         />
      </Tooltip>
   );
};
