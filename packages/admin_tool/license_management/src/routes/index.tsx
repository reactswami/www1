import { addLicense } from '@statseeker/api/internal_api/entities/license/api';
import { type APILicense } from '@statseeker/api/internal_api/entities/license/type';
import { Alert } from '@statseeker/components/Feedback/Alert';
import { Spinner } from '@statseeker/components/Feedback/Spinner';
import { AdminLayout } from '@statseeker/components/Layout/AdminLayout';
import { AdminPage } from '@statseeker/components/Layout/AdminPage';
import { useToast } from '@statseeker/hooks/useToast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { downloadLicense } from '~/api';
import { LicenseActions, LicenseContent, LicenseUpdateModal } from '~/components';
import { licenseQueryOptions, queryClient, queryKeys } from '~/lib';
import { licenseStatus } from '~/utils';
import './-styles/index.css';

export const LicensePage = () => {
   const isChildFrame = window.self !== window.top;
   const licenseQuery = useQuery(licenseQueryOptions.get());
   const [newLicense, setNewLicense] = useState<APILicense>();
   const [newKey, setNewKey] = useState<string>();
   const toast = useToast();

   const license = licenseQuery.data?.data.length === 1 ? licenseQuery.data.data[0] : undefined;
   const status = licenseStatus(license, licenseQuery.error?.message);
   const [updateModalMode, setUpdateModalMode] = useState<'download' | 'upload'>();
   const [isLoading, setLoading] = useState(false);

   const downloadLicenseMutation = useMutation({
      mutationKey: queryKeys.downloadLicense,
      mutationFn: downloadLicense,
   });

   const uploadLicenseMutation = useMutation({
      mutationKey: queryKeys.uploadLicense,
      mutationFn: addLicense,
   });

   const onClose = () => {
      setUpdateModalMode(undefined);
      setNewKey(undefined);
      setNewLicense(undefined);
   };

   const onUpload = (server_id: string, data: string) => {
      setLoading(true);
      setNewKey(data);
      uploadLicenseMutation.mutate(
         {
            server_id,
            key: data,
            test: true,
         },
         {
            onError: ({ message }) => {
               toast({
                  title: 'Error',
                  description: message,
                  status: 'error',
               });
            },
            onSuccess: (resp) => {
               const newLicense = resp.data[0];
               if (!newLicense.licenced) {
                  toast({
                     title: 'Error',
                     description: 'Provided license is not valid for this server',
                     status: 'error',
                  });
                  return;
               }
               setNewLicense(newLicense);
            },
            onSettled: () => setLoading(false),
         }
      );
   };

   const onDownload = async (server_id: string) => {
      if (!license) {
         toast({
            title: 'Error',
            description: 'Unable to download license due to missing hardware ID',
            status: 'error',
         });
         return;
      }
      setLoading(true);
      downloadLicenseMutation.mutate(
         {
            version: license.version,
            server_id: server_id,
            hardware_id: license.hardware_id,
            device_count: license.features
               .find((f) => f.name === 'ping')
               ?.limits.find((l) => l.name === 'device')?.total,
            port_count: license.features
               .find((f) => f.name === 'snmp')
               ?.limits.find((l) => l.name === 'port')?.total,
         },
         {
            onError: ({ message }) => {
               toast({
                  title: 'Error',
                  description: message,
                  status: 'error',
               });
               setLoading(false);
            },
            onSuccess: (data) => {
               onUpload(data.server_id, data.key);
            },
         }
      );
   };

   const onApply = () => {
      if (!newLicense?.server_id || !newKey) {
         toast({
            title: 'Error',
            description: 'Unable to apply license. Missing server ID or key.',
            status: 'error',
         });
         return;
      }
      setLoading(true);
      uploadLicenseMutation.mutate(
         {
            server_id: newLicense?.server_id,
            key: newKey,
         },
         {
            onError: ({ message }) => {
               toast({
                  title: 'Error',
                  description: message,
                  status: 'error',
               });
               setLoading(false);
            },
            onSuccess: () => {
               if (isChildFrame) {
                  onClose();
                  queryClient.invalidateQueries();
                  setLoading(false);
               } else {
                  window.location.replace('/');
               }
            },
         }
      );
   };

   return (
      <>
         {!isChildFrame && (
            <div id="app-bar" style={{ position: 'initial', display: 'flex' }}>
               <a className="logo" href="#" title="Home">
                  <img alt="Statseeker Logo" aria-hidden="true" src="/img/logo_light.svg" />
               </a>
            </div>
         )}
         <AdminLayout title="License Management">
            {!licenseQuery.isFetching && (
               <Alert variant={status.status} description={status.message} />
            )}
            <AdminPage className="licensePage">
               {licenseQuery.isFetching ? (
                  <Spinner centered size="lg" />
               ) : (
                  <LicenseContent
                     heading="Current License"
                     license={license}
                     actions={
                        <LicenseActions
                           onUpload={() => setUpdateModalMode('upload')}
                           onDownload={() => setUpdateModalMode('download')}
                           isLoading={isLoading}
                        />
                     }
                  />
               )}
            </AdminPage>
            {updateModalMode && (
               <LicenseUpdateModal
                  mode={updateModalMode}
                  onUpload={onUpload}
                  onDownload={onDownload}
                  onApply={onApply}
                  onClose={onClose}
                  currentLicense={license}
                  newLicense={newLicense}
                  isLoading={isLoading}
               />
            )}
         </AdminLayout>
      </>
   );
};

export const Route = createFileRoute('/')({
   component: () => <LicensePage />,
});
