import SelectTable from '../index';
import { type Data, type Field, type Options } from '../types';


type LegacyOptions = {
   cgi: string; // CGI to use in the this.load() method
   cgi_params: any; // CGI parameters to use in the this.load() method
   disabled: boolean; // Enable or disable the table
   keep_selection: boolean; // Whether to keep list selection between reloads
   update_fn: () => void; // Run function every time the table updates
   error_fn: (error: string) => void;
};

type LegacyParams = {
   sort_field: string; // Field to sort
   sort_asc: boolean; // Boolean whether sort is ascending or descending
   offset: number; // Current offset
};

/**
 * The legacyAdapter is an adapter that allow us to use SelectTable v2 in our previously built pages.
 * It should not be used in the future. Use the SelectTable API directly.
 *
 * @param elem_id
 * @param data
 * @param total
 * @param fields
 * @param opts
 */
export function legacyAdapter(
   elem_id: string,
   data: (Data & { value: string[] })[],
   total: number,
   fields: Field[],
   opts: LegacyOptions
) {
   if (fields.length < 0) {
      throw new Error('provide fields.');
   }
   const containerElement = document.getElementById(elem_id);
   if (!containerElement) {
      throw new Error(`failure to find the element with id ${elem_id}`);
   }

   const options = mapLegacyOptionsToOptions(opts, fields[0].name);
   const formattedData = data.map((item) => ({ ...item, values: item.value }));

   return new SelectTable({
      containerElement,
      data: formattedData,
      total,
      fields,
      options,
   });
}

function legacyFetch(cgi: string, params: LegacyParams) {
   return post_ajax(cgi, params);
}

/**
 * A helper function to map the legacy options to the new SelectTable API.
 *
 * @param opts
 * @param defaultSortField
 */
function mapLegacyOptionsToOptions(
   opts: LegacyOptions,
   defaultSortField: string
): Partial<Options> {
   const { error_fn, update_fn } = opts;
   const options: Partial<Options> = {
      fetchFn: function ({
         range,
         sort,
      }: {
         range: { start: number; end: number | null };
         sort: { field: Field; order: 'asc' | 'desc' } | null;
      }): Promise<Data[]> {
         return legacyFetch(opts.cgi, {
            offset: range.start,
            sort_field: sort?.field.name ?? defaultSortField,
            sort_asc: sort?.order === 'asc',
         });
      },
      selectionMode: 'multi',
      dataMode: opts.keep_selection ? 'append' : 'pagination',
      resultsPerPage: 1000,
   };

   if (error_fn) {
      options.onErrorFn = error_fn;
   }
   if (update_fn) {
      options.onUpdateFn = update_fn;
   }

   return options;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function post_ajax(cgi: string, params: LegacyParams): Promise<Data[]> {
   return new Promise((_, rej) => {
      rej(new Error('Function not implemented.'));
   });
}
