import React, { useState } from 'react';
import { testingAPI } from '../services/api';
import './Testing.css';

const Testing = () => {
    const [testResults, setTestResults] = useState([]);
    const [neverTestedDonors, setNeverTestedDonors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [donationId, setDonationId] = useState('');

    const handleTestResultsSearch = async () => {
        if (!donationId) {
            setError('Please enter a donation ID');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await testingAPI.getTestResults(donationId);
            setTestResults(response.data);
        } catch (err) {
            setError('Failed to load test results');
        } finally {
            setLoading(false);
        }
    };

    const handleNeverTestedSearch = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await testingAPI.getNeverTestedDonors();
            setNeverTestedDonors(response.data);
        } catch (err) {
            setError('Failed to load never tested donors');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="testing-container">
            <h1>Testing Management</h1>

            {error && <div className="error-message">{error}</div>}

            <div className="testing-section">
                <div className="testing-card">
                    <h2>Get Test Results for Donations</h2>
                    <div className="search-form">
                        <input
                            type="number"
                            placeholder="Enter Donation ID"
                            value={donationId}
                            onChange={(e) => setDonationId(e.target.value)}
                        />
                        <button onClick={handleTestResultsSearch} disabled={loading}>
                            {loading ? 'Searching...' : 'Get Results'}
                        </button>
                    </div>

                    {testResults.length > 0 && (
                        <div className="results-table">
                            <h3>Test Results for Donation #{donationId}</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Test ID</th>
                                        <th>Test Type</th>
                                        <th>Result</th>
                                        <th>Test Date</th>
                                        <th>Technician</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testResults.map((result) => (
                                        <tr key={result.testId}>
                                            <td>{result.testId}</td>
                                            <td>{result.testType}</td>
                                            <td className={result.result === 'Pass' ? 'result-pass' : 'result-fail'}>
                                                {result.result}
                                            </td>
                                            <td>{new Date(result.testDate).toLocaleDateString()}</td>
                                            <td>{result.technicianName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="testing-card">
                    <h2>Find Donors Never Tested</h2>
                    <div className="search-form">
                        <button onClick={handleNeverTestedSearch} disabled={loading}>
                            {loading ? 'Searching...' : 'Find Donors'}
                        </button>
                    </div>

                    {neverTestedDonors.length > 0 && (
                        <div className="results-table">
                            <h3>Donors Who Have Never Been Tested</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Donor ID</th>
                                        <th>Name</th>
                                        <th>Blood Type</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Registration Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {neverTestedDonors.map((donor) => (
                                        <tr key={donor.donorId}>
                                            <td>{donor.donorId}</td>
                                            <td>{donor.firstName} {donor.lastName}</td>
                                            <td>{donor.bloodType}</td>
                                            <td>{donor.phone}</td>
                                            <td>{donor.email}</td>
                                            <td>{new Date(donor.registrationDate).toLocaleDateString()}</td>
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

export default Testing;