# SSDataTable

A table that can be used in a view-only mode, single or multi-selection.

## How to use

1. Import the table `import {SSDataTable} from "@statseeker/ssDataTable`
2. Usage looks like ```<SSDataTable<MyRowDataType>
                           rowData={myRowData}
                           columns={myColNamesOrDefs}
                           sortCol={mySortColName}
                           sortDir="asc"
                           rowSelectMode={'checkbox'}
                           onChange={onSelectionChanged}
                           onSort={onSort}
                           emptyMessage="No data found"
                           selectedRows={selectedRowIds}
                           rowIdKey="id"
                        />```
3. Start using it!
