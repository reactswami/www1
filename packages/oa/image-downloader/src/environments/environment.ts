import { type Format } from '../main';

export const environment = {
   endpoints: {
      imageRequest: (name: string, format: Format[number]) =>
         `/cgi/manage_oa?mode=create_image&name=${name}&format=${format}`,
      isImageReady: (name: string, format: Format[number]) =>
         `/cgi/manage_oa?mode=check_image&name=${name}&format=${format}`,
   },
};
