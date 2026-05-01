# Package: discovery/ip-ranges

### Local Development

To run the package in local development mode, run the following command from the `www` directory:
`npx nx vite:serve discovery-ip-ranges`

Note that when adding new Routes to the package you will need to run the following command from the
root directory of your package (1 level above `src`) to generate the routeTree for Tanstack Router:
`npx tsr generate`
Alternatively you can run `npx tsr watch` which will remain running and update the routeTree
automatically with any new or modified routes.
