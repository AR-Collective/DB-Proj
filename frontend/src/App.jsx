import { useState } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css'
import Login from './views/Login.jsx'
import Landing from './pages/Landing.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import RegisterDonor from './pages/RegisterDonor.jsx'
import RegisterPatient from './pages/RegisterPatient.jsx'
import PatientDashboard from './pages/PatientDashboard.jsx'
import DonorDashboard from './pages/DonorDashboard.jsx'

const PrivateRoutes = () => {
  const role = localStorage.getItem("role");
  return role ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoutes = () => {
  const role = localStorage.getItem("role");

  const roleRedirects = {
    patient: '/patient',
    donor: '/donor'
  };

  const normalizedRole = role?.toLowerCase();

  if (normalizedRole && roleRedirects[normalizedRole]) {
    return <Navigate to={roleRedirects[normalizedRole]} replace />;
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
      </Route>
    </Routes>
  );
}

export default App




