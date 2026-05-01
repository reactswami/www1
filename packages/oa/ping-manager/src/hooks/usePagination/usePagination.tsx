import { useState } from 'react';
import { PING_TABLE_PAGE_SIZES } from '~/config/defaults';

export const UsePagination = () => {
   const [offset, setOffset] = useState(0);
   const [pageCount, setPageCount] = useState(0);

   const previousPage = () => setOffset(offset - PING_TABLE_PAGE_SIZES[0]);
   const nextPage = () => setOffset(offset + PING_TABLE_PAGE_SIZES[0]);
   const goToPage = (pageIndex: number) => {
      setOffset(pageIndex * PING_TABLE_PAGE_SIZES[0]);
   };
   const goToLastPage = () =>
      setOffset((pageCount - 1) * PING_TABLE_PAGE_SIZES[0]);
   const goToFirstPage = () => setOffset(0);

   const limit = PING_TABLE_PAGE_SIZES[0];
   const canPreviousPage = offset >= PING_TABLE_PAGE_SIZES[0];
   const canNextPage = offset < PING_TABLE_PAGE_SIZES[0] * (pageCount - 1);
   const currentPage = offset / PING_TABLE_PAGE_SIZES[0] + 1;

   return {
      currentPage,
      canPreviousPage,
      canNextPage,
      goToFirstPage,
      goToLastPage,
      nextPage,
      goToPage,
      limit,
      previousPage,
      setPageCount,
      pageCount,
      offset,
      setOffset,
   };
};
