import { environment } from './environments/environment';

export type Format = typeof FORMATS;
type ResponseStatus = 'ERROR' | 'Pending' | 'Success';
interface ImageCreatedResponse {
   status: 'Success';
   link: string;
}

const NOT_READY_YET_STATUS_CODE = 202;
const IMAGE_CREATED_CODE = 200;
const POLLING_DELAY_IN_MS = 15000;
const FORMATS = ['img', 'vhd', 'vmdk', 'qcow2'] as const;
const ERROR_CONTAINER = document.getElementById('download_error');
const NAME_PLACEHOLDERS = [
   ...document.querySelectorAll('span.name_placeholder'),
];
const FORMAT_PLACEHOLDER = document.querySelector('span.format_placeholder');
const BUTTONS_CONTAINER = document.getElementById('download_buttons_container');
const BUTTONS_INNER_CONTAINER = document.getElementById('download_buttons');
const DOWNLOAD_MESSAGE_CONTAINER = document.getElementById('download_progress');
const SUCCESS_CONTAINER = document.getElementById('download_success');
const SUCCESS_DOWNLOAD_LINK = document.getElementById(
   'download_success__link'
) as HTMLAnchorElement;
const applianceName = new URLSearchParams(window.location.search).get('name');

function prepareTemplate(): void {
   // If no name are provided in the url, we need to handle the error
   if (!applianceName) {
      handleError(
         'Something went wrong, we could retrieve the name of the appliance.'
      );
   }
   // Populate the name of the appliances
   NAME_PLACEHOLDERS.forEach((placeholder) => {
      placeholder.textContent = applianceName;
   });

   // Create download buttons
   for (const format of FORMATS) {
      const downloadButton = document.createElement('button');
      downloadButton.textContent = `.${format}`;
      downloadButton.onclick = async () => {
         try {
            await requestImage(applianceName, format);
         } catch (e) {
            handleError(e);
         }
      };
      BUTTONS_INNER_CONTAINER.appendChild(downloadButton);
   }
}

async function requestImage(
   name: string,
   format: Format[number]
): Promise<void> {
   let response: ImageCreatedResponse;

   // Handle the communication with the backend
   try {
      FORMAT_PLACEHOLDER.textContent = format;
      DOWNLOAD_MESSAGE_CONTAINER.classList.remove('hidden');
      BUTTONS_CONTAINER.classList.add('hidden');
      let request = await fetch(
         environment.endpoints.imageRequest(name, format)
      );
      const { message, status } = (await request.json()) as {
         status: ResponseStatus;
         message: string;
      };
      if (status === 'ERROR') {
         throw Error(message);
      }
      response = await pollImageCreationStatus(format);
   } catch (e) {
      throw Error(
         `An error occurred while requesting the creation of an image for ${name} with format ${format}. This could mean that another image is being created. \n${e}`
      );
   }

   // Trigger the download, display the link
   try {
      SUCCESS_CONTAINER.classList.remove('hidden');
      DOWNLOAD_MESSAGE_CONTAINER.classList.add('hidden');
      const { link } = response;
      const anchor = SUCCESS_DOWNLOAD_LINK;
      const fileName = link.replace(/^\/?.*?\//, ''); // Assuming link is /images/oa-name-ss-5.6.0-24241234.img.xyz
      anchor.href = link;
      anchor.download = fileName;
      anchor.textContent = fileName;
      anchor.click();
   } catch (e) {
      throw Error(
         `An error occurred when creating a link to your image, if the problem persists, contact the Statseeker support team.\n ${e}`
      );
   }
}

// Polling the endpoint 'is it created yet'
async function pollImageCreationStatus(format: Format[number]): Promise<ImageCreatedResponse> {
   const response = await fetch(
      environment.endpoints.isImageReady(applianceName, format)
   );
   if (response.status === NOT_READY_YET_STATUS_CODE) {
      await new Promise((resolve) => setTimeout(resolve, POLLING_DELAY_IN_MS));
      return await pollImageCreationStatus(format);
   } else if (response.status === IMAGE_CREATED_CODE) {
      const body = await response.json();
      return body;
   } else {
      const errorMessage = await response.json();
      throw Error(errorMessage.message);
   }
}

// Display an error message, remove the ability to download/generate images
function handleError(e: Error | string) {
   ERROR_CONTAINER.classList.remove('hidden');
   ERROR_CONTAINER.textContent = e.toString();
   DOWNLOAD_MESSAGE_CONTAINER.classList.add('hidden');
   BUTTONS_CONTAINER.classList.add('hidden');
   SUCCESS_CONTAINER.classList.add('hidden');
}

// Run the 'main' function
prepareTemplate();
