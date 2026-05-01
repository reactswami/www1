import { groupsHandler } from './groups';
import { oaHandlers } from './oa';

export const handlers = [...oaHandlers, ...groupsHandler];
