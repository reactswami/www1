import { type ApiFilter } from '@statseeker/utils/types';

/**
 * Port entity type definition
 * @type Port
 * @property {Number} id - The entity identifier
 * @property {string} name - The entity name
 * @property {string} idx - The ID of the parent device
 * @property {string} table - The base SNMP index for this entity
 * @property {string} poll - The poll state of the entity
 * @property {number} InBroadcastPkts - Number of received broadcast packets
 * @property {number} InBroadcastPps - Number of received broadcast packets per second
 * @property {number} InDiscards - Number of received discards
 * @property {number} InErrors - Number of received errors
 * @property {number} InMulticastPkts - Number of received multicast packets
 * @property {number} InMulticastPps - Number of received multicast packets per second
 * @property {number} InOctets - Number of received bytes
 * @property {number} InOutBroadcastPkts - Combined Rx and Tx broadcast packets
 * @property {number} InOutDiscards - Combined Rx and Tx discards
 * @property {number} InOutErrors - Combined Rx and Tx Errors
 * @property {number} InOutMulticastPkts - Combined Rx and Tx multicast packets
 * @property {number} InOutOctets - Combined Rx and Tx Bytes
 * @property {number} InOutSpeed - Combined Rx and Tx Speed
 * @property {number} InOutUcastPkts - Combined Rx and Tx unicast packets
 * @property {number} InUcastPkts - Number of received unicast packets
 * @property {number} InUcastPps - Number of received unicast packets per second
 * @property {number} OutBroadcastPkts - Number of transmitted broadcast packets
 * @property {number} OutBroadcastPps - Number of transmitted broadcast packets per second
 * @property {number} OutDiscards - Number of transmitted discards
 * @property {number} OutErrors - Number of transmitted errors
 * @property {number} OutMulticastPkts - Number of transmitted multicast packets
 * @property {number} OutMulticastPps - Number of transmitted multicast packets per second
 * @property {number} OutOctets - Number of transmitted bytes
 * @property {number} OutUcastPkts - Number of transmitted unicast packets
 * @property {number} OutUcastPps - Number of transmitted unicast packets per second
 * @property {number} RxBps - Received bits per second
 * @property {number} RxDiscardsPercent - Rx discards percentage
 * @property {number} RxErrorPercent - Rx errors percentage
 * @property {number} RxTxDiscardsPercent - Total discards percentage
 * @property {number} RxTxErrorPercent - Total errors percentage
 * @property {number} RxUtil - Rx Utilization
 * @property {number} TxBps - Transmitted bits per second
 * @property {number} TxDiscardsPercent - Tx discards percentage
 * @property {number} TxErrorPercent - Tx errors percentage
 * @property {number} TxUtil - Tx Utilization
 * @property {number} if90day - Status of port usage over 90 days
 * @property {string} ifAdminStatus - This desired state of the interface
 * @property {string} ifAlias - Interface Alias (ifAlias)
 * @property {string} ifDescr - Interface Description (ifDescr)
 * @property {string} ifDuplex - Interface Duplex (half/full/auto)
 * @property {number} ifInSpeed - Interface Input Speed (Statseeker custom attribute)
 * @property {string} ifIndex - Interface Index (IF-MIB.ifIndex)
 * @property {string} ifName - Interface Name (IF-MIB.ifName)
 * @property {string} ifNonUnicast - NonUnicast Polling status of the port
 * @property {string} ifOperStatus - Current operational status of port
 * @property {number} ifOutSpeed - Interface Output Speed (Statseeker custom attribute)
 * @property {string} ifPhysAddress - Interface MAC Address (ifPhysAddress)
 * @property {string} ifPoll - Polling status of the port
 * @property {number} ifSpeed - Interface Speed (based on ifSpeed or ifHighSpeed)
 * @property {string} ifTitle - Interface Title (Statseeker custom attribute - ifTitle)
 * @property {string} ifType - Interface Type (ifType)
 */
export type Port = {
   id: number;
   name: string;
   idx: string;
   table: string;
   poll: string;
   InBroadcastPkts: number;
   InBroadcastPps: number;
   InDiscards: number;
   InErrors: number;
   InMulticastPkts: number;
   InMulticastPps: number;
   InOctets: number;
   InOutBroadcastPkts: number;
   InOutDiscards: number;
   InOutErrors: number;
   InOutMulticastPkts: number;
   InOutOctets: number;
   InOutSpeed: number;
   InOutUcastPkts: number;
   InUcastPkts: number;
   InUcastPps: number;
   OutBroadcastPkts: number;
   OutBroadcastPps: number;
   OutDiscards: number;
   OutErrors: number;
   OutMulticastPkts: number;
   OutMulticastPps: number;
   OutOctets: number;
   OutUcastPkts: number;
   OutUcastPps: number;
   RxBps: number;
   RxDiscardsPercent: number;
   RxErrorPercent: number;
   RxTxDiscardsPercent: number;
   RxTxErrorPercent: number;
   RxUtil: number;
   TxBps: number;
   TxDiscardsPercent: number;
   TxErrorPercent: number;
   TxUtil: number;
   if90day: number;
   ifAdminStatus: string;
   ifAdminStatusPoll: string;
   ifAlias: string;
   ifDescr: string;
   ifDuplex: string;
   ifInSpeed: number;
   ifIndex: string;
   ifName: string;
   ifNonUnicast: string;
   ifOperStatus: string;
   ifOperStatusPoll: string;
   ifOutSpeed: number;
   ifPhysAddress: string;
   ifPoll: string;
   ifSpeed: number;
   ifTitle: string;
   ifType: string;
};

export type PortFilter = ApiFilter & {
   ifAdminStatus?: string;
   ifOperStatus?: string;
   poll?: string;
   snmp_poller_status?: string;
   snmp_poller_id?: number[];
};
