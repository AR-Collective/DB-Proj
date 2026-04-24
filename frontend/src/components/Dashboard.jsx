import React, { useState, useEffect } from 'react';
import { inventoryAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInventoryData();
    }, []);

    const fetchInventoryData = async () => {
        try {
            const response = await inventoryAPI.getBloodTypeAvailability();
            setInventoryData(response.data);
        } catch (err) {
            setError('Failed to load inventory data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="dashboard-container"><div className="loading">Loading dashboard...</div></div>;
    }

    return (
        <div className="dashboard-container">
            <h1>Blood Bank Dashboard</h1>

            {error && <div className="error-message">{error}</div>}

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h2>Blood Type Availability</h2>
                    <div className="inventory-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Blood Type</th>
                                    <th>Available Units</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventoryData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.bloodType}</td>
                                        <td>{item.availableUnits}</td>
                                        <td className={item.availableUnits > 10 ? 'status-good' : item.availableUnits > 5 ? 'status-warning' : 'status-critical'}>
                                            {item.availableUnits > 10 ? 'Good' : item.availableUnits > 5 ? 'Low' : 'Critical'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions">
                        <button className="action-button" onClick={() => window.location.href = '/blood-requests'}>
                            Create Blood Request
                        </button>
                        <button className="action-button" onClick={() => window.location.href = '/donors'}>
                            Find Compatible Donors
                        </button>
                        <button className="action-button" onClick={() => window.location.href = '/testing'}>
                            View Test Results
                        </button>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h2>System Statistics</h2>
                    <div className="stats">
                        <div className="stat-item">
                            <span className="stat-label">Total Blood Units:</span>
                            <span className="stat-value">
                                {inventoryData.reduce((sum, item) => sum + item.availableUnits, 0)}
                            </span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Blood Types Available:</span>
                            <span className="stat-value">{inventoryData.length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Low Stock Types:</span>
                            <span className="stat-value">
                                {inventoryData.filter(item => item.availableUnits <= 5).length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;