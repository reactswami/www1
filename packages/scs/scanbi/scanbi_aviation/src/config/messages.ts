import { type UseToastOptions } from '@chakra-ui/react';
import { ENTITY_TYPE } from '~/utils/constants';

type ToastOptions = (...arg: any) => Pick<UseToastOptions, 'status'>;
type ToastMessage = Record<'error' | 'success', ToastOptions> & Record<string, ToastOptions>;
type ToastNotification = ToastMessage | ((...arg: any) => ToastMessage);

const makeErrorMessage = (arg?: string, serverErrorMessage = '') => {
   let message = serverErrorMessage;
   if (serverErrorMessage === 'undefined') {
      message = ''; // Sometimes, the message returned seemed to be stringified
   }
   return `An error has occurred ${arg}. If the problem persists, contact the support team. ${message}`;
};

export const deleteWarningMessage = (entityType: string, entityName: string): string => {
   return `This will delete the selected ${entityType}: ${entityName}. This will take a few minutes before the change is reflected in UI`;
};

const FETCH_ENTITY: ToastNotification = {
   error: (name: string, message = '') => ({
      status: 'error',
      title: 'Error',
      description: makeErrorMessage(`while retrieving the list of sevices for ${name}`, message),
   }),
   success: () => ({
      status: 'success',
      title: '_',
      description: '_',
   }),
};

const CREATE_ENTITY: ToastNotification = {
   success: (entityType: string) => ({
      status: 'success',
      title: `${formatEntityType(entityType)} created`,
      description: `The ${formatEntityType(entityType)} has been successfully created.`,
   }),
   error: (entityType: string, message?: string) => ({
      title: 'Error',
      description: makeErrorMessage(`while creating the ${formatEntityType(entityType)}`, message),
      status: 'error',
   }),
};

const DELETE_ENTITY: ToastNotification = {
   success: (entityType: string, name: string) => ({
      title: `${formatEntityType(entityType)} deleted`,
      description: `${name} has been successfully deleted.`,
      status: 'success',
   }),
   error: (name: string, message?: string) => ({
      title: 'Error',
      description: makeErrorMessage(`when trying to delete ${name}`, message),
      status: 'error',
   }),
};

const UPDATE_ENTITY: ToastNotification = {
   success: (name: string) => ({
      title: `${name} updated`,
      description: `${name} has been successfully updated`,
      status: 'success',
   }),
   error: (name: string, message?: string) => ({
      title: 'Error',
      description: makeErrorMessage(`when updating ${name}`, message),
      status: 'error',
   }),
};

function formatEntityType(entityType: string) {
   if (entityType === ENTITY_TYPE.DEVICE_EQUIPMENT) {
      return 'Equipment';
   }

   if (entityType === ENTITY_TYPE.SCREENING_POINT) {
      return 'Screening Point';
   }

   return `${entityType.charAt(0).toUpperCase()}${entityType.slice(1)}`;
}

export const toastMessages = {
   fetchEntity: FETCH_ENTITY,
   createEntity: CREATE_ENTITY,
   deleteEntity: DELETE_ENTITY,
   updateEntity: UPDATE_ENTITY,
};
