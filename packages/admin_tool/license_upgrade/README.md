# Package: admin_tool/license_upgrade

This app serves the License Upgrade page of the admin tool. This is where
users view and update their license in Statseeker.

### Local Development

To run the package in local development mode, run the following command from the `www` directory:
`npx nx vite:serve license_upgrade`

To build the packge, run the following command from the `www` directory:
`npx nx build license_upgrade`

You also should run the following to generate the mockServiceWorker.js file for this pacakge from
the `www` directory:
`npx msw init packages/admin_tool/license_upgrade/public`
Select 'No' when asked to save this to the package.json

Note that when adding new Routes to the package you will need to run the following command from the
root directory of your package (1 level above `src`) to generate the routeTree for Tanstack Router:
`npx tsr generate`
Alternatively you can run `npx tsr watch` which will remain running and update the routeTree
automatically with any new or modified routes.

ADD TESTING COMMANDS!!
