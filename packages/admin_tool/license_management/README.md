# Package: admin_tool/license_management

This app serves the License Management page of the admin tool. This is where
users view and update their license in Statseeker.

### Local Development

To run the package in local development mode, run the following command from the `www` directory:
`npx nx vite:serve admin_tool-license_management`

To build the packge, run the following command from the `www` directory:
`npx nx build admin_tool-license_management`

To run the unit tests for the packge, run the following command from the `www` directory:
`npx nx run admin_tool-license_management:test`

You also should run the following to generate the mockServiceWorker.js file for this pacakge from
the `www` directory:
`npx msw init packages/admin_tool/license_management/src/public`
Select 'No' when asked to save this to the package.json

Note that when adding new Routes to the package you will need to run the following command from the
root directory of your package (1 level above `src`) to generate the routeTree for Tanstack Router:
`npx tsr generate`
Alternatively you can run `npx tsr watch` which will remain running and update the routeTree
automatically with any new or modified routes.
