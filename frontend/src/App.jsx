import { useState } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css'
import Login from './views/Login.jsx'
import Landing from './views/Landing.jsx'
import About from './views/About.jsx'
import Contact from './views/Contact.jsx'
import RegisterDonor from './views/RegisterDonor.jsx'
import RegisterPatient from './views/RegisterPatient.jsx'
import PatientDashboard from './views/PatientDashboard.jsx'
import DonorDashboard from './views/DonorDashboard.jsx'
import StaffDashboard from './pages/hospital/HospitalDashboard.jsx'
import StaffRequests from './pages/hospital/HospitalRequestHistory.jsx'
import HospitalRequestBlood from './pages/hospital/HospitalRequestBlood.jsx'
import HospitalBloodStock from './pages/hospital/HospitalBloodStock.jsx'

const PrivateRoutes = () => {
  const role = localStorage.getItem("role");
  return role ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoutes = () => {
  const role = localStorage.getItem("role");

  const roleRedirects = {
    patient: '/patient',
    donor: '/donor',
    staff: '/staff'
  };


  if (role && roleRedirects[role]) {
    return <Navigate to={roleRedirects[role]} replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <>
      <Toaster position="bottom-center" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/donor" element={<RegisterDonor />} />
          <Route path="/register/patient" element={<RegisterPatient />} />
        </Route>

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/donor" element={<DonorDashboard />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/requests" element={<StaffRequests />} />
          <Route path="/hospital/request-blood" element={<HospitalRequestBlood />} />
          <Route path="/hospital/blood-stock" element={<HospitalBloodStock />} />
        </Route>
      </Routes>
    </>
  );
}

export default App




