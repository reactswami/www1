export type Row = {
   key: string;
   element: HTMLElement;
   select: () => void;
   isSelected: boolean;
   isDisabled: boolean;
   isFocused: boolean;
};

export type Data = {
   id: number;
   key: string;
   values: string[];
   classes?: string[];
   isSelected: boolean;
   isDisabled: boolean;
   isFocused: boolean;
};
export type Field = {
   id: number;
   name: string;
   title: string;
   sort?: 'asc' | 'desc' | null;
};
export type CallBackArgs = {
   selected: Data[];
   data: Data[];
   fields: Field[];
   isAllSelected: boolean;
   currentPage: number;
};

export type Counts = {
   total: number;
   visible: number;
   selected: number;
   pages: {
      currentPage: number;
      lastPage: number;
   };
};

export type FetchDataArgs = {
   range: { start: number; end: number | null };
   sort: { field: Field; order: 'asc' | 'desc' } | null;
};

export type Options = {
   onUpdateFn: ({
      selected,
      data,
      fields,
      isAllSelected,
   }: CallBackArgs) => void;
   onSelectFn: ({ selected, data, fields }: CallBackArgs) => void;
   onErrorFn: (error: string) => void;
   onSortFn: (
      column: NonNullable<Field>,
      currentData: Data[],
      nextSort: 'asc' | 'desc'
   ) => Promise<Data[]>;
   fetchFn: ({ range, sort }: FetchDataArgs) => Promise<Data[]>;
   selectionMode: 'multi' | 'single' | 'view';
   dataMode: 'append' | 'pagination';
   resultsPerPage: number;
};

// Classes interfaces
export interface SelectTableBodyArgs {
   data: Data[];
   onMouseDown: (e: MouseEvent, row: Data) => void;
   onMouseMove: (e: MouseEvent, row: Data) => void;
   onFocus: (rowId: number) => void;
   mode: 'multi' | 'single' | 'view';
}
export interface ITableBody {
   element: HTMLElement;
   render: (data: Data[]) => void;
}
export interface SelectTableHeaderArgs {
   columns: Field[];
   toggleSelectAll: () => void;
   toggleSort: (fieldId: number) => void;
   mode: 'multi' | 'single' | 'view';
}
export interface ITableHeader {
   render(fields: Field[], isAllSelected: boolean): void;
   element: HTMLElement;
}

export interface ITableFooter {
   element: HTMLElement;
   render: ({ data, total }: { data: Data[]; total: number }) => void;
}

export interface ISelector {
   onMouseMove: (e: MouseEvent, row: Data) => void;
   onMouseDown: (e: MouseEvent, row: Data) => void;
   onKeyDown: (e: KeyboardEvent, row: Data | null) => void;
}

export interface SelectorConstructorArgs {
   getNextRowNotDisabled: ({
      direction,
      index,
   }: {
      direction: 'up' | 'down';
      index: number;
   }) => Data | undefined;
   selectRows: (rowsToSelect: number[]) => void;
   getSelected: () => number[];
   getCounts: () => {
      visible: number;
      total: number;
      selected: number;
   };
   setFocus: (rowId: number | null) => void;
   getFocus: () => number | null;
}
