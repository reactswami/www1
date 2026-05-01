/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// NOTE: This file was manually tweaked after generation to add the layout route and rearrange the
// route tree.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as DirectoryAdIndexImport } from './routes/directory/ad/index'
import { Route as DirectoryAdEditImport } from './routes/directory/ad/edit'
import { Route as DirectoryAdDeleteImport } from './routes/directory/ad/delete'
import { Route as DirectoryAdCopyImport } from './routes/directory/ad/copy'
import { Route as DirectoryAdAddImport } from './routes/directory/ad/add'
import { Route as DirectoryAdlayoutImport } from './routes/directory/ad/__layout'
import { Route as DirectorySyncHistoryImport } from './routes/user_dir_sync_history'
import { Route as DirectoryViewSyncChangesImport } from './routes/user_dir_sync_history.$id'
import { Route as DirectoryAdSyncExecuteImport } from './routes/user_sync_execute'

// Create Virtual Routes

const DirectoryAdImport = createFileRoute('/directory/ad')()

// Create/Update Routes

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const SyncHistoryRoute = DirectorySyncHistoryImport.update({
  path: '/user_dir_sync_history',
  getParentRoute: () => rootRoute,
} as any)

const SyncAdExecuteRoute = DirectoryAdSyncExecuteImport.update({
  path: '/user_sync_execute',
  getParentRoute: () => rootRoute,
} as any)


const ViewSyncChangesRoute = DirectoryViewSyncChangesImport.update({
  path: '/user_dir_sync_history/$id',
  getParentRoute: () => rootRoute,
} as any)

const DirectoryAdRoute = DirectoryAdImport.update({
  path: '/directory/ad',
  getParentRoute: () => rootRoute,
} as any)


const LayoutRoute = DirectoryAdlayoutImport.update({
  id: '/directory/ad/__layout',
  getParentRoute: () => DirectoryAdRoute,
} as any)

const DirectoryAdIndexRoute = DirectoryAdIndexImport.update({
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any)

const DirectoryAdEditRoute = DirectoryAdEditImport.update({
  path: '/edit/$id',
  getParentRoute: () => LayoutRoute,
} as any)

const DirectoryAdDeleteRoute = DirectoryAdDeleteImport.update({
  path: '/delete',
  getParentRoute: () => LayoutRoute,
} as any)

const DirectoryAdCopyRoute = DirectoryAdCopyImport.update({
  path: '/copy/$id',
  getParentRoute: () => LayoutRoute,
} as any)

const DirectoryAdAddRoute = DirectoryAdAddImport.update({
  path: '/add',
  getParentRoute: () => LayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/user_dir_sync_history': {
      preLoaderRoute: typeof DirectorySyncHistoryImport
      parentRoute: typeof rootRoute
    }
    '/user_dir_sync_history/$id': {
      preLoaderRoute: typeof DirectoryViewSyncChangesImport
      parentRoute: typeof rootRoute
    }
    '/user_sync_execute': {
      preLoaderRoute: typeof DirectoryAdSyncExecuteImport
      parentRoute: typeof rootRoute
    }
    '/directory/ad': {
      preLoaderRoute: typeof DirectoryAdImport
      parentRoute: typeof rootRoute
    }
    '/directory/ad/__layout': {
      preLoaderRoute: typeof DirectoryAdlayoutImport
      parentRoute: typeof DirectoryAdRoute
    }
    '/directory/ad/add': {
      preLoaderRoute: typeof DirectoryAdAddImport
      parentRoute: typeof DirectoryAdlayoutImport
    }
    '/directory/ad/copy/$id': {
      preLoaderRoute: typeof DirectoryAdCopyImport
      parentRoute: typeof DirectoryAdlayoutImport
    }
    '/directory/ad/delete': {
      preLoaderRoute: typeof DirectoryAdDeleteImport
      parentRoute: typeof DirectoryAdlayoutImport
    }
    '/directory/ad/edit/$id': {
      preLoaderRoute: typeof DirectoryAdEditImport
      parentRoute: typeof DirectoryAdlayoutImport
    }
    '/directory/ad/': {
      preLoaderRoute: typeof DirectoryAdIndexImport
      parentRoute: typeof DirectoryAdlayoutImport
    }
  }
}

// Create and export the route tree


export const routeTree = rootRoute.addChildren([
  IndexRoute,
  SyncHistoryRoute,
  SyncAdExecuteRoute,
  ViewSyncChangesRoute,
  DirectoryAdRoute.addChildren([
    LayoutRoute.addChildren([
      DirectoryAdAddRoute,
      DirectoryAdCopyRoute,
      DirectoryAdDeleteRoute,
      DirectoryAdEditRoute,
      DirectoryAdIndexRoute,
    ]),
  ]),
])


/* prettier-ignore-end */
