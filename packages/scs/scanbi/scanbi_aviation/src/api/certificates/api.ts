import { environment } from '~/config';
import { axios } from '~/lib';
import { ENTITY_TYPE, MODE } from '~/utils';

const { endpoints } = environment;

export const uploadCertifcates = async (formData: { client_cert: string; client_key: string }) => {
   const formDataT = new FormData();
   formDataT.append('client_cert', formData.client_cert[0]);
   formDataT.append('client_key', formData.client_key[0]);
   return axios.post(
      `${endpoints.entityOperations}?mode=${MODE.UPDATE}&entity_type=${ENTITY_TYPE.CERTIFICATES}`,
      formDataT,
      {
         headers: { 'Content-Type': 'multipart/form-data' },
      }
   );
};
