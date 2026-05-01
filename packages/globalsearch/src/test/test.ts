import { TRACK_DELAY_STATUS } from '../hooks/useTrackDelay';
import { type SearchDetails, type SearchState } from '../types/type';

export const searchResults: SearchDetails[] = [
   {
      name: 'net-houston-swt-9300-10',
      visible: true,
      description: { 'Router': 'device type', '10.500.50.200': 'IP Address', 'Athens': 'location' },
      category: 'device',
      status: 'Online',
      actions: [
         {
            title: 'Edit',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
         {
            title: 'Device View',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
         {
            title: 'Console',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
      ],
   },
   {
      name: 'Barcelona-swt3',
      visible: true,

      description: { 'Switch': 'device type', '10.200.50.22': 'IP Address', 'Barcelona': 'location' },
      category: 'device',
      status: 'Offline',
      actions: [
         {
            title: 'Edit',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
         {
            title: 'Device View',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
         {
            title: 'Console',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
      ],
   },
   {
      name: 'Chicago-swt2',
      description: { 'Switch': 'device type', '10.30.50.300': 'IP Address', 'Chicago': 'location' },
      category: 'device',
      visible: true,

      actions: [
         {
            title: 'Edit',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
         {
            title: 'Device View',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
         {
            title: 'Console',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
      ],
   },
   {
      name: 'Denver-rt2',
      description: { 'Router': 'device type', '10.30.50.300': 'IP Address', 'Denver': 'location' },
      category: 'device',
      visible: true,

      actions: [
         {
            title: 'Edit',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
         {
            title: 'Device View',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
         {
            title: 'Console',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
      ],
   },
   {
      name: 'Gi0/1',
      description: { 'Denver-rt1': 'location', 'Port 4/16': 'port', '1.00G': 'speed' },
      category: 'interface',

      visible: true,
      status: 'Disabled',
      actions: [
         {
            title: 'Edit',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
         {
            title: 'Interface Statistics',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
         {
            title: 'Console',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
      ],
   },
   {
      name: 'Gi4/3',
      description: { 'Barceloa-swt1': 'location', 'Port 1/2': 'port', '100.00M': 'speed' },
      category: 'interface',

      visible: true,
      status: 'Enabled',
      actions: [
         {
            title: 'Edit',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
         {
            title: 'Interface Statistics',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
         {
            title: 'Console',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
      ],
   },
   {
      name: 'All groups',
      description: { 'All group': 'group name' },
      category: 'group',

      visible: true,
      actions: [
         {
            title: 'Edit',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
         {
            title: 'Console',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
      ],
   },
   {
      name: 'Interface: Speed 56K',
      description: { 'Interface: Speed 56K': 'group name' },
      category: 'group',

      visible: true,
      actions: [
         {
            title: 'Edit',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
         {
            title: 'Console',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
      ],
   },
   {
      name: 'File System Report',
      description: { 'Report': 'config type', 'File System': 'report entity' },
      category: 'report',

      visible: true,
      actions: [],
   },
   {
      name: 'Device Dasbboard',
      description: { 'Default': 'dashboard type', 'Statseeker': 'dashboard tag', 'Device': 'dashboard entity' },
      category: 'dashboard',

      visible: true,
      actions: [],
   },
   {
      name: 'Network Dashboard',
      description: { 'Default': 'dashboard type', 'Statseeker': 'dashboard tag', 'Network': 'dashboard entity' },
      category: 'dashboard',

      visible: true,
      actions: [],
   },
   {
      name: 'Manage Dashboard',
      description: { 'Config': 'dashboard admin', 'Dashboard': 'dashboard manage', 'Non-admin': 'user type' },
      category: 'dashboard',
      visible: true,

      actions: [],
   },
   {
      name: 'user001',
      description: { 'Users': 'admin tool', 'Config': 'configuration', 'Non-admin': 'user type' },
      category: 'administration',

      visible: true,
      actions: [
         {
            title: 'Edit',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
         {
            title: 'Delete',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
      ],
   },
   {
      name: 'Alert1',
      description: { 'Alert': 'admin tool', 'Config': 'configuration', 'Report': 'report' },
      category: 'administration',
      visible: true,

      actions: [
         {
            title: 'Edit',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
         {
            title: 'Delete',
            action: 'device/edit?Athens-swt',
            target: '_self',
         },
      ],
   },
];

export const initialState: SearchState = {
   searchFilters: [
      { filter: 'Device', label: 'Device', selected: true },
      { filter: 'Interface', label: 'Interface', selected: true },
      { filter: 'Group', label: 'Group', selected: true },
      { filter: 'Dashboard', label: 'Dashboard', selected: true },
      { filter: 'Report', label: 'Report', selected: true },
      { filter: 'Administration', label: 'Administration', selected: true },
   ],
   hoverActionIndex: -1,
   hoverFilterIndex: -1,
   lastHoverFilterIndex: -1,
   selectedResultIndex: 0,
   isAllSelected: true,
   hasNewData: true,
   searchResults: [],
   searchFrequentDetails: [],
   isLoading: false,
   startSearch: false,
   triggerCloseAction: false,
   trackDelay: TRACK_DELAY_STATUS.IDLE,

};
