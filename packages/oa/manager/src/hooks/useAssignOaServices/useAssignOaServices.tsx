import { useDisclosure } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { type TableRowData } from '../useFetchOaTableData';
import { fetchOa } from '~/api/fetchOa';
import { type OaComponent, fetchServicesForOa } from '~/api/fetchServicesForOa';
import { type Component, toggleComponentService } from '~/api/updateOa';
import { toastMessages } from '~/config/messages';
import { useToast } from '~/lib';
import { queryKeys } from '~/lib/ReactQuery';

type FormValues = Record<string, boolean>;

interface OAService {
   name: string;
   description: string;
   components: {
      id: string;
      name: string;
      description: string;
      enabled: boolean;
   }[];
}

export type Services = OAService[];

interface Props {
   oaAssign: TableRowData;
}

export const useAssignOaServices = ({ oaAssign }: Props) => {
   const toast = useToast();
   const queryClient = useQueryClient();
   const methods = useForm();
   const { setValue, control, formState: { isDirty } } = methods;

   const { onClose, isOpen, onOpen } = useDisclosure();

   /* Queries */
   const {
      data: oa,
      isLoading: isLoadingOaDetails,
      isError: isErrorOaDetails,
   } = useQuery({
      queryKey: queryKeys.oaDetail(oaAssign?.id),
      queryFn: () => fetchOa({ id: oaAssign?.id }),
      enabled: !!oaAssign
   });

   const {
      data: services,
      isLoading,
      isError,
      isSuccess,
      error,
   } = useQuery({
      queryKey: queryKeys.services(oaAssign?.id),
      queryFn: () => fetchServicesForOa(oa!.id as string),
      initialData: { data: [] },
      enabled: Boolean(oa),
      select: (data) => formatServices(data),
   });

   const pingId = useMemo(() =>
      services?.find(ser => ser.name === 'ping')?.components?.find(comp => comp.name === 'collector')?.id,
      [services]
   );

   const snmpId = useMemo(() =>
      services?.find(ser => ser.name === 'snmp')?.components?.find(comp => comp.name === 'collector')?.id,
      [services]
   );

   const snmpSelect = useWatch({ control, name: snmpId ?? '', disabled: !snmpId });
   const pingSelect = useWatch({ control, name: pingId ?? '', disabled: !pingId });

   // Reset form only once when modal opens
   useEffect(() => {
      if (isSuccess && isOpen) {
         methods.reset(getDefaultsValues(services));
      }

   }, [isSuccess, isOpen, methods, services]);

   // Handle ping/snmp dependency
   useEffect(() => {
      if (!pingId || !snmpId || !isOpen) return;

      setValue(pingId, snmpSelect || pingSelect, {
         shouldDirty: true,
         shouldTouch: true,
         shouldValidate: true
      });

   }, [isDirty, snmpSelect]);

   const disabledServices = useMemo(() =>
      (isOpen && pingId) ? [{ state: Boolean(snmpSelect), id: pingId }] : undefined,
      [snmpSelect, isOpen, pingId]
   );

   useEffect(() => {
      if (isError) {
         toast(toastMessages.fetchOaServices.error(oa?.name, error?.message));
      }
   }, [isError, oa?.name, error?.message, toast]);

   const { mutate: save, isPending: isSaving } = useMutation({
      mutationFn: (components: Component[]) => toggleComponentService(oaAssign?.id, components),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: queryKeys.all });
         queryClient.invalidateQueries({ queryKey: queryKeys.services(oaAssign?.id) });
         onClose();
         toast(toastMessages.assignServices.success());
      },
      onError: (err: AxiosError<any>) => {
         const msg = err.response?.data?.data?.errmsg;
         toast(toastMessages.assignServices.error(msg ? msg : err.message));
      },
   });

   function formatServices(data: { data: OaComponent[] }): Services {
      return Object.values(
         data.data.reduce((services, component) => {
            (services[component.serviceName] ??= {
               name: component.serviceName,
               description: component.serviceDescription,
               components: [],
            }).components.push({
               name: component.name,
               id: component.id.toString(),
               description: component.description,
               enabled: component.enabled === 1,
            });
            return services;
         }, {} as Record<string, OAService>)
      ).sort((a, b) => a.name.localeCompare(b.name));
   }

   const getDefaultsValues = (services: Services) =>
      services.reduce((acc, service) => {
         for (const component of service.components) {
            acc[component.id] = component.enabled;
         }
         return acc;
      }, {} as Record<string, boolean>);

   const onSubmit = (data: FormValues) => {
      const updatedComponents = Object.entries(data).map(([id, enabled]) => ({
         id,
         enabled: (enabled ? 1 : 0) as 0 | 1,
      }));
      save(updatedComponents);
   };

   return {
      isLoading: isLoading || isLoadingOaDetails,
      isError: isError || isErrorOaDetails,
      isSuccess,
      isSaving,
      name: oa?.name || '',
      onSubmit,
      services: services ?? [],
      methods,
      isOpen,
      onOpen,
      onClose,
      disabledServices
   };
};