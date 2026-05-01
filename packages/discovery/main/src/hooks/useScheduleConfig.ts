import {
    type DiscoverExecuteOptions,
    updateTask,
} from "@statseeker/api/internal_api/entities";
import { useToast } from '@statseeker/hooks/useToast';
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import { getDiscoverScheduleByIdQuery } from "~/lib";
import { queryClient, discoverTaskQueryKeys } from '~/lib/ReactQuery';
import { DiscoverTaskCommand } from "~/utils";

interface UseDiscoveryConfigOptions {
    scheduleId?: number;
};

export const useScheduleConfig = ({ scheduleId }: UseDiscoveryConfigOptions) => {

    const {
        data: discoverConfigData,
    } = useQuery(
        getDiscoverScheduleByIdQuery({ id: scheduleId }),
    );

    const search = useSearch({ strict: false });
    const toast = useToast();
    const navigate = useNavigate();

    const navigateSchedule = useCallback(() => navigate({
        to: `/${search.from}`,
        params: { editId: 100 },
        search: (prev) => ({
            ...prev,
            offset: undefined,
            ...(search.from === 'schedule' && { sort: 'name', dir: 'asc' }),
            limit: undefined,
            enabled: undefined,
            selectedIds: [scheduleId ?? -1]
        }),

    }), [navigate, scheduleId, search]);


    const { mutate: saveConfig, isPending: isDiscoveryUpdating } = useMutation({
        mutationFn: (options: DiscoverExecuteOptions) => {
            const taskUpdated = {
                id: scheduleId,
                commands: [{ ...DiscoverTaskCommand, options }],
            };
            return updateTask({ task: [taskUpdated] });
        },
        onSuccess: () => {
            if (scheduleId) {
                queryClient.invalidateQueries({ queryKey: discoverTaskQueryKeys.id(scheduleId) });
            }
            navigateSchedule();
        },
        onError: () => {
            navigateSchedule();
            toast({
                title: 'Error',
                description: 'Failed to update discovery config',
                status: 'error',
            });
        },
    });

    return {
        isDiscoveryUpdating,
        saveConfig,
        discoverConfigData
    };
};

export default useScheduleConfig;
