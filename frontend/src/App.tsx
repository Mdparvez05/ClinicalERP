import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/app/pages/Dashboard';
import { Appointments } from '@/app/pages/Appointments';
import { Patients } from '@/app/pages/Patients';
import { OPDRx } from '@/app/pages/OPDRx';
import { LabTests } from '@/app/pages/LabTests';
import { Billing } from '@/app/pages/Billing';
import { Settings } from '@/app/pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="patients" element={<Patients />} />
          <Route path="opd-rx" element={<OPDRx />} />
          <Route path="lab-tests" element={<LabTests />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
