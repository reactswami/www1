import { type ApiResponse } from "@statseeker/api/internal_api";
import {
    executeDiscover,
    type DiscoverExecuteOptions,
    type SNMPCredential,
    type IpRangeConfig,
    type ManualConfig,
    type PollerListItem,
} from "@statseeker/api/internal_api/entities";
import { useToast } from '@statseeker/hooks/useToast';
import { getAllPollers } from "@statseeker/utils/apiOptions";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useSearch, } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";
import { useDiscoverOptions, useDiscoverNimOptions, useScheduleConfig } from '~/hooks';
import { discoverConfigQueryOptions } from "~/lib";
import { type DevicePanelOptions, type ExistingDeviceOptions, type PostDiscoveryActionOptions } from "~/types";
import { getDiscoverConfig, getDiscoverExecuteOptions } from "~/utils";

interface UseDiscoveryConfigOptions {
    mode: DiscoverExecuteOptions['mode'];
    snmp_versions?: DiscoverExecuteOptions['snmp_versions'];
    customDiscoverFn?: (options: DiscoverExecuteOptions & { manual_mode?: boolean }) => Promise<ApiResponse<any>>;
};

const useDiscoveryConfig = ({ mode, snmp_versions, customDiscoverFn }: UseDiscoveryConfigOptions) => {

    const { getDefaultDiscoverConfig } = useDiscoverNimOptions();
    const search = useSearch({ strict: false });
    const { data: pollers } = useQuery<PollerListItem[]>(getAllPollers());


    const schedule = ['schedule', 'history'].includes(search?.from ?? '') ? search?.scheduleId : undefined;

    const { discoverConfigData, saveConfig, isDiscoveryUpdating } = useScheduleConfig(
        { scheduleId: schedule });

    // If `from` is undefined then its coming from the Network discovery, Rewalk, Manual Addition or Ping
    const scheduleOptions = useMemo(() =>
        ['schedule', 'history'].includes(search?.from ?? '') ? discoverConfigData?.data?.[0]?.commands?.[0]?.options : undefined,
        [discoverConfigData?.data, search?.from]);

    const discoverConfig = useSuspenseQuery(discoverConfigQueryOptions.get());
    const discoverOptionsConfig = {
        mode,
        discoverConfig: discoverConfig.data.data[0],
        ...(snmp_versions !== undefined && { snmp_versions }),
    };

    const { options, dispatch } = useDiscoverOptions({
        ...discoverOptionsConfig, ...(snmp_versions !== undefined && { snmp_versions }),
        discoverOptions: scheduleOptions ?? getDiscoverExecuteOptions(getDefaultDiscoverConfig(mode))
    });

    useEffect(() => {
        if (scheduleOptions !== undefined) {
            dispatch({ type: 'RESET', payload: scheduleOptions });
        }
    }, [scheduleOptions, dispatch]);  // <-- runs when scheduleOptions resolves

    const selectedPoller = useMemo(() => {
        return pollers?.filter(p => p.name === options?.poll_name)?.[0];
    }, [pollers, options]);

    const defaultConfigValues = useMemo(() => {
        return getDiscoverConfig(options);
    }, [options]);

    const toast = useToast();
    const navigate = useNavigate();

    const runPingDiscover = useCallback(() => {
        const defaultRanges = { include_ranges: [], exclude_ranges: [] };
        const selectedIpRanges = (defaultConfigValues.mode === 'iprange' && options.discover_config?.ranges) ? {
            include_ranges: options?.discover_config?.ranges?.include ?? [],
            exclude_ranges: options?.discover_config?.ranges?.exclude ?? []
        } : defaultRanges;

        if (selectedPoller) {
            navigate({
                to: '/ping_discover',
                search: (prev) => ({
                    ...prev,
                    poller: selectedPoller,
                    ...selectedIpRanges,
                }),
            });
        }
    }, [defaultConfigValues.mode, options.discover_config?.ranges, navigate, selectedPoller]);

    const { mutate: runNowMutation, isPending } = useMutation({
        mutationFn: customDiscoverFn ? () => customDiscoverFn(options) : (() => executeDiscover(options)),
        onSuccess: () => {
            navigate({
                to: '/current',
                search: true,
            });
        },
        onError: () =>
            toast({
                title: 'Error',
                description: `Failed to start ${mode.toLowerCase()}`,
                status: 'error',
            }),
    });

    const handleCreateConfig = useCallback(() => {
        // TODO: add creating a config
    }, []);

    const handleSaveConfig = useCallback(() => {
        saveConfig(options);
    }, [saveConfig, options]);


    const handleSNMPCredentialsPanelChange = useCallback(
        (data: SNMPCredential[] | undefined) =>
            dispatch({
                type: 'SET_SNMP_CREDENTIALS',
                payload: { snmp_credentials: data ?? [] },
            }),
        [dispatch]
    );

    const handleModeChange = useCallback(
        (data: DiscoverExecuteOptions['mode']) =>
            dispatch({
                type: 'SET_MODE',
                payload: data,
            }),
        [dispatch]
    );

    const handleIPAddressRangesPanelChange = useCallback(
        (data: IpRangeConfig[] | undefined) =>
            dispatch({
                type: 'SET_RANGES',
                payload: data ?? [],
            }),
        [dispatch]
    );

    const handleManualDevicePanelChange = useCallback(
        (data: ManualConfig[] | undefined, mode: boolean) =>
            dispatch({ type: 'SET_MANUAL_CONFIGS', payload: { data, isManualMode: mode } }),
        [dispatch]
    );

    const handlePostDiscoveryActionsPanelChange = useCallback(
        (data: PostDiscoveryActionOptions) =>
            dispatch({ type: 'SET_POST_DISCOVERY_ACTIONS', payload: data }),
        [dispatch]
    );

    const handleExistingDeviceChange = useCallback(
        (data: ExistingDeviceOptions) =>
            dispatch({ type: 'SET_EXISTING_DEVICE_OPTIONS', payload: data }),
        [dispatch]
    );

    const handleDeviceChange = useCallback(
        (data: DevicePanelOptions) => {
            dispatch({ type: 'SET_DEVICES', payload: data.devices });
            dispatch({ type: 'SET_GROUPS', payload: data.groups });
        },
        [dispatch]
    );

    const handlePollerChange = useCallback(
        (data?: PollerListItem | null) => {
            dispatch({ type: 'SET_POLLER', payload: data });
        },
        [dispatch]
    );

    return {
        options,
        scheduleOptions,
        selectedPoller,
        defaultConfigValues,
        dispatch,
        runNowMutation,
        isPending,
        handleCreateConfig,
        handleSNMPCredentialsPanelChange,
        handleModeChange,
        handleIPAddressRangesPanelChange,
        handleManualDevicePanelChange,
        handlePostDiscoveryActionsPanelChange,
        handleExistingDeviceChange,
        handleDeviceChange,
        handlePollerChange,
        handleSaveConfig,
        runPingDiscover
    };
};

export default useDiscoveryConfig;
