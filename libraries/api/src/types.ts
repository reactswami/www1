export interface APIQuery<T, U> {
   user: string;
   command: Command;
   objects: APIObject<T, U>[];
   filter?: string;
}

export enum Command {
   Get = 'get',
   Update = 'update',
   Add = 'add',
}

export interface Options {
   defaultGetQueryLimit: number;
}

export type APIObject<Type, DataStructure> = {
   type: Type;
   limit?: number;
   fields?: Field<DataStructure>;
   filter?: string;
   data?: Partial<DataStructure>[];
};

export type Field<DataStructure> =
   | Record<never, string>
   | { [key in keyof DataStructure]: { filter: { query: string } } };

export type BaseDataStructure = { id: number };

export enum LogicalOperator {
   And = 'AND',
   Or = 'OR',
}

type FilterQuery = string;

export type FieldFilter<DataStructure> = {
   field: Field<DataStructure>;
   query: FilterQuery;
   operator: LogicalOperator;
};
