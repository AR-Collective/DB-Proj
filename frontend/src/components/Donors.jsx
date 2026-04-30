import React, { useState } from 'react';
import { donorAPI } from '../services/api';
import './Donors.css';

const Donors = () => {
    const [compatibleDonors, setCompatibleDonors] = useState([]);
    const [diseasePatients, setDiseasePatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [patientId, setPatientId] = useState('');
    const [disease, setDisease] = useState('');

    const handleCompatibleSearch = async () => {
        if (!patientId) {
            setError('Please enter a patient ID');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await donorAPI.getCompatibleBlood(patientId);
            setCompatibleDonors(response.data);
        } catch (err) {
            setError('Failed to find compatible donors');
        } finally {
            setLoading(false);
        }
    };

    const handleDiseaseSearch = async () => {
        if (!disease) {
            setError('Please enter a disease');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await donorAPI.getDiseaseWisePatients(disease);
            setDiseasePatients(response.data);
        } catch (err) {
            setError('Failed to find patients with disease');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="donors-container">
            <h1>Donor Management</h1>

            {error && <div className="error-message">{error}</div>}

            <div className="search-section">
                <div className="search-card">
                    <h2>Find Compatible Blood Donors</h2>
                    <div className="search-form">
                        <input
                            type="number"
                            placeholder="Enter Patient ID"
                            value={patientId}
                            onChange={(e) => setPatientId(e.target.value)}
                        />
                        <button onClick={handleCompatibleSearch} disabled={loading}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    {compatibleDonors.length > 0 && (
                        <div className="results-table">
                            <h3>Compatible Donors</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Donor ID</th>
                                        <th>Name</th>
                                        <th>Blood Type</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {compatibleDonors.map((donor) => (
                                        <tr key={donor.donorId}>
                                            <td>{donor.donorId}</td>
                                            <td>{donor.firstName} {donor.lastName}</td>
                                            <td>{donor.bloodType}</td>
                                            <td>{donor.phone}</td>
                                            <td>{donor.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="search-card">
                    <h2>Disease-wise Patient Search</h2>
                    <div className="search-form">
                        <input
                            type="text"
                            placeholder="Enter Disease"
                            value={disease}
                            onChange={(e) => setDisease(e.target.value)}
                        />
                        <button onClick={handleDiseaseSearch} disabled={loading}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    {diseasePatients.length > 0 && (
                        <div className="results-table">
                            <h3>Patients with {disease}</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Patient ID</th>
                                        <th>Name</th>
                                        <th>Blood Type</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {diseasePatients.map((patient) => (
                                        <tr key={patient.patientId}>
                                            <td>{patient.patientId}</td>
                                            <td>{patient.firstName} {patient.lastName}</td>
                                            <td>{patient.bloodType}</td>
                                            <td>{patient.phone}</td>
                                            <td>{patient.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Donors;