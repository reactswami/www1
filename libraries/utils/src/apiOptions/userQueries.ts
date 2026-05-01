import { getUsers } from '@statseeker/api/internal_api/entities/user';
import { queryOptions } from '@tanstack/react-query';

export const getUsersWithKeyWord = async (userSearch?: string, onlyAdmins?: boolean) => {
    const data = await getUsers({
        fields: [
            'name',
            'id',
            ...(onlyAdmins === true ? [{ key: 'is_admin', hide: true, filter: '== TRUE' }] : []),
        ],
        ...(userSearch && { text_filter: userSearch }),
        sort: ['name'],
    });

    return data?.data;
};

export const getAllUsers = (userSearch?: string) =>
    queryOptions({
        queryKey: ['users', userSearch],
        queryFn: () => getUsersWithKeyWord(),
    });
