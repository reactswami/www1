import { Navigate, Route, Routes } from 'react-router-dom';

import { WizardPage } from './InitialWizardRoute';

export const InitialSetupWizardRoutes = () => {
   return (
      <Routes>
         <Route path="" element={<WizardPage />} />
         <Route path="*" element={<Navigate to="." />} />
      </Routes>
   );
};
