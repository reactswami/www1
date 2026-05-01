import { type FilterFn } from '@tanstack/react-table';

export const regexpSearch = (searchValue: string, stringToSearch: string) => {
   try {
      const regexp = new RegExp(searchValue, 'ig');
      return regexp.test(stringToSearch);
   } catch (e) {
      return stringToSearch.toLowerCase().includes(searchValue.toLowerCase());
   }
};

export const regexpFilteFn: FilterFn<any> = (
   row,
   columnId: string,
   filterValue: string
) => {
   return regexpSearch(filterValue, row.getValue(columnId) as string);
};
