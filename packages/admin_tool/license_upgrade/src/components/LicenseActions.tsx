import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form/Button';
import { ChevronDownIcon } from '@statseeker/components/Media/Icon/ChevronDownIcon';

interface LicenseActionsProps {
   onDownload: () => void;
   onUpload: () => void;
   onCancel: () => void;
   isLoading?: boolean;
}

export const LicenseActions = (props: LicenseActionsProps) => {

   return (
      <Menu>
         <MenuButton as={Button} rightIcon={<ChevronDownIcon size="sm" />} isLoading={props.isLoading}>
            Actions
         </MenuButton>
         <MenuList>
            <MenuItem onClick={props.onDownload}>Download a new License</MenuItem>
            <MenuItem onClick={props.onUpload}>Upload existing License</MenuItem>
            <MenuItem onClick={props.onCancel}>Cancel Upgrade</MenuItem>
         </MenuList>
      </Menu>
   );
};
