import {ID} from './formIds';

export function addFormSubmissionEventListener() {
   document.getElementById(ID.FORM).addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit();
   });
}

function handleFormSubmit() {
   clearErrorMessage();
   saveForm();
}

function saveForm() {
   const url = window.location.pathname;
   const params = formatFormData();
   params.append('action', 'save');
   return callCGI(url, params);
}

function formatFormData() {
   const params = new URLSearchParams();
   const form = document.getElementById(ID.FORM);

   const formValues = Object.values(form).reduce((object, { name, value }) => {
      object[name] = value;
      return object;
   }, {});
   Object.entries(formValues).map(([label, value]) =>
      params.append(label, value)
   );
   return params;
}

function callCGI(url, params) {
   fetch(url, {
      method: 'post',
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
   })
      .then((response) => {
         if (!response.ok) {
            throw Error(response.statusText);
         }
         window.close();
         return response;
      })
      .catch(() => {
         displayErrorMessage('Something went wrong. Please try again later.');
         return false;
      });
}

function getErrorMessageContainer() {
   const container = document.getElementById(ID.ERROR_CONTAINER);
   return container;
}

function displayErrorMessage(errorMessage) {
   const container = getErrorMessageContainer();
   container.classList.remove('hidden');
   const message = document.createElement('span');
   message.textContent = errorMessage;
   container.appendChild(message);
   message.id = ID.ERROR_MESSAGE;
}

function clearErrorMessage() {
   const container = getErrorMessageContainer();
   container.classList.add('hidden');
   const message = document.getElementById(ID.ERROR_MESSAGE);
   message && message.remove();
}


