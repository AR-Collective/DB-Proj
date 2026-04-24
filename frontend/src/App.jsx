import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BloodRequests from './components/BloodRequests';
import Donors from './components/Donors';
import Inventory from './components/Inventory';
import Testing from './components/Testing';
import Navbar from './components/Navbar';
import './App.css';

<<<<<<< frontend
// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
=======
const serverUrl = 'http://localhost:3000'

async function sendD(formData) {
  const data = {
    username: formData.get('username'),
    password: formData.get('password')
  }
  try {
    const response = await fetch(serverUrl + '/auth/login',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),
      });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Success:', result);

  } catch (error) {
    console.error('Error sending data:', error);
  }
}


export default function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
>>>>>>> main

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
<<<<<<< frontend
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Dashboard />
                </>
              </ProtectedRoute>
            } />
            <Route path="/blood-requests" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <BloodRequests />
                </>
              </ProtectedRoute>
            } />
            <Route path="/donors" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Donors />
                </>
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Inventory />
                </>
              </ProtectedRoute>
            } />
            <Route path="/testing" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Testing />
                </>
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
=======
    <>
      <form action={sendD}>
        <input name='username' onChange={e => setUsername(e.target.value)} />
        <br />
        <input
          type="password"
          name="password"
          onChange={e => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      <p>{username}</p>
    </>
  )
}

>>>>>>> main
