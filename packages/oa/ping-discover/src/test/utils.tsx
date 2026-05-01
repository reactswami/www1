import { faker } from '@faker-js/faker';
import { type ReactNode } from 'react';
import { vi } from 'vitest';
import { AppProvider } from '~/providers';
/**
 * Test related utility, such as MockProviders
 */

/**
 * Silence the console (usefule when testing fail network requests)
 */
export const silenceConsole = () => {
   vi.spyOn(global.console, 'error').mockImplementation(vi.fn());
   vi.spyOn(global.console, 'warn').mockImplementation(vi.fn());
   vi.spyOn(global.console, 'log').mockImplementation(vi.fn());
   vi.spyOn(global.console, 'info').mockImplementation(vi.fn());
};

/**
 * A wrapper for the render method that includes react router and the query client provider from React Query.
 */
export const testWrapper = {
   wrapper: ({ children }: { children: ReactNode }) => (
      <AppProvider>{children}</AppProvider>
   ),
};

export interface APIResponse<T = unknown> {
   version: string;
   revision: string;
   info: string;
   data: {
      success: boolean;
      errmsg: string;
      time: number;
      objects: [ApiObject<T>];
   };
   links: Link[];
}

type ApiObject<T> = {
   type: string;
   sequence: number;
   status: {
      success: boolean;
      errcode: number;
   };
   data_total: number;
   data: T[];
};

type Link = {
   link: string;
   rel: string;
};

/**
 * A helper that creates an api response type by passing data to it
 */
export const createAPIResponse = <T,>({
   data,
   isSuccessful = true,
   errorMessage = 'ok',
   total,
}: {
   data: T[];
   isSuccessful?: boolean;
   errorMessage?: string;
   total?: number;
}): APIResponse<T> => ({
   version: faker.system.semver(),
   revision: faker.number.int({ min: 1, max: 10 }).toString(),
   info: faker.lorem.sentence(1),
   data: {
      success: isSuccessful,
      errmsg: errorMessage,
      time: faker.number.int(),
      objects: [
         data.reduce(
            (previous, current) => ({
               ...previous,
               data: [...previous.data, current],
            }),
            {
               type: faker.string.alpha(),
               sequence: faker.number.int(),
               status: {
                  success: isSuccessful,
                  errcode: isSuccessful ? 0 : faker.number.int(),
               },
               data_total: total ?? data.length,
               data: [] as T[],
            }
         ),
      ],
   },
   links: [],
});

export const createAPIError = (errorMessage = 'Something went wrong') =>
   createAPIResponse({ data: [], isSuccessful: false, errorMessage });
