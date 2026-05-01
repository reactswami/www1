/*
 * All software Copyright 2024 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */
import { type ManualConfig } from '@statseeker/api/internal_api/entities';
import axios, { type AxiosResponse } from 'axios';
import { type ManualConfigError } from '~/types';

async function getManualConfigsFromImportFile(formData: { file: string }) {
   const formDataT = new FormData();
   formDataT.append('file', formData.file);
   return axios.post('/cgi/discover_manual_cfg_decoder', formDataT, {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   }) as Promise<
      AxiosResponse<
         { success: "true"; result: ManualConfig[] } | { success: "false"; result: ManualConfigError[] }
      >
   >;
}

export { getManualConfigsFromImportFile };
