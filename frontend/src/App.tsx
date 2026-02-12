import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/app/pages/Dashboard';
import { Appointments } from '@/app/pages/Appointments';
import { ViewAppointment } from '@/app/pages/ViewAppointment';
import { Patients } from '@/app/pages/Patients';
import { OPDRx } from '@/app/pages/OPDRx';
import { LabTests } from '@/app/pages/LabTests';
import { Billing } from '@/app/pages/Billing';
import { Settings } from '@/app/pages/Settings';
import { AddMember } from '@/app/pages/AddMember';
import { EmployeeDetails } from '@/app/pages/EmployeeDetails';
import { AppointmentPrint } from '@/app/pages/AppointmentPrint';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="appointments/:id" element={<ViewAppointment />} />
          <Route path="appointments/:id/print" element={<AppointmentPrint />} />
          <Route path="patients" element={<Patients />} />
          <Route path="opd" element={<OPDRx />} />
          <Route path="lab-tests" element={<LabTests />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/add-member" element={<AddMember />} />
          <Route path="settings/team/:id" element={<EmployeeDetails />} />
          <Route path="settings/team/:id/edit" element={<AddMember />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
