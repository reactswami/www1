import { type ReactElement } from 'react';

type Path = Routes | string;

export type RouteDefinition = {
   path: Path;
   element: ReactElement;
};

export enum Routes {
   home = '/',
   menu = 'menu',
   lanes = '/lanes',
   addLane = '/lanes/add',
   airports = '/airports',
   addAirport = '/airports/add',
   terminals = '/terminals',
   addTerminal = 'add',
   updateTerminal = 'update/:terminalId',
   deleteTerminal = 'delete/:terminalId',
   screeningPoints = '/screeningPoints',
   addScreeningPoints = '/screeningPoints/add',
   equipments = '/equipments',
   addEquipments = '/equipments/add',
   notFound = '*',
   networks = '/networks',
   certificates = '/certificates',
}
