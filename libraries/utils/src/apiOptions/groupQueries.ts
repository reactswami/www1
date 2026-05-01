import { getGroups, type Group } from '@statseeker/api/internal_api/entities/group';
import { queryOptions } from '@tanstack/react-query';

export const getGroupsWithKeyWord = async (groupSearch?: string, object_type = 'group') => {
    const data = await getGroups({
        fields: [
            'name',
            'id',
            {
                key: 'entities',
                hide: true,
                format: 'objects',
                filter: object_type ? `IN ('${object_type}','cdt_device')` : undefined,
            },
        ],
        ...(groupSearch && { text_filter: groupSearch }),
        sort: ['name'],
    });

    return data?.data;
};


export const getAllGroups = (groupSearch?: string) =>
    queryOptions<Group[]>({
        queryKey: ['group', groupSearch],
        queryFn: () => getGroupsWithKeyWord(groupSearch, ''),
        staleTime: Infinity,
    });


/* Groups that have device entities */
export const getDeviceGroups = (groupSearch?: string) =>
    queryOptions<Group[]>({
        queryKey: ['group', groupSearch],
        queryFn: () => getGroupsWithKeyWord(groupSearch),
        staleTime: Infinity,
    });
