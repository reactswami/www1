import { type ReactElement } from 'react';

type Path = Routes | string;

export type RouteDefinition = {
   path: Path;
   element: ReactElement;
};

export enum Routes {
   /**
    * Define your Routes here
    * Example only, replace with your code
    */

   // firstVisit = '/first-visit',
   // settings = '/settings',
   // configuration = '/configuration',
   // menu = '/menu',

   home = '/',
   notFound = '*',
}
