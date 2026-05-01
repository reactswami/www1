import { Flex, type FlexProps } from '@chakra-ui/react';
import { type ReactNode } from 'react';

export interface AdminPageProps {
   /** The react component to render inside the page body. */
   children: ReactNode;
   /**
    * Class to give the page, useful as a page identity for automated testing.
    */
   className: string;
}

/**
 * This component is the standard top-level page for all Admin Tool configuration-style pages.
 *
 * It is typically the only direct child of a `AdminLayout` component.
 *
 * It overflows automatically in both directions if its content is bigger than its size.
 */
export const AdminPage = ({ children, className = 'page', ...flexProps }: AdminPageProps & FlexProps) => {
   if (typeof className == 'string' && className != 'page') {
      className = `page ${className}`;
   }
   return (
      <Flex
         as="main"
         backgroundColor={'page.500'}
         border="1px"
         borderColor={'gray.100'}
         borderRadius="sm"
         className={className}
         flex="0px"
         flexDirection="column"
         flexGrow={1}
         overflow="auto"
         padding={4}
         position="relative"
         shadow="md"
         {...flexProps}
      >
         {children}
      </Flex>
   );
};
