import {
   type APIQuery,
   type BaseDataStructure,
   Command,
   type Field,
   type FieldFilter,
   LogicalOperator,
   type Options,
} from './types';

/**
 * @class APIQueryBuilder
 * @classdesc The APIQueryBuilder offers methods to build query for the Statseeker API easily.
 */
export class APIQueryBuilder<DataStructure extends BaseDataStructure, Type = any> {
   queryBuilder: Partial<APIQuery<Type, DataStructure>>;
   type: Type;
   private _options = { defaultGetQueryLimit: 0 };
   private _fieldFilters: FieldFilter<DataStructure>[] = []; // A temporary array where field filters are stored until the build step.

   /**
    * The APIQueryBuilder offers methods to build query for the Statseeker API easily.
    *
    * @param {Type} type The data you wish to query, for example 'cdt_device' or 'user'
    * @param {Options} options an object to define options, such at the default limit for get queries
    */
   constructor(type: Type, options: Partial<Options> = {}) {
      this.queryBuilder = {};
      this.type = type;
      this.options = { ...this.options, ...options };
   }

   get options() {
      return this._options;
   }
   set options(value: Partial<Options>) {
      this._options = { ...this._options, ...value };
   }

   /**
    * Set the user for the current query
    *
    * @param {string} user No validation on the user, ensure that the user name is valid.
    * @returns {APIQueryBuilder}
    * @example new APIQueryBuilder('cdt_device').user('admin)
    */
   user(user: string): this {
      this.queryBuilder = { ...this.queryBuilder, ...{ user } };
      return this;
   }

   /**
    * Update an object, find by id
    *
    * @param id No validation on the id
    * @param updatedObject Pass an updated object. Note that any omitted fields will be 'deleted'.
    * @returns this
    * @example new APIQueryBuilder('user').updateSingleById(2, {...previousUserData, name: 'Harry', surname: 'Potter' })
    */
   updateSingleById(
      id: DataStructure['id'],
      updatedObject: Partial<DataStructure>
   ): this {
      this.queryBuilder = {
         ...this.queryBuilder,
         command: Command.Update,
         objects: [
            {
               type: this.type,
               fields: { id: { filter: { query: `= ${id}` } } },
               data: [updatedObject],
            },
         ],
      };
      return this;
   }

   /**
    * Add one or more objects to the database
    *
    * @param {DataStructure} objects no validation is conducted here, ensure your objects are valid!
    * @returns {this} this
    * @example new APIQueryBuilder('user').add([{name: 'Donald Duck'}, {name: 'Uncle Scrooge'}, {name: 'Daisy Duck'}])
    */
   add(objects: Partial<DataStructure>[]) {
      this.queryBuilder = {
         ...this.queryBuilder,
         command: Command.Add,
         objects: [{ data: objects, type: this.type }],
      };
      return this;
   }

   /**
    * Get query: query object of the type specified.
    *
    * @param {DataStructure []} fields The fields you wish to query (similar to graphQL). You must specify all fields.
    * @param {number} limit The number of data items you wish to query. Default to options.defaultGetQueryLimit
    * @returns {this} this
    * @example new ApiQueryBuilder('user').get(['name', 'type'], 100).build()
    * This query will give you the name and type of the first 100 users.
    */
   get(
      fields: (keyof DataStructure)[],
      limit = this._options.defaultGetQueryLimit
   ) {
      this.queryBuilder = {
         ...this.queryBuilder,
         command: Command.Get,
         objects: [
            {
               type: this.type,
               limit,
               fields: fields.reduce((previous, current) => {
                  return { ...previous, [current]: {} };
               }, {}) as Field<DataStructure>,
            },
         ],
      };
      return this;
   }

   /**
    * Where apply a filter to your query. A previous query must have defined some fields, such as get.
    * This is usually used with get, such as APIQueryBuilder.get(...).where(...)
    * Note that you can apply multiple filters. When chaining `where`, a AND operator is applied. If you wish to use an OR operator, please use `orWhere`
    *
    * @see orWhere
    * @param {keyof DataStructure} field the field you wish to apply filter to
    * @param {string} query the filter to apply in SSSQL
    * @returns {this} return the builder instance
    * @example new ApiQueryBuilder('user').get(['name', 'status', 'age'], 100).where('age', '> 18').where('status', '= "student').build()
    * translate to: give me the first 100 users that are over 18 and student. Give me their name, status and age.
    */

