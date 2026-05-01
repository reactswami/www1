import { Route, Routes } from 'react-router-dom';

import { AddOrganizationRule } from './AddOrganizationRuleRoute';
import { EditOrganizationRule } from './EditOrganizationRuleRoute';
import { OrganizationTableRoute } from './OrganizationTableRoute';

export const OrganizationTableRoutes = () => {
   return (
      <Routes>
         <Route path="" element={<OrganizationTableRoute />} />
         <Route path="/add" element={<AddOrganizationRule />} />
         <Route path="/:rule" element={<EditOrganizationRule />} />
      </Routes>
   );
};

export default OrganizationTableRoutes;
