import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/dashboard">Blood Bank Management</Link>
            </div>
            <div className="navbar-menu">
                <Link to="/dashboard" className="navbar-item">Dashboard</Link>
                <Link to="/blood-requests" className="navbar-item">Blood Requests</Link>
                <Link to="/donors" className="navbar-item">Donors</Link>
                <Link to="/inventory" className="navbar-item">Inventory</Link>
                <Link to="/testing" className="navbar-item">Testing</Link>
            </div>
            <div className="navbar-user">
                <span className="user-info">
                    Welcome, {user?.firstName} {user?.lastName} ({user?.role})
                </span>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;