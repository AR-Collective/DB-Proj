import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom'
import './App.css'
import Login from './views/Login.jsx'


const serverUrl = 'http://localhost:3000'

const PrivateRoutes = () => {
  const [status, setStatus] = useState('auth');
  // useEffect(() => {
  //   axios.get(`${serverUrl}/auth/me`)
  //     .then(() => setStatus('auth'))
  //     .catch(() => setStatus('guest'));
  // }, []);
  //
  // if (status === 'loading') return <p>Loading...</p>;
  return status === 'auth' ? <Outlet /> : <Navigate to="/login" />;
};

function Dashboard() {
  return (
    <>
    </>
  )

}

function Register() {
  return (
    <>
    </>
  )

}
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoutes />}>
        <Route path='/' element={<Dashboard />} />

      </Route>
    </Routes>
  );
}
export default App



