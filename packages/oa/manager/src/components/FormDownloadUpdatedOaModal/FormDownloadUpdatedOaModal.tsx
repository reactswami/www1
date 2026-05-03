import { SSModal } from '@statseeker/components/Layout/Modal';
import { Text } from '@statseeker/components/Typography/Text';
import { DownloadIcon } from '@statseeker/ui/icons';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '~/lib/ReactQuery';

interface Props {
   isOpen: boolean;
   onClose: () => void;
   newOaName: string;
}

export const FormDownloadUpdatedOaModal = ({ isOpen, onClose, newOaName }: Props) => {
   const queryClient = useQueryClient();

   const handleDownload = () => {
      const newTab = window.open(`/cgi/oa_image_downloader?name=${newOaName}`, '_blank');
      if (newTab) { newTab.focus(); onClose(); }
   };

   return (
      <SSModal
         isOpen={isOpen}
         onClose={onClose}
         isCentered
         closeOnOverlayClick={false}
         title="Observability Appliance Updated"
         contentProps={{ minWidth: 'max-content' }}
         modalProps={{ onCloseComplete: () => queryClient.invalidateQueries({ queryKey: queryKeys.all }) }}
         confirmButton={{ label: 'Download', variant: 'primary', onClick: handleDownload }}
         cancelButton={{ label: 'Close', onClick: onClose }}
      >
         <Text>Your Observability Appliance configuration has been updated.</Text>
         <Text>Please download the new image for deployment.</Text>
      </SSModal>
   );
};