   where(field: keyof DataStructure, query: string) {
      return this._addFieldFilter(field, query, LogicalOperator.And);
   }
   /**
    * Where apply a filter to your query.
    * This is usually used with get, such as APIQueryBuilder.get(...).where(...).orWhere(...)
    *
    * @see where This function is a sister of the where method, except it appends the logical OR operator
    * @param {keyof DataStructure} field the field you wish to apply filter to
    * @param {string} query the filter to apply in SSSQL
    * @returns {this} return the builder instance
    * @example new ApiQueryBuilder('user').get(['name', 'status', 'age'], 100).where('age', '> 18').orWhere('status', '= "student').build()
    * translate to: give me the first 100 users that are over 18 OR student. Give me their name, status and age.
    */
   orWhere(field: keyof DataStructure, query: string) {
      return this._addFieldFilter(field, query, LogicalOperator.Or);
   }

   /**
    * An alias for `where`.
    *
    * @param {keyof DataStructure} field the field you wish to apply filter to
    * @param {string} query the filter to apply in SSSQL
    * @returns {this} return the builder instance
    * @example new ApiQueryBuilder('user').get(['name', 'status', 'age'], 100).where('age', '> 18').where('status', '= "student').build()
    * translate to: give me the first 100 users that are over 18 and student. Give me their name, status and age.
    */
   andWhere(field: keyof DataStructure, query: string) {
      return this._addFieldFilter(field, query, LogicalOperator.And);
   }

   private _addFieldFilter(
      field: string | number | symbol,
      query: string,
      operator: LogicalOperator
   ) {
      if (!this.queryBuilder.objects || this.queryBuilder.objects?.length < 1) {
         throw Error(
            'Error in the where. You need to use the get() build step first.'
         );
      }

      const { fields } = this.queryBuilder.objects[0];

      if (!fields) {
         throw Error('No fields defined in your get method.');
      }

      if (!Object.keys(fields).includes(field.toString())) {
         throw Error(
            `The field (${String(field)}) requested doesn't exist in your query`
         );
      }

      this._fieldFilters.push({
         field,
         query,
         operator,
      });

      return this;
   }

   /**
    * Add a global filter to the API request.
    * Unsafe: no validation is performed on the rawFilter. It is up to the user to write the query as expected by the API
    *
    * @param {string} filterQuery A ssSQL query, see documentation of the API for more information. Fields must be wrapped in brackets ({}).
    * @returns {this} Return the API Query builder. Use `build` to get the built request.
    * @example new APIQueryBuilder('cdt_device').get(['name','ip']).filter("{name}='myName' OR {ip}='10.2.22.2'").build()
    */
   UNSAFE_rawFilter(filterQuery: string): this {
      if (this._fieldFilters.length > 0) {
         throw Error(
            'Usage of both field filter and raw filter is not implemented. Please remove field filters (`where` methods).'
         );
      }

      this.queryBuilder = {
         ...this.queryBuilder,
         objects: [
            {
               ...this.queryBuilder.objects![0],
               filter: filterQuery,
            },
         ],
      };

      return this;
   }

   /**
    * Builds the query, ready to be 'ajaxed'.
    * No validation is done at this stage but in the future we will add validation to it.
    *
    * @returns {APIQuery} Query
    */
   build() {
      const hasFieldFilters = this._fieldFilters.length > 0;
      if (hasFieldFilters) {
         this._populateFieldFilters();
      }

      return this.queryBuilder as APIQuery<Type, DataStructure>;
   }

   /**
    * Build the filter query from the field filters and add it to the query builde
    */
   private _populateFieldFilters() {
      for (const [
         index,
         { field, query, operator },
      ] of this._fieldFilters.entries()) {
         if (index === 0) {
            this.queryBuilder.objects![0].filter = `{${field}} ${query}`;
         } else {
            this.queryBuilder.objects![0]!.filter += ` ${operator} {${field}} ${query}`;
         }
      }
   }
}
