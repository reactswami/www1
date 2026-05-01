import { type ApiObject, apply_all_logic } from '@statseeker/api/internal_api';
import { type SNMPCredential } from '@statseeker/api/internal_api/entities';
import { db } from '../db';


export function describeCredentialMock() {
   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1714629694,
      sequence: 26,
      data_total: 0,
      data: [],
      describe: {
         allow_formula_fields: true,
         commands: {
            add: {
               valid_data: {
                  auth_method: {
                     required: false,
                  },
                  auth_pass: {
                     required: false,
                  },
                  auth_user: {
                     required: false,
                  },
                  community: {
                     required: false,
                  },
                  context: {
                     required: false,
                  },
                  id: {
                     required: false,
                  },
                  ip_range_configs: {
                     required: false,
                  },
                  name: {
                     required: true,
                  },
                  priv_method: {
                     required: false,
                  },
                  priv_pass: {
                     required: false,
                  },
                  version: {
                     required: false,
                  },
               },
               valid_fields: {},
               valid_options: {},
            },
            delete: {
               valid_data: {},
               valid_fields: {
                  auth_method: {
                     required: false,
                  },
                  auth_pass: {
                     required: false,
                  },
                  auth_user: {
                     required: false,
                  },
                  community: {
                     required: false,
                  },
                  context: {
                     required: false,
                  },
                  id: {
                     required: false,
                  },
                  name: {
                     required: false,
                  },
                  priv_method: {
                     required: false,
                  },
                  priv_pass: {
                     required: false,
                  },
                  version: {
                     required: false,
                  },
               },
               valid_options: {},
            },
            describe: {
               valid_data: {},
               valid_fields: {},
               valid_options: {},
            },
            get: {
               valid_data: {},
               valid_fields: {
                  auth_method: {
                     required: false,
                  },
                  auth_pass: {
                     required: false,
                  },
                  auth_user: {
                     required: false,
                  },
                  community: {
                     required: false,
                  },
                  context: {
                     required: false,
                  },
                  id: {
                     required: false,
                  },
                  name: {
                     required: false,
                  },
                  priv_method: {
                     required: false,
                  },
                  priv_pass: {
                     required: false,
                  },
                  version: {
                     required: false,
                  },
               },
               valid_options: {},
            },
            update: {
               valid_data: {
                  auth_method: {
                     required: false,
                  },
                  auth_pass: {
                     required: false,
                  },
                  auth_user: {
                     required: false,
                  },
                  community: {
                     required: false,
                  },
                  context: {
                     required: false,
                  },
                  id: {
                     required: false,
                  },
                  ip_range_configs: {
                     required: false,
                  },
                  name: {
                     required: false,
                  },
                  priv_method: {
                     required: false,
                  },
                  priv_pass: {
                     required: false,
                  },
                  version: {
                     required: false,
                  },
               },
               valid_fields: {
                  auth_method: {
                     required: false,
                  },
                  auth_pass: {
                     required: false,
                  },
                  auth_user: {
                     required: false,
                  },
                  community: {
                     required: false,
                  },
                  context: {
                     required: false,
                  },
                  id: {
                     required: false,
                  },
                  name: {
                     required: false,
                  },
                  priv_method: {
                     required: false,
                  },
                  priv_pass: {
                     required: false,
                  },
                  version: {
                     required: false,
                  },
               },
               valid_options: {},
            },
         },
         description:
            'The saved SNMP Credentials which are used for discovery and associating to SNMP monitored devices',
         fields: {
            auth_method: {
               datatype: 'string',
               description: 'The SNMPv3 Authentication Method',
               enum: {
                  '0': {
                     label: 'None',
                     value: '',
                     description: 'None',
                  },
                  '1': {
                     label: 'MD5',
                     description: 'MD5',
                     value: 'md5',
                  },
                  '2': {
                     label: 'SHA1',
                     value: 'sha',
                     description: 'SHA1',
                  },
                  '3': {
                     label: 'SHA224',
                     description: 'SHA224',
                     value: 'sha224',
                  },
                  '4': {
                     label: 'SHA256',
                     value: 'sha256',
                     description: 'SHA256',
                  },
                  '5': {
                     label: 'SHA384',
                     value: 'sha384',
                     description: 'SHA384',
                  },
                  '6': {
                     label: 'SHA512',
                     description: 'SHA512',
                     value: 'sha512',
                  },
               },
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'The SNMPv3 Authentication Method',
            },
            auth_pass: {
               datatype: 'string',
               description: 'The Password to use when authenticating an SNMPv3 request',
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'Authentication Password',
            },
            auth_user: {
               datatype: 'string',
               description: 'The Username to use when authenticating an SNMPv3 request',
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'Authentication User',
            },
            community: {
               datatype: 'string',
               description: 'SNMPv1 or SNMPv2 community string',
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'SNMP Community',
            },
            context: {
               datatype: 'string',
               description: 'The SNMPv3 Context',
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'Context',
            },
            id: {
               datatype: 'integer',
               description: 'SNMP Credential identifier/key',
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'ID',
            },
            ip_range_configs: {
               datatype: 'object',
               description: 'Array of IP Range Configs IDs (add and update only)',
               interval: 0,
               options: {
                  formats: {
                     description: 'The valid data formats for the ip_range_configs field',
                     values: {
                        list: {
                           description:
                              'Array of ip_range_config ids to assign to this configuration',
                           title: 'List',
                        },
                     },
                  },
               },
               polltype: 'cfg',
               title: 'IP Range Config IDs',
            },
            name: {
               datatype: 'string',
               description: 'Name identifer for SNMP Credentials',
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'Name',
            },
            priv_method: {
               datatype: 'string',
               description:
                  'The Privacy Method used when encrypting/decrypting SNMPv3 requests and responses',
               enum: {
                  '0': {
                     value: '',
                     description: 'None',
                     label: 'None',
                  },
                  '1': {
                     label: 'AES',
                     description: 'AES',
                     value: 'aes',
                  },
                  '2': {
                     label: 'AES192',
                     description: 'AES 192',
                     value: 'aes192',
                  },
                  '3': {
                     value: 'aes256',
                     description: 'AES 256',
                     label: 'AES256',
                  },
                  '4': {
                     label: 'AES512',
                     description: 'AES 512',
                     value: 'aes512',
                  },
                  '5': {
                     value: 'des',
                     description: 'DES',
                     label: 'DES',
                  },
                  '6': {
                     label: 'DES3',
                     description: 'Triple DES',
                     value: 'des3',
                  },
               },
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'The SNMPv3 Privacy Method',
            },
            priv_pass: {
               datatype: 'string',
               description:
                  'The Password to use when encrypting/decrypting SNMPv3 requests and responses',
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'Privacy Password',
            },
            version: {
               datatype: 'integer',
               description: 'The SNMP version',
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'SNMP Version',
            },
         },
         global_field_options: {
            aggregation_format: {
               description: 'Aggregation formats to apply when group_by option is provided',
               values: {
                  '95th': {
                     description: '95th percentile of the values in the group',
                     title: '95th percentile',
                  },
                  avg: {
                     description: 'Average of the values in the group',
                     title: 'Average',
                  },
                  cat: {
                     description: 'Concatenation of the values in the group',
                     title: 'Concatenate',
                  },
                  count: {
                     description: 'Number on non-null values in the group',
                     title: 'Count',
                  },
                  count_all: {
                     description: 'Number of values in the group (including null values)',
                     title: 'Count (include NULL)',
                  },
                  count_unique: {
                     description: 'Number of unique non-null values in the group',
                     title: 'Unique count',
                  },
                  count_unique_all: {
                     description: 'Number of unique values in the group (including null values)',
                     title: 'Unique count (include NULL)',
                  },
                  first: {
                     description: 'First value in the group (default)',
                     title: 'First',
                  },
                  last: {
                     description: 'Last value in the group',
                     title: 'Last',
                  },
                  list: {
                     description: 'Comma separated concatenation of the values in the group',
                     title: 'List',
                  },
                  list_unique: {
                     description: 'Comma separated concatenation of the unique values in the group',
                     title: 'Unique List',
                  },
                  max: {
                     description: 'Maximum of the values in the group',
                     title: 'Maximum',
                  },
                  median: {
                     description: 'Median of the values in the group',
                     title: 'Median',
                  },
                  min: {
                     description: 'Minimum of the values in the group',
                     title: 'Minimum',
                  },
                  stddev: {
                     description: 'Standard deviation of the values in the group',
                     title: 'Standard deviation',
                  },
                  sum: {
                     description: 'Sum of all values in the group (null if no valid values)',
                     title: 'Sum',
                  },
                  total: {
                     description: 'Sum of all values in the group (0 if no valid values)',
                     title: 'Total',
                  },
               },
            },
         },
         info: {},
         links: {
            IRCtoSCMapLink: {
               is_default: true,
               object: 'irc_to_sc_map',
               title: 'Link to IP Range Configuration to SNMP Credential Map',
            },
         },
         options: {
            encrypted: {
               description:
                  'Indicates whether auth_pass and priv_pass have already been encrypted when calling add or update',
               values: {
                  false: {
                     description:
                        'Indicates that auth_pass and priv_pass have not been encrypted (default if not provided)',
                     title: 'false',
                  },
                  true: {
                     description:
                        'Indicates that auth_pass and priv_pass have already been encrypted',
                     title: 'true',
                  },
               },
            },
         },
         title: 'SNMP Credential Details',
         type: 'snmp_credential',
      },
   };
}

export function getCredentialsMock(request: ApiObject) {
   const result = apply_all_logic(request, db.snmp_credential.getAll());

   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1714431052,
      sequence: 2,
      data_total: result.data_total,
      data: result.data,
      describe: null,
   };
}

export function createCredential(newCred: SNMPCredential) {
   const dbCred = db.snmp_credential.create({
      ...newCred,
      type: `SNMP v${newCred.version}`,
   });
   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1717739829,
      sequence: 5,
      data_total: 1,
      data: [dbCred],
      describe: null,
   };
}
