import React, { useState, useEffect } from 'react';
import { bloodRequestAPI } from '../services/api';
import './BloodRequests.css';

const BloodRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        patientId: '',
        bloodType: '',
        unitsRequested: '',
        urgencyLevel: 'normal',
        requestDate: new Date().toISOString().split('T')[0],
        requiredDate: '',
    });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await bloodRequestAPI.getRequests();
            setRequests(response.data);
        } catch (err) {
            setError('Failed to load blood requests');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await bloodRequestAPI.createRequest(formData);
            setShowForm(false);
            setFormData({
                patientId: '',
                bloodType: '',
                unitsRequested: '',
                urgencyLevel: 'normal',
                requestDate: new Date().toISOString().split('T')[0],
                requiredDate: '',
            });
            fetchRequests();
        } catch (err) {
            setError('Failed to create blood request');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                await bloodRequestAPI.deleteRequest(id);
                fetchRequests();
            } catch (err) {
                setError('Failed to delete blood request');
            }
        }
    };

    if (loading) {
        return <div className="blood-requests-container"><div className="loading">Loading blood requests...</div></div>;
    }

    return (
        <div className="blood-requests-container">
            <div className="header">
                <h1>Blood Requests</h1>
                <button onClick={() => setShowForm(!showForm)} className="create-button">
                    {showForm ? 'Cancel' : 'Create New Request'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <div className="form-card">
                    <h2>Create Blood Request</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="patientId">Patient ID</label>
                                <input
                                    type="number"
                                    id="patientId"
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bloodType">Blood Type</label>
                                <select
                                    id="bloodType"
                                    name="bloodType"
                                    value={formData.bloodType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Blood Type</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="unitsRequested">Units Requested</label>
                                <input
                                    type="number"
                                    id="unitsRequested"
                                    name="unitsRequested"
                                    value={formData.unitsRequested}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="urgencyLevel">Urgency Level</label>
                                <select
                                    id="urgencyLevel"
                                    name="urgencyLevel"
                                    value={formData.urgencyLevel}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="low">Low</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="requestDate">Request Date</label>
                                <input
                                    type="date"
                                    id="requestDate"
                                    name="requestDate"
                                    value={formData.requestDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="requiredDate">Required Date</label>
                                <input
                                    type="date"
                                    id="requiredDate"
                                    name="requiredDate"
                                    value={formData.requiredDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="submit-button">Create Request</button>
                    </form>
                </div>
            )}

            <div className="requests-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient ID</th>
                            <th>Blood Type</th>
                            <th>Units</th>
                            <th>Urgency</th>
                            <th>Status</th>
                            <th>Request Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.requestId}>
                                <td>{request.requestId}</td>
                                <td>{request.patientId}</td>
                                <td>{request.bloodType}</td>
                                <td>{request.unitsRequested}</td>
                                <td className={`urgency-${request.urgencyLevel}`}>
                                    {request.urgencyLevel}
                                </td>
                                <td className={`status-${request.status}`}>
                                    {request.status}
                                </td>
                                <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(request.requestId)}
                                        className="delete-button"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BloodRequests;