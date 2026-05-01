import { HttpResponse, type Path, type PathParams, http } from 'msw';
import { createAiport, getAirports } from './airport';
import { getCertificates } from './certificate';
import { addDeviceEquipment, getEquipment } from './deviceEquipment';
import { getEquipmentType } from './equipmentType';
import { getAllEntities } from './global';
import { getLanes } from './lane';
import { getLocationCategory } from './locationCategory';
import { getNetworks } from './networks';
import { getScreeningPoints } from './screeningPoint';
import { addTerminals, getTerminals } from './terminal';
import { environment } from '~/config/environment';
import { ENTITY_TYPE } from '~/utils/constants';

const { endpoints } = environment;

type CreateEntityBody = {
   entity_type: string;
};

export const entityOperations = [
   /**
    * Set up your mock handlers here.
    * These are provided for example only.
    * For more information, check out @mswjs library.
    */
   http.get(endpoints.entityOperations, async ({ request }) => {
      const url = new URL(request.url);
      const entityType = url.searchParams.get('entity_type');

      switch (entityType) {
         case ENTITY_TYPE.AIRPORT:
            return await getAirports();
         case ENTITY_TYPE.TERMINAL:
            return await getTerminals(request);
         case ENTITY_TYPE.LANE:
            return await getLanes();
         case ENTITY_TYPE.SCREENING_POINT:
            return await getScreeningPoints();
         case ENTITY_TYPE.DEVICE_EQUIPMENT:
            return await getEquipment(request);
         case ENTITY_TYPE.EQUIPMENT_TYPE:
            return await getEquipmentType();
         case ENTITY_TYPE.ALL:
            return await getAllEntities();
         case ENTITY_TYPE.LOCATION_CATEGORY:
            return await getLocationCategory();
         case ENTITY_TYPE.NETWORKS:
            return await getNetworks();
         case ENTITY_TYPE.CERTIFICATES:
            return await getCertificates();

         default:
            return HttpResponse.json(
               { meta: {}, result: 'Something went wrong', success: false },
               { status: 404 }
            );
      }
   }),
   http.post<PathParams, CreateEntityBody, undefined, Path>(
      endpoints.entityOperations,
      async ({ request }) => {
         const body = await request.json();

         switch (body.entity_type) {
            case ENTITY_TYPE.AIRPORT:
               return await createAiport(body);
            case ENTITY_TYPE.TERMINAL:
               return await addTerminals(body);
            case ENTITY_TYPE.LANE:
               return await getLanes();
            case ENTITY_TYPE.SCREENING_POINT:
               return await getScreeningPoints();
            case ENTITY_TYPE.DEVICE_EQUIPMENT:
               return await addDeviceEquipment(body);
            case ENTITY_TYPE.EQUIPMENT_TYPE:
               return await getEquipmentType();
            default:
               return HttpResponse.json(
                  { meta: {}, result: 'Something went wrong', success: false },
                  { status: 500 }
               );
         }
      }
   ),
];
