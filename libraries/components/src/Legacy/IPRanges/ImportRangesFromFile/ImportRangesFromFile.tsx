import { Button } from '@chakra-ui/react';
import { type IpRange } from '@statseeker/api/internal_api/entities/ip_range_config';
import ImportRangesFromFileModal from './ImportRangesFromFileModal';
import useImportRangesFromFile from './useImportRangesFromFile';

export type ImportRangesFromFileProps = {
   onImport: (importedRanges: IpRange) => void;
};

export const ImportRangesFromFile = ({ onImport }: ImportRangesFromFileProps) => {
   const importRangesProps = useImportRangesFromFile(onImport);
   return (
      <>
         <ImportRangesFromFileModal {...importRangesProps} />
         <Button
            type="button"
            onClick={importRangesProps.ipRangeDisclosure.onOpen}
            alignSelf={'flex-start'}
            variant={'outline'}
            tabIndex={102}
         >
            Import ranges from file
         </Button>
      </>
   );
};
