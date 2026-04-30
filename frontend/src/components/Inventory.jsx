import React, { useState, useEffect } from 'react';
import { inventoryAPI } from '../services/api';
import './Inventory.css';

const Inventory = () => {
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

    const getStatusClass = (units) => {
        if (units > 10) return 'status-good';
        if (units > 5) return 'status-warning';
        return 'status-critical';
    };

    const getStatusText = (units) => {
        if (units > 10) return 'Good Supply';
        if (units > 5) return 'Low Supply';
        return 'Critical - Need More';
    };

    if (loading) {
        return <div className="inventory-container"><div className="loading">Loading inventory...</div></div>;
    }

    return (
        <div className="inventory-container">
            <h1>Blood Inventory</h1>

            {error && <div className="error-message">{error}</div>}

            <div className="inventory-summary">
                <div className="summary-card">
                    <h3>Total Units Available</h3>
                    <div className="summary-value">
                        {inventoryData.reduce((sum, item) => sum + item.availableUnits, 0)}
                    </div>
                </div>
                <div className="summary-card">
                    <h3>Blood Types in Stock</h3>
                    <div className="summary-value">{inventoryData.length}</div>
                </div>
                <div className="summary-card">
                    <h3>Low Stock Alerts</h3>
                    <div className="summary-value critical">
                        {inventoryData.filter(item => item.availableUnits <= 5).length}
                    </div>
                </div>
            </div>

            <div className="inventory-table">
                <h2>Blood Type Availability Report</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Blood Type</th>
                            <th>Available Units</th>
                            <th>Status</th>
                            <th>Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryData.map((item, index) => (
                            <tr key={index}>
                                <td className="blood-type">{item.bloodType}</td>
                                <td className="units">{item.availableUnits}</td>
                                <td className={`status ${getStatusClass(item.availableUnits)}`}>
                                    {getStatusText(item.availableUnits)}
                                </td>
                                <td>{new Date().toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="inventory-chart">
                <h2>Visual Overview</h2>
                <div className="chart-container">
                    {inventoryData.map((item, index) => (
                        <div key={index} className="chart-bar">
                            <div className="bar-label">{item.bloodType}</div>
                            <div className="bar-container">
                                <div
                                    className={`bar ${getStatusClass(item.availableUnits)}`}
                                    style={{ width: `${Math.min((item.availableUnits / 20) * 100, 100)}%` }}
                                >
                                    <span className="bar-value">{item.availableUnits}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Inventory;