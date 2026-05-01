import { type Device, isDefaultDevice } from '@statseeker/components/Legacy/DevicePanel';
import { type EntityErrors } from '@statseeker/hooks';
import { getProductName } from '@statseeker/utils/environment';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { AdvancedOptions, DiscoveryPanelContainer, ManualDeviceAddition } from '~/components';
import useDiscoveryConfig from '~/hooks/useDiscoveryConfig';

export const Route = createFileRoute('/_discovery/manual')({
   component: ManualDeviceAdditionRoute,
});

function ManualDeviceAdditionRoute() {
   // Isolating the errors, this seems good to be in the options, but the concept of options is to 
   // contain the discover config and its better not to pollute the concern and keep it as pure as possible.
   const [entityErrors, setEntityErrors] = useState<EntityErrors | undefined>([]);
   const [validateManual, setValidateManual] = useState<boolean>(false);
   const [pendingSubmit, setPendingSubmit] = useState<boolean>(false);
   const [isDirty, setDirty] = useState<boolean>(false);

   const { options, dispatch, runNowMutation, selectedPoller, defaultConfigValues,
      isPending, handleManualDevicePanelChange, handlePollerChange, handleSaveConfig } =
      useDiscoveryConfig({ mode: 'Manual' });
   const isPingOnly = useMemo(() => defaultConfigValues?.manualConfig?.every(m => m.ping_only === true), [defaultConfigValues?.manualConfig]);

   const handleSetEntityErrors = useCallback((errors?: EntityErrors) => {
      setEntityErrors(errors);
   }, []);

   // When errors are updated AND we have a pending submit, decide whether to proceed
   useEffect(() => {
      if (options.manual_mode === true && !isDirty && isDefaultDevice(options?.manual_config?.[0] as Device)) {
         // Case when the default entry has error
         setPendingSubmit(false);
         return;
      }

      if (options.manual_mode === true && !isDirty && (entityErrors?.length ?? 0) > 0) {
         // Case when there are errors when manualy adding instead of importing
         setPendingSubmit(false);
         return;
      }

      if (options.manual_mode === false && entityErrors === undefined && isDirty) {
         // Case when errors are on the way, do not call setPendingSubmit to false
         return;
      }

      if (options.manual_mode === false && entityErrors === undefined && !isDirty) {
         if (!pendingSubmit) return;
         runNowMutation();
         // Case when no errors in the imported config
         setPendingSubmit(false);
         return;
      }

      if (!pendingSubmit) return;


      if ((entityErrors?.length ?? 0) === 0) {
         //Case when there were errors and they were manually cleared for both manual and import
         runNowMutation();
      }

      setPendingSubmit(false);
      // If errors exist, validateManual stays true so EntityCard shows errors
   }, [pendingSubmit, entityErrors, runNowMutation, isDirty, options]);

   function handleSubmit() {
      if (isDirty === false && (entityErrors?.length ?? 0 > 0)) {
         setValidateManual(true);
         return;
      }
      setDirty(false);
      setEntityErrors(undefined);
      setValidateManual(true);
      setPendingSubmit(true);     // Defer runNowMutation until errors arrive
   }

   return (
      <DiscoveryPanelContainer
         onStartClick={handleSubmit}
         props={{ className: 'discovery-manual' }}
         infoCardText={`The Manual Device Addition process allows for specific devices to be added to ${getProductName()}. Devices added this way will still undergo a discovery process for the SNMP data that they support.`}
         advancedOptions={
            <AdvancedOptions discoverMode="Manual" dispatch={dispatch} defaultValues={defaultConfigValues} hiddenPanels={[isPingOnly ? 'snmp' : '']} />
         }
         isRunning={isPending}
         onSaveConfig={handleSaveConfig}
      >
         <ManualDeviceAddition
            poller={selectedPoller}
            onPollerChange={handlePollerChange}
            onChange={handleManualDevicePanelChange}
            shouldValidate={validateManual}
            setShouldValidate={setValidateManual}
            setEntityErrors={handleSetEntityErrors}
            setDirty={setDirty}
         />
      </DiscoveryPanelContainer>
   );
}