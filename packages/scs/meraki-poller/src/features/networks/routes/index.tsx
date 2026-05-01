import { Route, Routes } from 'react-router-dom';

import { AddNetworkRule } from './AddNetworkRuleRoute';
import { EditNetworkCustomRule } from './EditNetworkCustomRuleRoute';
import { NetworkExplorer } from './NetworkTableRoute';

const NetworkExplorerRoutes = () => {
   return (
      <Routes>
         <Route index element={<NetworkExplorer />} />
         <Route path="/add" element={<AddNetworkRule />} />
         <Route path="/:rule" element={<EditNetworkCustomRule />} />
      </Routes>
   );
};

export default NetworkExplorerRoutes;
