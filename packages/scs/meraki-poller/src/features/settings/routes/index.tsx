import { Navigate, Route, Routes } from 'react-router-dom';

import { Settings } from './SettingsRoute';

export const SettingsRoutes = () => {
   return (
      <Routes>
         <Route path="" element={<Settings />} />
         <Route path="*" element={<Navigate to="." />} />
      </Routes>
   );
};
