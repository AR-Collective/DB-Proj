import React, { useState, useEffect } from 'react';
import { bloodRequestAPI } from '../services/api';
import './BloodRequests.css';
import { useAuth } from '../contexts/AuthContext';

const BloodRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        patientid: '',
        hospitalid: '',
        bloodgroupid: '',
        quantity: '',
        patientdisease: '',
    });
    const [hospitalId, setHospitalId] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        if (!hospitalId) return;
        try {
            const response = await bloodRequestAPI.getRequestsByHospital(hospitalId);
            setRequests(response.data.data || []);
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
                patientid: '',
                hospitalid: '',
                bloodgroupid: '',
                quantity: '',
                patientdisease: '',
            });
            fetchRequests();
        } catch (err) {
            setError('Failed to create blood request');
        }
    };

    if (loading) {
        return <div className="blood-requests-container"><div className="loading">Loading blood requests...</div></div>;
    }

    return (
        <div className="blood-requests-container">
            <div className="header">
                <h1>Blood Requests</h1>
                <div className="form-group">
                    <input
                        type="number"
                        placeholder="Enter Hospital ID"
                        value={hospitalId}
                        onChange={(e) => setHospitalId(e.target.value)}
                    />
                    <button onClick={fetchRequests}>Load Requests</button>
                </div>
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
                                <label htmlFor="patientid">Patient ID</label>
                                <input
                                    type="number"
                                    id="patientid"
                                    name="patientid"
                                    value={formData.patientid}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="hospitalid">Hospital ID</label>
                                <input
                                    type="number"
                                    id="hospitalid"
                                    name="hospitalid"
                                    value={formData.hospitalid}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="bloodgroupid">Blood Group ID</label>
                                <input
                                    type="number"
                                    id="bloodgroupid"
                                    name="bloodgroupid"
                                    value={formData.bloodgroupid}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="quantity">Quantity</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="patientdisease">Patient Disease</label>
                            <input
                                type="text"
                                id="patientdisease"
                                name="patientdisease"
                                value={formData.patientdisease}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="submit-button">Create Request</button>
                    </form>
                </div>
            )}

            <div className="requests-table">
                <table style={{ color: 'black' }}>
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Patient ID</th>
                            <th>Hospital ID</th>
                            <th>Blood Group ID</th>
                            <th>Quantity</th>
                            <th>Disease</th>
                            <th>Status</th>
                            <th>Request Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request, index) => (
                            <tr key={index}>
                                <td>{request.requestid}</td>
                                <td>{request.patientid}</td>
                                <td>{request.hospitalid}</td>
                                <td>{request.bloodgroupid}</td>
                                <td>{request.quantity}</td>
                                <td>{request.patientdisease || '-'}</td>
                                <td>{request.fulfillmentstatus}</td>
                                <td>{request.requestdate ? new Date(request.requestdate).toLocaleDateString() : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BloodRequests;
