import { Alert } from '@statseeker/components/Feedback/Alert';
import { Spinner } from '@statseeker/components/Feedback/Spinner';
import { AdminLayout } from '@statseeker/components/Layout/AdminLayout';
import { AdminPage } from '@statseeker/components/Layout/AdminPage';
import { useToast } from '@statseeker/hooks/useToast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { addLicense, cancelUpgrade, downloadLicense } from '~/api';
import { LicenseActions, LicenseContent, LicenseUpdateModal } from '~/components';
import { licenseQueryOptions, queryKeys } from '~/lib';
import { licenseStatus } from '~/utils';
import './-styles/index.css';

export const LicensePage = () => {
   const licenseQuery = useQuery(licenseQueryOptions.get());
   const toast = useToast();

   const license = licenseQuery.data;
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

   const cancelUpgradeMutation = useMutation({
      mutationKey: queryKeys.cancelUpgrade,
      mutationFn: cancelUpgrade,
   });

   const onCancel = async () => {
      setLoading(true);
      cancelUpgradeMutation.mutate(
         { csrf_token: license?.result?.csrf_token, version: license?.result?.version },
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
               window.location.replace('/cgi/base-web-ssadmin-wrapper?mode=display&option=upgrade');
            },
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
            server_id: server_id,
            hardware_id: license.result.hardware_id,
            device_count: license.result.device_count,
            port_count: license.result.port_count,
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
               onUpload(data.key);
            },
         }
      );
   };

   const onUpload = (key: string) => {
      if (!key) {
         toast({
            title: 'Error',
            description: 'Unable to apply license. Missing server ID or key.',
            status: 'error',
         });
         return;
      }
      setLoading(true);
      uploadLicenseMutation.mutate(
         { key },
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
               window.location.replace('/cgi/base-web-ssadmin-wrapper?mode=edit&option=upgrade');
            },
         }
      );
   };

   return (
      <AdminLayout title="License Upgrade">
         {!licenseQuery.isFetching && (
            <Alert variant={status.status} description={status.message} />
         )}
         <AdminPage className="licensePage">
            {licenseQuery.isFetching ? (
               <Spinner centered size="lg" />
            ) : (
               <LicenseContent
                  heading="License Metadata"
                  license={license}
                  actions={
                     <LicenseActions
                        onUpload={() => setUpdateModalMode('upload')}
                        onDownload={() => setUpdateModalMode('download')}
                        onCancel={() => onCancel()}
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
               onClose={() => setUpdateModalMode(undefined)}
               isLoading={isLoading}
               license={license}
            />
         )}
      </AdminLayout>
   );
};

export const Route = createFileRoute('/')({
   component: () => <LicensePage />,
});
