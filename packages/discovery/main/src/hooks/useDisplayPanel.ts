import { type NimOption } from '@statseeker/api/internal_api/entities';

export function useDisplayPanel(
   data: NimOption[] | undefined,
   getRawValueByKey: (data: NimOption[], key: string) => string | undefined
) {
   // I hate to write another hook, but still i'm open in case we can move this code to another one.
   const getDisplayPanels = () => {
      // Return empty panels until the data is valid
      // The data check can done either in the hook or
      // in the place where the hook is called inoder for
      // the hook functions getValueByKey and getRawValueByKey to
      // function as expected, because useQuery returns data which is
      // still fetching.
      if (!data) {
         return {
            range: false,
            rewalk: false,
            manual: false,
            pingOnly: false,
            remotePingOnly: false,
            history: false,
            schedule: false,
         };
      }

      // Make decision what to display after getting the nim options
      const allowedPanels = getRawValueByKey(data, 'discover_allowed_panels');

      // If there are no nim options set, display all the panels, which is the
      // default behavior
      if (!allowedPanels) {
         return {
            range: true,
            rewalk: true,
            manual: true,
            pingOnly: true,
            remotePingOnly: true,
            history: true,
            schedule: true,
         };
      }

      // If nim options are found then split the csv and get the individual state
      const panelState = allowedPanels.split(',');
      return {
         range: panelState.includes('range'),
         rewalk: panelState.includes('rewalk'),
         manual: panelState.includes('manual'),
         pingOnly: panelState.includes('ping_only'),
         remotePingOnly: panelState.includes('remote_ping_only'),
         history: panelState.includes('history'),
         schedule: panelState.includes('schedule'),
      };
   };

   return { allowedPanels: getDisplayPanels() };
}
