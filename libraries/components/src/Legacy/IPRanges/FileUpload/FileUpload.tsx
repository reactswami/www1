import { Button, InputGroup, Input } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';

const FileUpload = ({methods, callback}: {methods: UseFormReturn; callback?: (filename: string | null) => any}) => {
   const inputRef = useRef<HTMLInputElement | null>(null);
   const handleClick = () => inputRef.current?.click();
   const { register, control, setValue } = methods;

   return (
      <InputGroup onClick={handleClick} display={'flex'}>
         <Controller
            control={control}
            name={'file'}
            render={({ field: { value, onChange, ...field } }) => {
               return (
                  <Input
                     hidden={true}
                     accept={'text/*'}
                     {...field}
                     value={value?.fileName}
                     onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const files = event?.target?.files;
                        if (files && files.length > 0) {
                           onChange(files[0]);
                           const file = files[0];
                           setValue('file', file);
                           setValue('fileName', file?.name);
                           if (callback) {
                              callback(file.name);
                           }
                        }
                        else if (callback) {
                           callback(null);
                        }
                     }}
                     type="file"
                     id="import_ranges"
                     ref={inputRef}
                  />
               );
            }}
         />
         <Input {...register('fileName')} />
         <Button colorScheme="gray">Upload</Button>
      </InputGroup>
   );
};

export default FileUpload;
