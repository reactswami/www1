import {
   act,
   render,
   renderHook,
   screen,
   waitFor,
   within,
} from '@testing-library/react';

import { usePingDiscovery } from './usePingDiscovery';
import { failedHandlers } from '~/test/server/handlers/oa';
import { server } from '~/test/server/node';
import { testWrapper } from '~/test/utils';

describe('<UsePingDiscovery />', () => {
   it('should render successfully', () => {
      expect(() =>
         renderHook(() => usePingDiscovery(), testWrapper)
      ).not.toThrow();
   });

   it('returns isIpRangeValid false if the ip scan range is empty', async () => {
      const { result } = renderHook(() => usePingDiscovery(), testWrapper);

      expect(result.current.isIpRangeValid).toBe(false);
      await act(() => result.current.startDryRun());
      expect(result.current.isIpRangeValid).toBe(true);
      await act(() => result.current.resetIsErrorIpRange());
      expect(result.current.isIpRangeValid).toBe(false);
   });

   it('returns an iframe url when trigger a dryrun', async () => {
      const expectediframeUrl =
         '/cgi/oa-ping-discover-client?oa=my-oa&range=include%201.2.3.4&dryrun=true';
      const { result } = renderHook(() => usePingDiscovery(), testWrapper);
      render(
         <textarea readOnly value="hello" ref={result.current.ipScanRangeRef} />
      );

      await act(() =>
         result.current.setValues('my-oa', {
            deviceId: '1',
            componentId: '2',
            cfg: 'include 1.2.3.4',
         })
      );
      await act(() => result.current.startDryRun());

      await waitFor(() =>
         expect(result.current.iframeURL).toBe(expectediframeUrl)
      );
   });

   it('allows me to save my ip scan ranges', async () => {
      const { result } = renderHook(() => usePingDiscovery(), testWrapper);
      render(
         <textarea
            readOnly
            value="hello"
            ref={result.current.ipScanRangeRef}
         />,
         testWrapper
      );

      await act(() =>
         result.current.setValues('my-oa', {
            deviceId: '1',
            componentId: '2',
            cfg: 'include 1.2.3.4;',
         })
      );
      await act(() => result.current.saveRanges());

      expect(
         within(screen.getAllByRole('status')[0]).getByText(/success/i) // unsure why, but there are two toasts rendering here hence the getAllBy**
      ).toBeInTheDocument();
   });

   it('allows shows an error when it fails to save an ip range', async () => {
      server.use(...failedHandlers);
      const { result } = renderHook(() => usePingDiscovery(), testWrapper);
      render(
         <textarea
            readOnly
            value="hello"
            ref={result.current.ipScanRangeRef}
         />,
         testWrapper
      );

      await act(() =>
         result.current.setValues('my-oa', {
            deviceId: '1',
            componentId: '2',
            cfg: 'include 1.2.3.4;',
         })
      );
      await act(() => result.current.saveRanges());

      expect(
         within(screen.getAllByRole('status')[0]).getAllByText(/error/i).length // unsure why, but there are two toasts rendering here hence the getAllBy**
      ).toBeGreaterThan(0);
   });
});
