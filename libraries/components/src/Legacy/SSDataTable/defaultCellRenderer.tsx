import { Button, Flex } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { type ReactElement } from 'react';
import { type DefaultCellRendererProps } from './types';

export default (cellRenderProps: DefaultCellRendererProps[], id: string): ReactElement => {
   const buttons = cellRenderProps.map((buttonDef, index) => (
      <Link {...buttonDef?.linkProps} key={`k${index}`} params={{ id }}>
         <Button className={buttonDef.text.replace(' ', '')} {...buttonDef?.buttonProps}>
            {buttonDef.text}
         </Button>
      </Link>
   ));

   return (
      <Flex justifyContent={'flex-start'} gap="2">
         {buttons}
      </Flex>
   );
};
