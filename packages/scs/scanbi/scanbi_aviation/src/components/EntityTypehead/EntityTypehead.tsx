import { TypeAheadSelectInput } from '@statseeker/components';
import { useQuery } from '@tanstack/react-query';
import { memo, useEffect, useState } from 'react';
import { fetchEntity } from '~/api/entity';
import { queryKeys, useToast } from '~/lib';
import { type FetchEntityResponse } from '~/types/api';
import { type EntityFilter, type EntityType, type RowData } from '~/types/models';

type EntityValue = {
   value: string;
   name: string;
};

export interface EntityTypAheadProps<T> {
   setFilter: (arg: number, title: string) => void;
   label: string;
   entity: EntityType;
   entityId: number;
   entityFilter?: EntityFilter;
   entityFilterId?: number;
   isFilter: boolean;
   error?: string;
   isRequired?: boolean;
   isSave?: boolean;
   width?: string;
   onItemChange?: (e: RowData | undefined) => void;
}

const TypeAheadEntity = <T,>({
   setFilter,
   label,
   entity,
   entityFilter,
   entityFilterId,
   entityId,
   isRequired,
   isSave,
   width,
   isFilter = false,
   onItemChange,
}: EntityTypAheadProps<T>) => {
   const [entityState, setEntityState] = useState<{ id: Number; hasChanged: boolean }>({
      id: 0,
      hasChanged: false,
   });
   const toast = useToast();
   const { isLoading, isError, isSuccess, data, error } = useQuery({
      queryKey: queryKeys[entity],
      queryFn: fetchEntity,
      select: ({ data }) => {
         return data;
      },
   });

   useEffect(() => {
      if (isError) {
         if (error.request.status === 401) {
            toast({
               status: 'error',
               title: 'Failed to fetch ',
               description: `You are currently signed out, please login again to continue. If the problem persists, contact the Statseeker support.\n ${error.message}`,
            });
         } else {
            toast({
               status: 'error',
               title: 'Failed to fetch ',
               description: `The group filter failed to retrieve the list of groups. If the problem persists, contact the Statseeker support.\n ${error.message}`,
            });
         }
      }
   }, [isError]);

   const [typeAheadDefault, setDefaulValue] = useState<EntityValue | undefined>({
      name: '',
      value: '',
   });

   const resetFilter = (resetId: number = 0) => {
      setDefaulValue(() => ({ name: '', value: '' }));
      setEntityState(() => ({ id: 0, hasChanged: false }));
      setFilter(resetId, '');
   };

   const setEntityFilter = ({ id, title }: { id: number; title: string }) => {
      setDefaulValue(() => ({ name: title, value: id.toString() }));
      setEntityState(() => ({ id: id, hasChanged: true }));
      setFilter(id, title);
   };

   useEffect(() => {
      const dataList = getData();
      const filteredEntity = dataList?.filter((entity) => Number(entity.id) === Number(entityId));
      if (typeAheadDefault && filteredEntity && filteredEntity.length > 0) {
         // While filtering if title and name is same reset it
         if (isFilter) {
            const { title, id } = filteredEntity[0];
            const { name } = typeAheadDefault;
            if (name === title) {
               resetFilter();
            }
         } else if (entityFilterId === 0) {
            resetFilter();
         } else {
            // Setting the form values
            setEntityFilter(filteredEntity[0]);
            if (onItemChange) {
               onItemChange(filteredEntity[0]);
            }
         }
      } else {
         if (isFilter) {
            if (entityId === 0) {
               if ((entityFilterId as number) > 0 || entityFilterId === -1) {
                  resetFilter(-1);
               }
            } else {
               resetFilter();
            }
         } else {
            if (entityFilterId === 0 && entityId === 0) {
               resetFilter();
            } else if (dataList && dataList?.length > 0) {
               setEntityFilter(dataList[0]);
               if (onItemChange) {
                  onItemChange(dataList[0]);
               }
            } else {
               resetFilter();
            }
         }
      }
   }, [entityFilterId]);

   const filterEntity = (entityFilterId: number) => (entity: RowData) =>
      entityFilter && Number(entity[entityFilter]) === Number(entityFilterId);

   const getDataOptions = (): { name: string; value: string }[] => {
      // If form then entityFilterId should be valid
      if (!isFilter && entityFilterId === 0) {
         return [];
      }

      let entityList = data;
      if (entityFilter && entityFilterId && entityFilterId !== 0) {
         entityList = entityList?.filter(filterEntity(entityFilterId));
      }
      return entityList?.map(({ title, id }) => ({ name: title, value: id.toString() })) ?? [];
   };

   const getData = (): FetchEntityResponse => {
      let entityList = data;
      if (entityFilter && entityFilterId && entityFilterId !== 0) {
         entityList = entityList?.filter(filterEntity(entityFilterId));
      }
      return entityList ?? [];
   };

   const getTitle = (id: number) => {
      const dataList = getData();
      let filteredEntity = dataList?.filter((entity) => Number(entity.id) === id);
      if (filteredEntity && filteredEntity.length > 0) {
         const { title, id } = filteredEntity[0];
         return title;
      }
      return '';
   };

   const getEntityError = (): string => {
      const { id, hasChanged } = entityState;
      let hasErrors: boolean = false;
      if (isSave && isRequired && !isFilter) {
         if (id === 0 && hasChanged === true) {
            hasErrors = true;
         } else if (!entityId || entityId === 0) {
            hasErrors = true;
         }
      }
      return hasErrors === true ? `${label[0].toUpperCase() + label.slice(1)} cannot be empty` : '';
   };

   return (
      <>
         <TypeAheadSelectInput
            defaultIsName={true}
            defaultValue={typeAheadDefault}
            isLoading={isLoading}
            isError={isError}
            isSuccess={isSuccess}
            error={getEntityError()}
            isRequired={isRequired}
            width={width}
            options={getDataOptions()}
            label={label}
            placeholder={'Select...'}
            onChange={(id) => {
               if (id != '') {
                  const name = getTitle(Number(id));
                  setEntityFilter({ id: Number(id), title: name });
                  if (onItemChange) {
                     const items = getData();
                     const item = items.filter((item) => item.id === Number(id))[0];
                     onItemChange(item);
                  }
               } else {
                  resetFilter();
                  if (onItemChange) {
                     onItemChange(undefined);
                  }
               }
            }}
         />
      </>
   );
};

export const EntityTypeAhead = memo(TypeAheadEntity);
