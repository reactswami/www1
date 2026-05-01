import { Box, Flex, Portal, useDisclosure, useMediaQuery } from '@chakra-ui/react';
import { SearchIcon } from '@statseeker/components/Media/Icon/SearchIcon';
import React, { memo, useCallback, useEffect, useRef, useMemo, forwardRef } from 'react';
import { useSearchContext } from '../components/SearchContext/SearchContext';
import SearchInputPanel from '../components/SearchInputPanel/SearchInputPanel';
import SearchPortalContent from '../components/SearchPortalContent/SearchPortalContent';
import useDropdownPositioning from '../hooks/useDropdownPositioning';
import useOutsideClick from '../hooks/useOutsideClick';
import useSearchActions from '../hooks/useSearchActions';
import useSearchKeys from '../hooks/useSearchKeys';
import useTrackDelay, { TRACK_DELAY_STATUS } from '../hooks/useTrackDelay';
import { BREAKPOINTS, CONTAINER_WIDTHS, GLOBAL_SEARCH_INPUT_ID } from '../utils';

const MobileSearchButton = memo(forwardRef(({ onClose, onOpen, resetSearch, isOpen }: { isOpen: boolean; onOpen: () => void; onClose: () => void; resetSearch: () => void }, ref: React.LegacyRef<HTMLDivElement>) => (
   <Box
      ref={ref}
      color="white"
      onClick={() => {
         if (!isOpen) {
            onOpen();
            resetSearch();
         } else {
            onClose();
         }
      }}
      cursor="pointer"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="md"
      _hover={{ bg: 'whiteAlpha.200' }}
      _active={{ bg: 'whiteAlpha.300' }}
      transition="background-color 0.2s"
      aria-label="Open search"
      role="button"
      tabIndex={0}
   >
      <SearchIcon size="md" />
   </Box>
)));

MobileSearchButton.displayName = 'MobileSearchButton';

const App = memo(() => {
   // Refs
   const dropdownRef = useRef<HTMLDivElement>(null);
   const targetRef = useRef<HTMLDivElement>(null);
   const hasDisplayedRef = useRef<boolean>(false);
   const searchContentRef = useRef<HTMLDivElement>(null);
   const closeButtonRef = useRef<HTMLDivElement>(null);

   // Hooks
   const { isOpen, onOpen, onClose } = useDisclosure();
   const {
      dispatch,
      state: {
         hoverFilterIndex,
         hoverActionIndex,
         triggerCloseAction,
         searchTerm,
         trackDelay,
         trackedItem,
         selectedResultIndex,
      },
   } = useSearchContext();
   const { resetSearch } = useSearchActions();

   const trackSearchCallback = useCallback(
      (tracker: string, delay: number, status: TRACK_DELAY_STATUS) => {
         if (status === TRACK_DELAY_STATUS.PAUSE || status === TRACK_DELAY_STATUS.END) {
            console.info(
               '***search delay for BACKEND search',
               tracker,
               ' is ',
               delay,
               'ms, ',
               'track status',
               status,
               '  tracked item: ',
               trackedItem,
               ', found at index: ',
               selectedResultIndex
            );
         }
      },
      [trackedItem, selectedResultIndex]
   );

   useTrackDelay<string>({
      tracker: searchTerm || '',
      status: trackDelay,
      callback: trackSearchCallback,
   });

   useEffect(() => {
      if (trackDelay === TRACK_DELAY_STATUS.PAUSE) {
         dispatch({ type: 'TRIGGER_DELAY', payload: { status: TRACK_DELAY_STATUS.START } });
      }

      if (trackDelay === TRACK_DELAY_STATUS.END) {
         dispatch({ type: 'TRIGGER_DELAY', payload: { status: TRACK_DELAY_STATUS.IDLE } });
      }
   }, [trackDelay, dispatch]);

   // Media queries
   const [isLessThan765] = useMediaQuery(BREAKPOINTS.MOBILE);
   const [isLessThan1600] = useMediaQuery(BREAKPOINTS.ICONS);

   const position = useDropdownPositioning(
      dropdownRef,
      isOpen,
      isLessThan765 ? 60 : 17,
      isLessThan765
         ? 0
         : dropdownRef?.current
            ? dropdownRef?.current?.getBoundingClientRect().left
            : 0
   );
   useSearchKeys({ onOpen, onClose, isOpen });

   // Event handlers
   const handleMouseMove = useCallback(() => {
      if (hoverFilterIndex > -1 || hoverActionIndex > -1) {
         dispatch({
            type: 'RESET_FILTER_HOVER',
         });
      }
   }, [dispatch, hoverFilterIndex, hoverActionIndex]);

   const handleResize = useCallback(() => {
      onClose();
   }, [onClose]);
   // Effects
   useEffect(() => {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, [handleResize]);

   useEffect(() => {
      if (triggerCloseAction) {
         onClose();
      }
   }, [triggerCloseAction, onClose]);

   useEffect(() => {
      if (isOpen && !hasDisplayedRef.current) {
         hasDisplayedRef.current = true;
      }
   }, [isOpen]);

   const inputPanelProps = useMemo(
      () => ({
         isOpen,
         onOpen,
         onClose,
      }),
      [isOpen, onOpen, onClose]
   );
   const closeOnClick = useCallback(
      (node: Element) => {
         if (node) {

            if (closeButtonRef.current?.contains(node)) {
               return;
            }

            let id: string | null;
            try {
               id = node.getAttribute('id');
            } catch {
               id = '';
            }

            if (GLOBAL_SEARCH_INPUT_ID.includes(id || '')) {
               if (!isOpen) {
                  onOpen();
                  resetSearch();
               }
            } else if (!searchContentRef.current?.contains(node)) {
               onClose();
            }
         }
      },
      [onClose, resetSearch, onOpen, isOpen]
   );

   const shouldShowPortal = hasDisplayedRef.current && isOpen;
   const shouldShowMobileButton = isLessThan1600;

   // Enable outside click when appropriate
   useOutsideClick(closeOnClick);

   return (
      <Flex
         width="100%"
         height="100%"
         alignItems={'center'}
         ref={targetRef}
         onMouseMove={handleMouseMove}
         id={GLOBAL_SEARCH_INPUT_ID[1]}
         data-testid={GLOBAL_SEARCH_INPUT_ID[1]}

      >
         <Box>
            {shouldShowPortal && (
               <Portal>
                  <SearchPortalContent
                     ref={searchContentRef}
                     isOpen={isOpen}
                     isMobile={isLessThan765}
                     isIconMode={isLessThan1600}
                     position={position}
                     inputPanelProps={inputPanelProps}
                  />
               </Portal>
            )}

            <Box ref={dropdownRef} height={'100%'} {...!shouldShowMobileButton && { w: CONTAINER_WIDTHS.INPUT_WIDTH }}>
               {!isOpen && !shouldShowMobileButton && <SearchInputPanel {...inputPanelProps} />}

               {shouldShowMobileButton && <MobileSearchButton ref={closeButtonRef} onClose={onClose} onOpen={onOpen} isOpen={isOpen} resetSearch={resetSearch} />}
            </Box>
         </Box>
      </Flex>
   );
});

App.displayName = 'App';

export default App;
