import {
   Button,
   ButtonGroup,
   Menu,
   MenuButton,
   MenuList,
   MenuItem,
   IconButton,
   Center,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { type LinkProps, Link } from '@tanstack/react-router';
import React, { useRef, type ReactNode } from 'react';

/**
 * The standard Statseeker dropdown button component.
 * The component displays a main button and dropdown of buttons
 * including the main button. The design is inspired from the
 * microsoft send button from the outlook.
 *
 *
 *
 *
 * Key props include:
 * - `buttonTypes` - An array of button type to be displayed, primary button being the first in the array.
 * - `rowSelectMode` - Enables single or multi selection of the table rows
 * - `onAction` - Event listener for all table actions
 * - `buttonTypes`
 *        - `buttonText` - The text of the button to be displayed
 *        - `disabled`   - Boolean true to disable, default is enabled.
 *        - `link`       - A function or a router variable
 *        - `icon`       - Icon for the button, not implemented.
 *        - `colorScheme`- Color scheme of the button
 */
export type DropDownType = {
   buttonText: string;
   disabled: boolean;
   link: LinkProps['to'] | (() => void);
   icon?: React.ReactElement;
   colorScheme?: string;
};

export type DropdownButtonType = {
   buttonTypes: DropDownType[];
};

function DropdownButton({ buttonTypes }: DropdownButtonType) {
   const [firstButton, ...otherButtons] = buttonTypes;
   const buttonRef = useRef<HTMLDivElement>(null);

   return (
      <ButtonGroup size="sm" isAttached gap={'1px'} ref={buttonRef}>
         {typeof firstButton.link === 'function' ? (
            <Button
               className={firstButton.buttonText.toLowerCase().split(' ')[0]}
               isDisabled={firstButton.disabled}
               onClick={firstButton.link}
               colorScheme={firstButton?.colorScheme}
            >
               {firstButton.buttonText}
            </Button>
         ) : (
            <Link to={firstButton.link} disabled={firstButton.disabled} search={true}>
               <Button
                  className={firstButton.buttonText.toLowerCase().split(' ')[0]}
                  isDisabled={firstButton.disabled}
               >
                  {firstButton.buttonText}
               </Button>
            </Link>
         )}

         {buttonTypes.length > 1 && (
            <Menu isLazy={true} placement="bottom-end" preventOverflow={true} gutter={4}>
               {({ isOpen }) => (
                  <>
                     <MenuButton
                        as={IconButton}
                        minWidth={'25px'}
                        isDisabled={buttonTypes.every(btn => btn.disabled)}
                     >
                        <Center>
                           <ChevronDownIcon />
                        </Center>
                     </MenuButton>
                     {isOpen && (
                        <MenuList
                           minWidth={buttonRef.current?.offsetWidth + 'px'}
                           borderRadius={'md'}
                           paddingY={'xs'}
                           fontSize={'sm'}
                           zIndex={100}
                        >
                           {buttonTypes.map(({ buttonText, disabled, link }) =>
                              typeof link === 'function' ? (
                                 <MenuItem
                                    isDisabled={disabled}
                                    onClick={disabled ? () => ({}) : link}
                                 >
                                    {buttonText}
                                 </MenuItem>
                              ) : (
                                 <Link to={link} disabled={disabled}>
                                    <MenuItem isDisabled={disabled}>{buttonText}</MenuItem>
                                 </Link>
                              )
                           )}
                        </MenuList>
                     )}
                  </>
               )}
            </Menu>
         )}
      </ButtonGroup>
   );
}

export default DropdownButton;
