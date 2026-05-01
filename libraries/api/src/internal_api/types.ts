/*
 * All software Copyright 2024 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */

/**
 * @interface ApiObject
 * @description This mimics the C++/Python interface for an API Object. It is
 *              the type that is expected when constructing an ApiGetRequest.
 */
export interface ApiObject {
   /** The name of the object type */
   object_type: string;
   /** The fields to request */
   fields?: (string | ApiField)[];
   /** A context value to help identify the source of this request in logs */
   context?: string;
   /** A list of entity ids to filter */
   id_filter?: number[];
   /** A list of group ids to filter */
   group_id_filter?: number[];
   /** A list of group names to filter */
   group_name_filter?: string[];
   /** A filter to apply to all scalar fields */
   text_filter?: string;
   /** A filter to apply to the request prior to aggregation */
   filter?: string;
   /** A filter to apply to the request after aggregation */
   post_filter?: string;
   /** How NULL values should be sorted */
   sortmode?: 'novals_small' | 'novals_large' | 'novals_before' | 'novals_after';
   /** Maximum number of rows to return */
   limit?: number;
   /** Number of rows to skip */
   offset?: number;
   /** List of field display names to sort the rows */
   sort?: string[];
   /** Whether to sort based on the field order in the request */
   sort_all?: boolean;
   /** List of group by formulas to apply to the request */
   group_by?: string[];
   /** Whether to group by all rows instead of by a particular field */
   group_by_all?: boolean;
   /** Whether to output in single format mode (ie. dont show the format) */
   output_single_format?: boolean;
   /** Custom link definitions to other objects  */
   links?: Record<string, ApiObjectLink>;
}

/**
 * @interface ApiField
 * @description This mimics the C++/Python interface for an API field.
 */
export interface ApiField {
   /** The value to use as the key in the response */
   key?: string;
   /** The internal name of the field (defaults to key) */
   name?: string;
   /** The name of the API object that owns this field */
   object?: string;
   /** Whether to sort decending */
   sort_desc?: boolean;
   /** Time filter query string */
   tf_query?: string;
   /** Time filter favourite name */
   tf_fav?: string;
   /** Time filter timezone */
   tf_timezone?: string;
   /** Time filter interval */
   tf_interval?: number;
   /** The time to use as 'now' in time filter queries */
   tf_now?: number | string;
   /** The format to display time in the response */
   timefmt?: string;
   /** Time value to use in each bucket when displaying time/value pairs */
   valtime?: 'start' | 'mid' | 'end' | 'all';
   /** Aggregation format to use when group_by is provided */
   aggr_format?: string;
   /** Formula to apply to this field */
   formula?: string;
   /** Formula to apply to this field after aggregation */
   post_formula?: string;
   /** Filter to apply to this field */
   filter?: string;
   /** Output precision for floating point values */
   precision?: number;
   /** Link path for this field */
   links?: string[];
   /** Whether to show this field in the response */
   hide?: boolean;
   /** Data format to apply to this field */
   format?: string;
   /** Any custom options to apply to this field */
   options?: Record<string, unknown>;
   /** Whether to include this in the text_filter search or not */
   text_filter_include?: boolean;
}

/**
 * @interface ApiResponse
 * @description This mimics the C++/Python interface for an API response.
 */
export interface ApiResponse<T> {
   /** Whether the command succeeded */
   success: boolean;
   /** The error code if success is false */
   errcode: number;
   /** The error message if success is false */
   errmsg: string;
   /** The time that the server processed the request */
   time: number;
   /** The current sequence number for the object */
   sequence: number;
   /** The total number of rows that matched the request */
   data_total: number;
   /** The rows that matched the request obeying the limit/offset */
   data: T[];
   /** The object returned by the describe command */
   describe?: ApiDescribe;
}

/**
 * @interface ApiDescribeDataFlags
 * @description The flags on the valid data and fields of a request
 */
export type ApiDescribeDataFlags = {
   /** Whether the data.field is required or not */
   required: boolean;
};

/**
 * @interface ApiDescribeOptionDetails
 * @description valid value to be used on the field/object options
 */
export type ApiDescribeOptionDetails = {
   /** The title is a display name for the value */
   title: string;
   /** The description is a description name for the value */
   description: string;
};

/**
 * @interface ApiDescribeCommand
 * @description the avaliable operations for a api command
 */
export type ApiDescribeCommand = {
   /** The module options that are allowed for this command */
   validOptions: Record<string, unknown>;
   /** The data fields that are allowed for this command */
   validData: Record<string, ApiDescribeDataFlags>;
   /** The search fields that are allowed for this command */
   validFields: Record<string, ApiDescribeDataFlags>;
};

/**
 * @type ApiDescribeField
 * @description The description of a field within an api object
 */
export type ApiDescribeField = {
   /** The description of the field */
   description: string;
   /** This title of the field */
   title: string;
   /** The datatype of the field e.g integer, string, float */
   datatype: string;
   /** The polling type of the field e.g cfg, evt, tsg and tsc  */
   polltype: string;
   /** The polling interval for tsg and tsc types*/
   interval: number;
   /** The module specific options*/
   options: Record<string, unknown>;
   /** The allowed values for this field */
   enum?: Record<string, ApiEnumField>;
};

/**
 * @type ApiDescribeOption
 * @description Option provided by the module
 */
export type ApiDescribeOption = {
   /** The description of the option  */
   description: string;
   /** The allowed values to use for this option */
   values?: Record<string, ApiDescribeOptionDetails>;
};

/**
 * @type ApiDescribeLink
 * @description An api link to another object
 */
export type ApiDescribeLink = {
   /** The title of the link */
   title: string;
   /** The object that its linked to */
   object: string;
   /** If a link is a default then you don't need to provide it in your request */
   isDefault: boolean;
};

/**
 * @type ApiDescribe
 * @description The response returned from an api describe
 */
export type ApiDescribe = {
   /** The type of the object */
   type: string;
   /** The title of the object  */
   title: string;
   /**The description of the object */
   description: string;
   /** Whether this object allows formula fields */
   allowFormulaFields: boolean;
   /** Allowed commands for this object */
   commands: Record<string, ApiDescribeCommand>;
   /** List of fields the object returns */
   fields: Record<string, ApiDescribeField>;
   /** Module options this object provides */
   options: Record<string, ApiDescribeOption>;
   /** Options that apply to every fields */
   globalFieldOptions: Record<string, ApiDescribeOption>;
   /** A link to another object */
   links: Record<string, ApiDescribeLink>;
   /** Generic information about the object */
   info: Record<string, unknown>;
};

/**
 * @type ApiEnumField
 * @description The response returned from an api describe
 */
export type ApiEnumField = {
   /** The label that can be used in a dropdown option */
   label: string;
   /** The description that can be used in a tooltip to explain the option */
   description: string;
   /** The value that would need to be sent to the server */
   value: string;
};

/**
 * @type ApiObjectLink
 * @description A custom api link definition to another object
 */
export type ApiObjectLink = {
   /** The source object for the link */
   src: string;
   /** Field definitions for the source object used in `src_query` */
   src_fields: Record<string, ApiField>;
   /** The SSQL formula to calculate a value from the source object to match against `dst_query` */
   src_query: string;
   /** The destination object for the link */
   dst: string;
   /** Field definitions for the destination object used in `dst_query` */
   dst_fields: Record<string, ApiField>;
   /** The SSQL formula to calculate a value from the destination object to match against `src_query` */
   dst_query: string;
};
