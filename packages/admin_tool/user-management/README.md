# Package: user-management

This project includes the section of the administration tool that sits under the 'Manage Users'
page. Currently, the existing pages ("Add / Edit Users", "User Authentication") are still legacy CGI
scripts, but the 'User Directory Active Directory' section does live here.

For more information on the Active Directory User Synchronisation feature, see the `README.md` in
`nim/lib/c/api/user_sync/README.md`.

### Local Development

To run the package in local development mode, run the following command from the `www` directory:
`npx nx vite:serve admin_tool-user-management`

**NOTE:** The tanstack route file was manually tweaked. Please use caution if generating the route
file programatically, because it may introduce problems to do with the user sync pages.