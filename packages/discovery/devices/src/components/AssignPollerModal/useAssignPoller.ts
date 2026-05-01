// ============================================================================
// useAssignPoller.ts - Meat of the poller assigment
// ============================================================================
import { type PollerListItem } from '@statseeker/api/internal_api/entities';
import { useToast } from '@statseeker/hooks';
import { arePollerArraysEqual, arePollerValuesEqual, filterStatseekerServer, getAllPollers } from '@statseeker/utils/apiOptions';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { type ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateDevices } from '~/api/device';
import { updatePingPoller } from '~/api/oa_component_service';
import { queryClient } from '~/lib';
import { type DeviceListItem } from '~/types/general';

interface PollerFormData {
    basic: PollerListItem | null;
    snmp: PollerListItem | null;
    ping: PollerListItem[] | null;
    defaultPing: PollerListItem | null;
}
export function useAssignPoller({
    isOpen,
    onClose,
    row,
    selectedCount,
}: {
    isOpen: boolean;
    onClose: () => void;
    row?: DeviceListItem;
    selectedCount?: number;
}) {

    const [isAdvanced, setIsAdvanced] = useState(false);
    const { data: pollers, isLoading } = useQuery(getAllPollers());
    const search = useSearch({ from: '/devices' });
    const navigate = useNavigate();
    const toast = useToast();

    const initialFormValues = useRef<PollerFormData>({
        basic: null,
        snmp: null,
        ping: null,
        defaultPing: null,
    });

    const {
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
    } = useForm<PollerFormData>({
        defaultValues: {
            basic: null,
            snmp: null,
            ping: null,
            defaultPing: null,
        },
    });

    const hasInitializedAdvanced = useRef(false);

    // Watch ping pollers to dynamically filter default ping poller options
    const pingPollers = watch('ping');

    // Reset form when modal opens and set initial values for single device edit    
    useEffect(() => {
        if (isOpen) {
            setIsAdvanced(false);
            hasInitializedAdvanced.current = false;

            // Determine initial values
            let initialValues: PollerFormData;

            const statseekerServerPoller = pollers?.find(filterStatseekerServer);
            if ((selectedCount ?? 0) === 1 && pollers && row?.snmp_poller) {
                const selectedPoller = pollers.find(p => p.name === row.snmp_poller);
                initialValues = {
                    basic: selectedPoller ?? null,
                    snmp: null,
                    ping: null,
                    defaultPing: null,
                };
            } else {
                initialValues = {
                    // Multiple devices select statseeker as default
                    basic: statseekerServerPoller ?? null,
                    snmp: null,
                    ping: null,
                    defaultPing: null,
                };
            }
            initialFormValues.current = initialValues;
            reset(initialValues);
        }
    }, [isOpen, reset, selectedCount, pollers, row, isLoading]);

    /**     
     * Clear the default ping selection if not found in the ping poller list     
     */
    useEffect(() => {
        const defaultPing = watch('defaultPing');
        if (defaultPing && pingPollers) {
            const hasPoller = pingPollers.some(p => p.id === defaultPing.id);
            if (!hasPoller) {
                reset({ ...watch(), defaultPing: null });
            }
        }
    }, [pingPollers, watch, reset]);

    /**     
     * Filter out the pollers from the default ping poller drop down based on the 
     * ping poller selection.
     */
    const defaultPollerSelect = useCallback((pollers: PollerListItem[] | null) => {
        return (data: PollerListItem[]): PollerListItem[] => {
            if (!pollers || pollers.length === 0) return [];
            return data.filter(poller => pollers.some(p => p.id === poller.id));
        };
    }, []);

    const onModeChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        const advancedCheck = Number(e?.target?.value) === 0 ? false : true;
        setIsAdvanced(Number(e?.target?.value) === 0 ? false : true);
        if (advancedCheck && !hasInitializedAdvanced.current && pollers) {
            hasInitializedAdvanced.current = true;

            // Find the statseekerserver poller
            const statseekerServerPoller = pollers.find(filterStatseekerServer);

            if (statseekerServerPoller) {
                const snmpPoller = pollers.find(p => p.name === row?.snmp_poller) ?? statseekerServerPoller;
                setValue('snmp', snmpPoller);

                const pingPollers = pollers.filter(p => row?.pollers.includes(p.name)) ?? [statseekerServerPoller];
                setValue('ping', pingPollers);

                const defaultPingPoller = pollers.filter(p => p.name === row?.default_poller)?.[0] ?? statseekerServerPoller;
                setValue('defaultPing', defaultPingPoller);

                // Save the reference to the initial values
                initialFormValues.current = {
                    ...initialFormValues.current,
                    snmp: snmpPoller,
                    ping: pingPollers,
                    defaultPing: defaultPingPoller
                };
            }
        }
    }, [pollers, setValue, row?.snmp_poller, row?.default_poller, row?.pollers
    ]);

    /**     
     * Check if form values have actually changed from initial values
     */
    const hasFormChanged = useCallback((currentValues: PollerFormData): boolean => {
        const initial = initialFormValues.current;

        if (isAdvanced) {
            return (
                !arePollerValuesEqual(currentValues.snmp, initial.snmp) ||
                !arePollerArraysEqual(currentValues.ping, initial.ping) ||
                !arePollerValuesEqual(currentValues.defaultPing, initial.defaultPing)
            );
        } else {
            // In basic mode, only check basic field
            return !arePollerValuesEqual(currentValues.basic, initial.basic);
        }
    }, [isAdvanced]);

    const updateSNMPMutation = useMutation({
        mutationFn: updateDevices,
        mutationKey: ['updateSnmpPollers'],
        onError: ({ message }: Error) => {
            toast({
                title: 'Failed to configure snmp poller',
                description: message,
                status: 'error',
                isClosable: true,
            });
        },
    });


    const updatePingPollerMutation = useMutation({
        mutationFn: updatePingPoller,
        mutationKey: ['updatePingPollers'],
        onError: ({ message }: Error) => {
            toast({
                title: 'Failed to configure ping pollers',
                description: message,
                status: 'error',
                isClosable: true,
            });
        },
    });

    /**
     * Check if any mutation is currently loading
     */
    const isSubmitting = updateSNMPMutation.isPending || updatePingPollerMutation.isPending;

    /**
     * Form submission handler
     */
    const onSubmit = useCallback(async (data: PollerFormData) => {

        if (!hasFormChanged(data)) {
            toast({
                title: 'No Changes',
                description: 'No changes were made to the pollers',
                status: 'info',
                isClosable: true,
            });
            onClose();
            return;
        }

        try {

            if (isAdvanced) {
                if (!data.snmp) {
                    return;
                }

                if (!data.ping || data.ping.length === 0) {
                    return;
                }

                if (!data.defaultPing) {
                    return;
                }

                // Determine which mutations need to run based on what changed
                const mutations = [];

                // Only update SNMP if it changed                
                if (!arePollerValuesEqual(data.snmp, initialFormValues.current.snmp)) {
                    mutations.push(
                        updateSNMPMutation.mutateAsync({
                            filters: {
                                ...search,
                                selectedIds: search.selectedIds === 'all' ? undefined : search.selectedIds,
                            },
                            data: {
                                snmp_poller_id: data.snmp?.deviceid,
                                assignedPollers: undefined,
                            },
                        })
                    );
                }

                // Only update ping pollers if they changed
                if (
                    !arePollerArraysEqual(data.ping, initialFormValues.current.ping) ||
                    !arePollerValuesEqual(data.defaultPing, initialFormValues.current.defaultPing)
                ) {
                    mutations.push(
                        updatePingPollerMutation.mutateAsync({
                            devices: search.selectedIds === 'all' ? [] : search.selectedIds,
                            pollers: data.ping.map(p => p.name),
                            default_poller: data?.defaultPing?.name,
                            use_filters: search.selectedIds === 'all' ? 1 : 0,
                            search_query: '',
                            post_filter: search.selectedIds === 'all' ? `{table} != 'device_oa'` : undefined,
                        })
                    );
                }

                // Selective execution of mutations
                await Promise.all(mutations);


            } else {
                // Basic mode validation
                if (!data.basic) {
                    return;
                }

                await updateSNMPMutation.mutateAsync({
                    filters: {
                        ...search,
                        selectedIds: search.selectedIds === 'all' ? undefined : search.selectedIds,
                    },
                    data: {
                        snmp_poller_id: data.basic?.deviceid,
                        assignedPollers: undefined,
                    },
                });
            }

            onClose();

            toast({
                title: 'Success',
                description: 'Pollers assigned successfully',
                status: 'success',
            });

            queryClient.invalidateQueries();
            navigate({
                search: (prev) => ({
                    ...prev,
                    selectedIds: undefined,
                }),
                replace: true,
            });

        } catch (error) {
            // Error already handled by individual mutation onError callbacks
            console.info('Submission error:', error);
        }

    }, [isAdvanced, onClose, search, hasFormChanged, toast, navigate, updateSNMPMutation, updatePingPollerMutation]);

    return {
        control,
        submitHandler: handleSubmit(onSubmit),
        isAdvanced,
        defaultPollerSelect,
        onModeChange,
        pingPollers,
        isSubmitting
    };

}