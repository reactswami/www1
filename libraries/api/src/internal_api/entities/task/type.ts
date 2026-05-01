import { type ApiFilter } from '@statseeker/utils/types';
import { type DiscoverExecuteOptions } from '../discover';
import { type DiscoverHistory } from '../discover_history';
import { type UserSyncExecuteOptions } from '../user_sync';


type PickOptional<T, K extends keyof T> = {
   [P in K]?: T[P];
};
/**
 * TaskOptions type definition,
 * Options are extensible, depending on the context in which it is used.
 */
export type TaskOptions = DiscoverExecuteOptions | UserSyncExecuteOptions | {};

/**
 * TaskCommand type definition
 * @property {string} command that run the task,
 * @property {string} object_type - Object type
 * @property {string} context - context
 * @property {TaskOptions} options - task options
 */
export type TaskCommand = {
   command: string;
   object_type: string;
   context: string;
   options: TaskOptions;
};

/**
 * Task type definition
 * @property {string} id id of the task,
 * @property {string} name - name of the task
 * @property {string} progress - progress in percentage of the task
 * @property {string} type - type of the task, example, discover schedule
 * @property {string} status - status of the task
 * @property {number} enabled - 1 or 0 if the task is enabled or disabled
 * @property {string | number} time - a string if it's cron, a number if its a one off task
 * @property {TaskCommand} commands - array of commands that the task will run
 */
export type Task = PickOptional<DiscoverHistory, 'start' | 'finish' | 'duration' | 'config' | 'poller_name' | 'mode'> & {
   id?: number;
   name?: string;
   progress?: number;
   type?: string;
   status?: string;
   enabled?: number;
   time?: string | number;
   commands?: TaskCommand[];
   poller_status?: string;
};

/**
 * TaskFilter type definition
 * @property {Number} enabled  - 1 or 0 if the task is enabled or disabled,
 * @property {string} name - name of the task
 */
export type TaskFilter = ApiFilter & {
   enabled?: number;
   type?: string;
   name_filter?: string;
   time?: string | number;
   poller_status?: string;
   poller_name?: string;
};

/**
 * TASK_OBJECT_TYPE type definition
 * @property {string} object_type for the task api
 */
export const TASK_OBJECT_TYPE = Object.freeze({
   object_type: 'task',
});
