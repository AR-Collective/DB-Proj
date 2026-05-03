import { useState } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
      </Route>
    </Routes>
  );
}

export default App




