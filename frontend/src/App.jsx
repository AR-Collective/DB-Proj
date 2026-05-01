import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import RegisterNew from './components/RegisterNew';
import Dashboard from './components/Dashboard';
import BloodRequests from './components/BloodRequests';
import Donors from './components/Donors';
import Inventory from './components/Inventory';
import Testing from './components/Testing';
import Navbar from './components/Navbar';
import './App.css';

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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
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
                <RegisterNew />
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
