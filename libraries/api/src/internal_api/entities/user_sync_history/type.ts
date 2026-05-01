import { type ApiFilter } from '@statseeker/utils/types';
import { type getUserSyncAuthFields } from "../user_sync_auth";

export type DiffOp = {
   op: string;
   path: string;
   value: any;
};


export type UserSyncExecuteResult = {
   policy_name: string;
   policy_id?: number;
   missing_include_users: string[];
   missing_include_groups: string[];
   missing_exclude_users: string[];
   synchronized_users: SynchronizedUserResult[];
};


export type SynchronizedUserResult = {
   name: string;
   new: number;
   diff: DiffOp[];
};


export type UserSyncHistory = {
   id: number;
   start: string;
   finish: string;
   duration: string;
   status: string;
   details: UserSyncExecuteResult[];
   config: getUserSyncAuthFields[];
   dry_run: boolean;
   force: boolean;
};


export type UserSyncHistoryFilter = ApiFilter & {
   dry_run?: boolean;
   force?: boolean;
   status?: string;
};
