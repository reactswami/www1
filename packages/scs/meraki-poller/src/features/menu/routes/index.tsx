import { Route, Routes } from 'react-router-dom';

import Menu from './MenuRoute';

export const SettingsRoutes = () => {
   return (
      <Routes>
         <Route path="" element={<Menu />} />
      </Routes>
   );
};
