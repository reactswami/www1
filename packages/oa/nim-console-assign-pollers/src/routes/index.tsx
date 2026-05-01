import { Box } from '@chakra-ui/react';
import { type ReactElement, useEffect, useLayoutEffect, useRef } from 'react';
import { fetchDevicePingPoller } from '~/api';
import { useAssignPollersModal } from '@statseeker/hooks/useAssignPollersModal';

export const AppRoutes = (): ReactElement => {
   const hasBeenOpened = useRef(false);
   const idRef = useRef<number>(-1);
   const preselectedPollers = useRef<
      { id: string; name: string; poll: 'on' | 'off' | 'exceeded'; isDefault: boolean; isExceeded: boolean }[]
   >([]);

   const { Modal, disclosure } = useAssignPollersModal({
      selectedDevices: [idRef.current],
      queryKey: ['oa'], // The query key doesn't really matter here, we only have that one call.
      modalOptions: {
         isCentered: false,
         closeOnOverlayClick: false,
         closeOnEsc: false,
         size: 'full',
         onCloseComplete: () => window.close(), // Close the window once the modal is closed
      },
      preselectedPollers: preselectedPollers.current,
      hideClose: true,
   });

   useLayoutEffect(() => {
      const id = new URLSearchParams(window.location.search).get('device'); // Retrieve the id from the url
      if (!id) {
         throw Error(
            'Error retrieving the id of the device. If the problem persists, please contact the support team.'
         );
      }
      idRef.current = Number(id);
      fetchDevicePingPoller(id)
         .then((pollers) => {
            preselectedPollers.current = pollers.filter(poller => poller.enabled !== 'off');
         })
         .then(() => {
            disclosure.onOpen();
         });
   }, []);

   useEffect(() => {
      // This a bit hacky, but because the modal appear as 'not open' intially, we can't just rely on 'isOpen'.
      // So keep a boolean flag to see if the modal has been opened. We use ref as it will hold states between re-render without triggering new renders.
      if (hasBeenOpened.current === true) {
         window.close();
      }
      if (disclosure.isOpen) {
         hasBeenOpened.current = true;
      }
   }, [disclosure.isOpen]);

   return (
      <Box min-width={'100vw'} min-height={'100vh'}>
         <Modal />
      </Box>
   );
};
