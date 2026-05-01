import { useDisclosure } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { type Cfg } from 'packages/oa/ping-discover/src/api/fetchOasWithPingService';
import { saveIpRanges } from 'packages/oa/ping-discover/src/api/saveIpRanges';
import { environment } from 'packages/oa/ping-discover/src/config/environment';
import { queryKeys, useToast } from 'packages/oa/ping-discover/src/lib';
import { useRef, useState, useEffect, useCallback } from 'react';

const { endpoints } = environment;

export const usePingDiscovery = () => {
   const toast = useToast();
   const queryClient = useQueryClient();
   const confirmDiscoveryRunDisclosure = useDisclosure();
   const ipScanRangeRef = useRef<HTMLTextAreaElement>(null);
   const [isErrorEmptyIpRange, setIsErrorEmptyIpRange] = useState(false);
   const [iframeURL, setIframeURL] = useState<null | string>(null);
   const [forceRerender, setForceRerender] = useState(0);
   const [isRunning, setIsRunning] = useState<boolean>(false);
   const oaName = useRef<string>();
   // We have to record to component and device id to contact the API to save the cfg
   const componentId = useRef<string>();
   const deviceId = useRef<string>();
   const iframeRef = useRef<HTMLIFrameElement>(null);

   useEffect(() => {
      if (!iframeURL || iframeRef.current === null) {
         setIsRunning(false);
         return;
      }

      const listener = (_e: any) => {
         setIsRunning(false);

         // Scroll to the bottom of iframe to show completion or error message
         if (iframeRef.current !== null && iframeRef.current.contentDocument !== null) {
            iframeRef.current.contentDocument.body.scrollTo(
               0,
               iframeRef.current.contentDocument.body.scrollHeight
            );
         }
      };

      setIsRunning(true);
      iframeRef.current.addEventListener('load', listener);

      return () => {
         if (iframeRef.current !== null) {
            iframeRef.current.removeEventListener('load', listener);
         }
      };
   }, [iframeURL, forceRerender]);

   const setValues = useCallback((
      value: string,
      ids: { deviceId?: string; componentId?: string; cfg?: Cfg }
   ) => {
      setIframeURL(null);
      deviceId.current = ids.deviceId;
      oaName.current = value;
      componentId.current = ids.componentId;
      if (ipScanRangeRef.current) {
         ipScanRangeRef.current.value = ids.cfg ?? '';
      }
   }, []);

   const generateIFrameEndpointUrl = useCallback(({ isDryRun }: { isDryRun: boolean }) => {
      if (!oaName.current) {
         throw new Error('No ID for the Observability Appliance set');
      }
      const ipScanRanges =
         '&range=' + ipScanRangeRef.current?.value.split('\n').join('&range=');
      const uri = endpoints.runPingDiscovery(oaName.current, ipScanRanges, isDryRun);
      return encodeURI(uri);
   }, []);

   const startDiscovery = useCallback(({ isDryRun }: { isDryRun: boolean }) => {
      const iframeEndpoint = generateIFrameEndpointUrl({ isDryRun });
      setIframeURL(prev => {
         if (iframeEndpoint === prev) {
            // Can't avoid this since forceRerender is separate state,
            // but keeping the setter functional keeps iframeURL out of deps
            setForceRerender(value => value + 1);
         }
         return iframeEndpoint;
      });
   }, [generateIFrameEndpointUrl]);

   const handleDiscovery = useCallback(({ isDryRun }: { isDryRun: boolean }) => {
      const isScanRangeEmpty = !ipScanRangeRef.current?.value;
      if (isScanRangeEmpty) {
         setIsErrorEmptyIpRange(true);
         return;
      }
      if (!isDryRun) {
         confirmDiscoveryRunDisclosure.onOpen();
      } else {
         startDiscovery({ isDryRun: true });
      }
   }, [confirmDiscoveryRunDisclosure, startDiscovery]);

   const { mutate, isPending: isSaving } = useMutation({
      mutationFn: saveIpRanges,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: queryKeys.oaAll });
         toast({
            status: 'success',
            title: 'Success',
            description: 'Your IP addresses ranges have been saved.',
         });
      },
      onError: ({ message }) => {
         toast({
            status: 'error',
            title: 'Error',
            description: `Error while saving your IP addresses. If the problem persists, please contact the support team. \n ${message}`,
         });
      },
   });

   const saveRanges = useCallback(() => {
      if (!componentId.current || !deviceId.current) {
         throw new Error(
            'Invalid server state: component id or device id missing. If the problem persists, please contact the support team'
         );
      }
      mutate({
         cfg: ipScanRangeRef.current?.value ?? '',
         deviceId: deviceId.current,
         componentId: componentId.current,
      });
   }, [mutate]);

   const resetIsErrorIpRange = useCallback(() => setIsErrorEmptyIpRange(false), []);
   const startDryRun = useCallback(() => handleDiscovery({ isDryRun: true }), [handleDiscovery]);
   const confirmDiscovery = useCallback(() => handleDiscovery({ isDryRun: false }), [handleDiscovery]);
   const publicStartDiscovery = useCallback(() => startDiscovery({ isDryRun: false }), [startDiscovery]);

   return {
      isIpRangeValid: isErrorEmptyIpRange,
      resetIsErrorIpRange,
      startDryRun,
      startDiscovery: publicStartDiscovery,
      confirmDiscovery,
      confirmDiscoveryRunDisclosure,
      setValues,
      ipScanRangeRef,
      iframeURL,
      saveRanges,
      isSaving,
      forceRerender,
      isRunning,
      iframeRef,
   };
};