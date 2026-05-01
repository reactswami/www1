import { faker } from '@faker-js/faker';
import { factory, primaryKey } from '@mswjs/data';

function getProductLine(equipmentType: string) {
   switch (equipmentType) {
      case 'Miscellaneous':
         return faker.word.verb();
      case 'Passenger Scanner':
         return faker.helpers.arrayElement(['QPS Bodyscanner', 'Walk-Through Metal Detector']);
      case 'Baggage Scanner':
         return faker.helpers.arrayElement(['CT', 'RTT']);
      case 'Workstation':
         return faker.helpers.arrayElement([
            'PVS Workstation',
            'RTT Workstation',
            'SVS Workstation',
         ]);
      default:
         return faker.word.verb();
   }
}

function getModelName(productLine: string) {
   switch (productLine) {
      case 'QPS Bodyscanner':
         return faker.helpers.arrayElement(['201 P1', '201 P2']);
      case 'Walk-Through Metal Detector':
         return faker.helpers.arrayElement(['900M']);
      case 'CT':
         return '920';
      case 'RTT':
         return '110';
      default:
         return faker.word.verb();
   }
}

/**
 * Models as described in the @mswjs/data library
 */
const models = {
   equipment: {
      id: primaryKey(() => faker.number.int({ min: 1 })),
      name: () => faker.word.adjective(),
      airportId: Number,
      airportTitle: String,
      terminalId: Number,
      terminalTitle: String,
      laneId: Number,
      laneTitle: String,
      screeningPointId: Number,
      screeningPointTitle: String,
      equipmentType: String,
      ipaddress: () => faker.internet.ip(),
      productLine: String,
      modelName: () => faker.word.verb(),
      firmware: () => faker.internet.mac(),
      serialNumber: () => faker.number.int(),
      status: () => faker.helpers.arrayElement(['on', 'off']),
      latitude: () => faker.location.latitude(),
      longitude: () => faker.location.latitude(),
      passengerScanEfficiencyTargetCfg: () => faker.number.int({ min: 0, max: 100 }),
   },
   airport: {
      id: primaryKey(() => faker.number.int({ min: 1 })),
      title: () => faker.airline.airport().name,
   },
   terminal: {
      id: primaryKey(() => faker.number.int({ min: 1 })),
      name: faker.string.uuid,
      title: () => `Terminal ${faker.number.bigInt({ min: 1, max: 10 })}`,
      airportId: Number,
      airportTitle: String,
   },
   screeningPoint: {
      id: primaryKey(() => faker.number.int({ min: 1 })),
      title: String,
      airportId: Number,
      airportTitle: String,
      terminalId: Number,
      terminalTitle: String,
      passengerScanEfficiencyTargetCfg: Number,
      baggageScanEfficiencyTargetCfg: Number,
      locationCategory: String,
   },
   lane: {
      id: primaryKey(() => faker.number.int({ min: 1 })),
      title: () => `${faker.number.int({ min: 1, max: 20 })}`,
      airportId: Number,
      airportTitle: String,
      terminalId: Number,
      terminalTitle: String,
      screeningPointId: Number,
      screeningPointTitle: String,
      passengerScanEfficiencyTargetCfg: () => faker.number.int({ min: 0, max: 100 }),
   },
   networks: {
      id: primaryKey(() => faker.number.int({ min: 1 })),
      scannerNetworkTitle: () => faker.word.adjective(),
      scannerNetworkIpaddress: () => faker.internet.ipv4(),
      scannerNetworkPort: () => faker.number.int({ min: 1, max: 65535 }),
   },
};

export type Model = typeof db;
export const db = factory(models);

/*
 * Seed the mocked database server
 */
export const initialiseDb = (
   counts = {
      equipment: 100,
      airport: 8,
      terminal: 10,
      screeningPoint: 7,
      lane: 4,
   }
) => {
   console.log('seeeding data');
   /**
    * Example only, replace this with your logic to seed the mock server
    */
   /** Define number of models */

   /** Create models */
   const { equipment, lane, terminal, airport, screeningPoint } = counts;
   const airports = new Array(airport).fill(null).map((_) => {
      return db.airport.create({});
   });

   const terminals = new Array(terminal).fill(null).map((_) => {
      const airport = faker.helpers.arrayElement(airports);
      return db.terminal.create({
         airportId: airport.id,
         airportTitle: airport.title,
      });
   });

   const screeningPoints = new Array(screeningPoint).fill(null).map((_) => {
      const airport = faker.helpers.arrayElement(airports);
      const terminal = faker.helpers.arrayElement(terminals);
      const locationCategory = faker.helpers.arrayElement(['Front of House', 'Back of House']);
      const title = `Screening Point ${faker.number.bigInt({
         min: 1,
         max: 10,
      })} ${locationCategory}`;
      let passengerScanEfficiencyTargetCfg;
      let baggageScanEfficiencyTargetCfg;

      if (locationCategory === 'Front of House') {
         passengerScanEfficiencyTargetCfg = faker.number.int({ min: 0, max: 100 });
      } else {
         baggageScanEfficiencyTargetCfg = faker.number.int({ min: 0, max: 100 });
      }

      return db.screeningPoint.create({
         airportId: airport.id,
         airportTitle: airport.title,
         terminalId: terminal.id,
         terminalTitle: terminal.title,
         passengerScanEfficiencyTargetCfg,
         baggageScanEfficiencyTargetCfg,
         locationCategory,
         title,
      });
   });

   const lanes = new Array(lane).fill(null).map((_) => {
      const airport = faker.helpers.arrayElement(airports);
      const terminal = faker.helpers.arrayElement(terminals);
      const screeningPoint = faker.helpers.arrayElement(screeningPoints);
      return db.lane.create({
         airportId: airport.id,
         airportTitle: airport.title,
         terminalId: terminal.id,
         terminalTitle: terminal.title,
         screeningPointId: screeningPoint.id,
         screeningPointTitle: screeningPoint.title,
      });
   });

   new Array(equipment).fill(null).map((_) => {
      const airport = faker.helpers.arrayElement(airports);
      const terminal = faker.helpers.arrayElement(terminals);
      const screeningPoint = faker.helpers.arrayElement(screeningPoints);
      const lane = faker.helpers.arrayElement(lanes);
      const equipmentType = faker.helpers.arrayElement([
         'Miscellaneous',
         'Passenger Scanner',
         'Baggage Scanner',
         'Workstation',
      ]);
      const productLine = getProductLine(equipmentType);

      return db.equipment.create({
         airportId: airport.id,
         airportTitle: airport.title,
         terminalId: terminal.id,
         terminalTitle: terminal.title,
         screeningPointId: screeningPoint.id,
         screeningPointTitle: screeningPoint.title,
         laneId: lane.id,
         laneTitle: lane.title,
         equipmentType,
         productLine,
         modelName: getModelName(productLine),
      });
   });

   new Array(airport).fill(null).map((_) => {
      return db.networks.create();
   });
};
