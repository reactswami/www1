import { Flex } from '@chakra-ui/react';
import { memoTyped } from '@statseeker/utils/misc';
import { Outlet } from '@tanstack/react-router';
import { memo } from 'react';
import { AmlLeft } from './AmlLeft';
import { type AdminManageListPageProps } from './types';


/**
 * This component is a standard for all Admin Tool configuration management pages with a list of config items on the left of the page and a form on the right.
 *
 * It is typically the only direct child of a `AdminPage` component.
 */
export const AdminManageListPage = memoTyped(function AdminManageListPage<DatatableType>(props: AdminManageListPageProps<DatatableType>) {
   return (
      <>
         <AmlLeft<DatatableType>
            {...props}
         />
         <AmlSeparator/>
         <AmlRight/>
      </>
   );
});


const AmlSeparator = memo(function AmlSeparator() {
   return (
      <Flex
         borderRight={'2px solid'}
         borderColor={'gray.700'}
         flexGrow={0}
         margin={'md'}
      ></Flex>
   );
});


const AmlRight = memo(function AmlRight() {
   return (
      <Flex flexGrow={1}>
         <Outlet />
      </Flex>
   );
});
