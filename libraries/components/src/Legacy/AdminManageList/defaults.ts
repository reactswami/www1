import { type AdminManageListButtonDef } from "./types";


/**
 * Add button, navigates to `/add` and clears `selectedIds` from search.
 */
export function getAddButtonDef(routeId: string): AdminManageListButtonDef {
   return {
      text: 'Add',
      linkProps: {
         from: routeId,
         to: '/add' as any,
         search: (prev: any) => ({ ...prev, selectedIds: undefined }),
      },
   };
};


/**
 * Delete button, navigates to `/delete` and is disabled if there are no `selectedIds` from search.
 */
export function getDeleteButtonDef(routeId: string, selectedIds: number[] | undefined): AdminManageListButtonDef {
   return {
      text: 'Delete',
      linkProps: {
         from: routeId,
         to: '/delete' as any,
         search: (prev: any) => ({ ...prev, id: selectedIds ?? [] }),
      },
      buttonProps: {
         isDisabled: (selectedIds === undefined || selectedIds?.length === 0),
      },
   };
};


/**
 * Copy button, navigates to `/copy/$id`, puts `selectedIds` from search into `$id`, and is disabled if there isn't exactly one `selectedIds` in search.
 */
export function getCopyButtonDef(routeId: string, selectedIds: number[] | undefined): AdminManageListButtonDef {
   return {
      text: 'Copy',
      linkProps: {
         from: routeId,
         to: '/copy/$id' as any,
         params: { id: selectedIds ? selectedIds[0] : -1 },
         search: (prev: any) => ({ ...prev, selectedIds: undefined }),
      },
      buttonProps: {
         isDisabled: selectedIds?.length !== 1,
      },
   };
};
