/*
 * All software Copyright 2024 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */
import { type IpRange } from '@statseeker/api/internal_api/entities';
import axios, { type AxiosResponse } from 'axios';
import { type ImportRangesFromFileFormData } from './types';


async function getRangesFromImportFile(formData: ImportRangesFromFileFormData) {
   const formDataT = new FormData();
   formDataT.append('file', formData.file);
   return axios.post('/cgi/nfc_decoder', formDataT, {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   }) as Promise<AxiosResponse<{result: IpRange}>>;
}


export { getRangesFromImportFile };
