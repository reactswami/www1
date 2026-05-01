export function formatSortParam(propertyName: string): string {
   const dotIndex = propertyName.indexOf('.');
   return dotIndex !== -1 ? propertyName.substring(0, dotIndex) : propertyName;
}
