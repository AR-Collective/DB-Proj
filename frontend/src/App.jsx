import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom'
import './App.css'
import Login from './views/Login.jsx'
import Landing from './pages/Landing.jsx'
import About from './pages/About.jsx'


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
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoutes />}>
        <Route path='/dashboard' element={<Dashboard />} />

      </Route>
    </Routes>
  );
}
export default App



