import { Box, Flex, Heading, useDisclosure, Button, ButtonGroup } from '@chakra-ui/react';
import { type PollerListItem, } from '@statseeker/api/internal_api/entities';
import EntityTypeAhead from '@statseeker/components/Legacy/EntityTypeAhead/EntityTypeAhead';
import { getAllPollers, pingPollerSelect, type PollerSelect } from '@statseeker/utils/apiOptions';
import {
    PingDiscoveryConfirmDiscoveryModal,
    PingDiscoveryHelpModal,
    PingDiscoveryOutputSection,
    PingDiscoveryRangesInputSection,
} from 'packages/oa/ping-discover/src/components';
import { usePingDiscovery } from 'packages/oa/ping-discover/src/hooks/usePingDiscovery';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type PingDiscoverProps } from '~/types';

export const PingDiscover = (props: PingDiscoverProps) => {
    const helpModalDisclosure = useDisclosure();
    const {
        confirmDiscoveryRunDisclosure,
        isIpRangeValid,
        resetIsErrorIpRange,
        ipScanRangeRef,
        startDryRun,
        startDiscovery,
        confirmDiscovery,
        iframeURL,
        setValues,
        saveRanges,
        isSaving,
        forceRerender,
        isRunning,
        iframeRef,
    } = usePingDiscovery(); // This hook contains the business logic for this component

    const hasStartedInitialRun = useRef(false);
    const [canSave, setCanSave] = useState<boolean>(false);

    useEffect(() => {
        setCanSave(Boolean(props?.poller?.name));
    }, [props?.poller?.name]);

    useEffect(() => {
        if (!props?.poller || hasStartedInitialRun.current) return;

        const defaultIncludeRanges = props?.include_ranges?.map(range => `include ${range}`) ?? [];
        const defaultExcludeRanges = props?.exclude_ranges?.map(range => `exclude ${range}`) ?? [];
        const defaultRanges = [...defaultIncludeRanges, ...defaultExcludeRanges];

        if (defaultRanges?.length === 0) {
            resetIsErrorIpRange();
            if (ipScanRangeRef.current) {
                ipScanRangeRef.current.value = '';
            }
            setValues('', {
                deviceId: '',
                componentId: '',
                cfg: '',
            });
            hasStartedInitialRun.current = true;
            return;
        }

        setValues(props.poller.name, {
            deviceId: String(props.poller.deviceid),
            componentId: String(props.poller.componentId),
            cfg: props.poller.cfg,
        });

        if (ipScanRangeRef.current) {
            ipScanRangeRef.current.value = defaultRanges.join('\n');
        }

        hasStartedInitialRun.current = true;
        startDryRun();
    }, [props?.poller, props?.include_ranges, props?.exclude_ranges, resetIsErrorIpRange, setValues, startDryRun, ipScanRangeRef]);

    const onPollerSelect = useCallback((selectedPoller?: PollerListItem | null) => {
        if (!selectedPoller) {
            setCanSave(false);
            resetIsErrorIpRange();
            if (ipScanRangeRef.current) {
                ipScanRangeRef.current.value = '';
            }
            setValues('', {
                deviceId: '',
                componentId: '',
                cfg: '',
            });
            return;
        }

        setCanSave(true);
        resetIsErrorIpRange();
        setValues(selectedPoller.name, {
            deviceId: String(selectedPoller.deviceid),
            componentId: String(selectedPoller?.componentId),
            cfg: selectedPoller?.cfg,
        });
    }, [resetIsErrorIpRange, setValues, ipScanRangeRef]);

    return (
        <>
            <PingDiscoveryHelpModal disclosure={helpModalDisclosure} />
            <PingDiscoveryConfirmDiscoveryModal
                disclosure={confirmDiscoveryRunDisclosure}
                onContinue={startDiscovery}
            />
            <Box maxWidth={'40ch'}>
                <EntityTypeAhead<PollerListItem, PollerSelect> entityQueryOption={getAllPollers} isMulti={false} label="Select Poller" onChange={onPollerSelect}
                    queryParams={pingPollerSelect}
                    defaultValue={props?.poller}
                    isDisabled={isRunning}
                />
            </Box>
            <Heading size="sm">IP Scan Ranges</Heading>
            <Flex alignItems="stretch" gap="sm" flexGrow={1}>
                <PingDiscoveryRangesInputSection
                    isDisabled={isRunning || !canSave}
                    isInvalid={isIpRangeValid}
                    reset={resetIsErrorIpRange}
                    onOpen={helpModalDisclosure.onOpen}
                    ref={ipScanRangeRef}
                />
                <PingDiscoveryOutputSection
                    key={forceRerender}
                    iframeRef={iframeRef}
                    iframeURL={iframeURL}
                    isRunning={isRunning}
                />
            </Flex>

            <ButtonGroup gap="sm">
                { /* When remote props are available, its run from the remote and should not display discovery button*/
                    !props?.poller &&
                    <Button
                        isDisabled={isRunning}
                        onClick={confirmDiscovery}
                        title={
                            isRunning
                                ? 'Discover is running'
                                : 'Run a ping discover by ranges using the selected Observability Appliance'
                        }
                    >
                        Run discovery
                    </Button>
                }
                <Button
                    isDisabled={isRunning || !canSave}
                    variant="outline"
                    onClick={startDryRun}
                    title={
                        isRunning
                            ? 'Discover is running'
                            : 'Scan devices in IP ranges using the selected Observability Appliance'
                    }
                >
                    Dry Run
                </Button>
                <Button
                    variant="ghost"
                    onClick={saveRanges}
                    isLoading={isSaving}
                    isDisabled={!canSave}
                >
                    Save scan ranges
                </Button>
            </ButtonGroup>
        </>
    );
};
