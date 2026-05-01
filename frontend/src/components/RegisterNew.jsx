import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import './Auth.css';

const Register = () => {
    const [step, setStep] = useState(1); // Step 1: Email, Step 2: Role, Step 3: Details
    const [email, setEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [availableRoles, setAvailableRoles] = useState(['Donor', 'Patient', 'Staff']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Step 3 form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        contact: '',
        gender: '',
        password: '',
        confirmPassword: ''
    });

    // Step 1: Check email and get available roles
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.post('/auth/step/check-email', { email });
            const { isNewEmail, userId, availableRoles: roles, existingRoles } = response.data.data;

            setUserId(userId);
            setAvailableRoles(roles);

            if (roles.length === 0) {
                setError('All roles already registered for this email');
                setLoading(false);
                return;
            }

            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to validate email');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Select role and proceed
    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setStep(3);
    };

    // Go back to step 2
    const handleBackToRoles = () => {
        setStep(2);
        setSelectedRole('');
    };

    // Step 3: Handle form input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Step 3: Submit complete registration
    const handleCompleteRegistration = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.post('/auth/step/complete-registration', {
                email,
                selectedRole,
                firstName: formData.firstName,
                lastName: formData.lastName,
                contact: formData.contact,
                gender: formData.gender,
                password: formData.password
            });

            const { token, user } = response.data;
            login(user, token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    // Go back to email step
    const handleBackToEmail = () => {
        setStep(1);
        setSelectedRole('');
        setAvailableRoles(['Donor', 'Patient', 'Staff']);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {step === 1 && (
                    <>
                        <h2>Create Account - Step 1 of 3</h2>
                        <p className="step-description">Enter your email to get started</p>
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleEmailSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? 'Checking...' : 'Next'}
                            </button>
                        </form>
                        <p className="auth-link">
                            Already have an account? <Link to="/login">Login here</Link>
                        </p>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2>Create Account - Step 2 of 3</h2>
                        <p className="step-description">Select your role</p>
                        {error && <div className="error-message">{error}</div>}
                        <div className="roles-container">
                            {availableRoles.map((role) => (
                                <div
                                    key={role}
                                    className={`role-card ${selectedRole === role ? 'selected' : ''}`}
                                    onClick={() => handleRoleSelect(role)}
                                >
                                    <div className="role-icon">
                                        {role === 'Donor' && '🩸'}
                                        {role === 'Patient' && '🏥'}
                                        {role === 'Staff' && '👤'}
                                    </div>
                                    <h3>{role}</h3>
                                    <p>
                                        {role === 'Donor' && 'Donate blood to help save lives'}
                                        {role === 'Patient' && 'Request blood transfusions'}
                                        {role === 'Staff' && 'Manage blood bank operations'}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="button-group">
                            <button onClick={handleBackToEmail} className="btn-secondary">
                                Back
                            </button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2>Create Account - Step 3 of 3</h2>
                        <p className="step-description">Enter your details to complete registration</p>
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleCompleteRegistration}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="First name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Last name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="contact">Phone Number</label>
                                <input
                                    type="tel"
                                    id="contact"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    placeholder="Phone number"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="gender">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select gender</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="At least 6 characters"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm password"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="button-group">
                                <button onClick={handleBackToRoles} type="button" className="btn-secondary">
                                    Back
                                </button>
                                <button type="submit" disabled={loading} className="btn-primary">
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Register;
