import { type UseToastOptions } from '@chakra-ui/react';

type ToastOptions = (...arg: any) => Pick<UseToastOptions, 'status'>;
type ToastMessage = Record<'error' | 'success', ToastOptions> &
   Record<string, ToastOptions>;
type ToastNotification = ToastMessage | ((...arg: any) => ToastMessage);

const makeErrorMessage = (arg?: string, serverErrorMessage  = '')  => {
   let message = serverErrorMessage;
   if (serverErrorMessage === 'undefined'){
      message =''; // Sometimes, the message returned seemed to be stringified
   }
   return `An error has occurred ${arg}. If the problem persists, contact the support team. ${message}`;
};

const ASSIGN_SERVICES: ToastNotification = {
   error: (message?: string) => ({
      status: 'error',
      title: 'Error',
      description: makeErrorMessage('while updating the services', message),
   }),
   success: () => ({
      status: 'success',
      title: 'Success',
      description: 'Services successfully assigned to Observability Appliance. It can take up to a minute for the changes to appear in the list.',
   }),
};

const FETCH_OA_SERVICES: ToastNotification = {
   error: (name: string, message = '' ) => ({
      status: 'error',
      title: 'Error',
      description: makeErrorMessage(
         `while retrieving the list of sevices for ${name}`,
         message
      ),
   }),
   success: () => ({
      status: 'success',
      title: '_',
      description: '_',
   }),
};

const CREATE_OA: ToastNotification = {
   success: () => ({
      status: 'success',
      title: 'Observability Appliance created',
      description: 'The Observability Appliance has been successfully created. It can take up to a minute to appear in the list.',
   }),
   error: (message?: string) => ({
      title: 'Error',
      description: makeErrorMessage('while creating the Observability Appliance',
         message),
      status: 'error',
   }),
};

const DELETE_OA: ToastNotification = {
   success: (name: string) => ({
      title: 'Observability Appliance deleted',
      description: `${name} has been successfully deleted.`,
      status: 'success',
   }),
   error: (name: string, message?: string) => ({
      title: 'Error',
      description: makeErrorMessage(`when trying to delete ${name}`,
         message),
      status: 'error',
   }),
};

const REBOOT_OA: ToastNotification = {
   success: () => ({
      status: 'success',
      title: 'Observability Appliance rebooting',
      description:
         'The command has been successfully received by the server. It may take up a to a few minutes for the Observability Appliance to complete the reboot procedure.',
      duration: 9000,
      isClosable: true,
   }),
   error: (name: string, message?: string) => ({
      title: 'Error',
      description: makeErrorMessage(`when trying to reboot ${name}`,
         message),
      status: 'error',
      duration: 9000,
      isClosable: true,
   }),
   initial: (name: string) => ({
      isClosable: false,
      duration: null,
      description: `Sending a request to reboot ${name}`,
      status: 'info',
   }),
};

const ENABLE_DISABLE_OA: ToastNotification = {
   success: (name: string, shouldEnable: boolean) => ({
      title: 'Success',
      description: `${name} has been ${
         shouldEnable ? 'enabled' : 'disabled'
      }.`,
      status: 'success',
   }),
   error: (shouldEnable: boolean, message?: string) => ({
      title: 'Error',
      description: makeErrorMessage(
         `when trying to ${shouldEnable ? 'enable' : 'disable'} your Observability Appliance`,
         message
      ),
      status: 'error',
   }),
};

const UPDATE_OA: ToastNotification = {
   success: (name: string) => ({
      title: `${name} updated`,
      description: `${name} has been successfully updated`,
      status: 'success',
   }),
   error: (name: string, message?: string) => ({
      title: 'Error',
      description: makeErrorMessage(`when updating ${name}`,
         message),
      status: 'error',
   }),
};

export const toastMessages = {
   assignServices: ASSIGN_SERVICES,
   fetchOaServices: FETCH_OA_SERVICES,
   createOa: CREATE_OA,
   deleteOa: DELETE_OA,
   updateOa: UPDATE_OA,
   toggleOa: ENABLE_DISABLE_OA,
   rebootOa: REBOOT_OA,
};
