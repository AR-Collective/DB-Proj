import { useState } from 'react';
import api from '../services/api';
import './RegisterNew.css';

export default function RegisterNew() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [isNewUser, setIsNewUser] = useState(null);
    const [existingRoles, setExistingRoles] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Step 1: Email validation
    const handleEmailNext = async () => {
        if (!email) {
            setError('Email is required');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/step/check-email', { email });
            const { data } = response.data;

            setIsNewUser(data.isNewEmail);
            setAvailableRoles(data.availableRoles || []);
            setExistingRoles(data.existingRoles || []);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to validate email');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Role selection
    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setStep(3);
    };

    // Step 3: Complete registration
    const handleCompleteRegistration = async (formData) => {
        setLoading(true);
        setError('');
        try {
            const payload = {
                email,
                selectedRole,
                ...formData
            };

            const response = await api.post('/auth/step/complete-registration', payload);
            
            // Success - redirect to login or dashboard
            window.location.href = '/login';
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    // Step 3 Form Component - adapts based on new/existing user
    const RegistrationForm = () => {
        const [formData, setFormData] = useState({
            firstName: '',
            lastName: '',
            contact: '',
            gender: '',
            password: '',
            confirmPassword: '',
            bloodGroup: '',
            medicalHistory: ''
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();

            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            handleCompleteRegistration(formData);
        };

        return (
            <form onSubmit={handleSubmit} className="registration-form">
                {!isNewUser && (
                    <div className="account-notice">
                        <p>📌 Your account already exists. Your name and contact info will remain the same for all roles.</p>
                    </div>
                )}

                {isNewUser && (
                    <>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required={isNewUser}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required={isNewUser}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="contact"
                                placeholder="Phone number"
                                value={formData.contact}
                                onChange={handleChange}
                                required={isNewUser}
                            />
                        </div>

                        <div className="form-group">
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required={isNewUser}
                            >
                                <option value="">Select gender</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>

                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="At least 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required={isNewUser}
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required={isNewUser}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Role-specific fields */}
                {selectedRole === 'Donor' && (
                    <div className="form-group">
                        <label>Blood Group</label>
                        <select
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select blood group</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                    </div>
                )}

                {selectedRole === 'Patient' && (
                    <div className="form-group">
                        <label>Medical History (Optional)</label>
                        <textarea
                            name="medicalHistory"
                            placeholder="Any relevant medical conditions"
                            value={formData.medicalHistory}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>
                )}

                <div className="form-buttons">
                    <button type="button" onClick={() => setStep(2)} className="btn-back">Back</button>
                    <button type="submit" disabled={loading} className="btn-submit">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </div>
            </form>
        );
    };

    return (
        <div className="register-container">
            {step === 1 && (
                <div className="register-step">
                    <h2>Create Account - Step 1 of 3</h2>
                    <p>Enter your email to get started</p>

                    <div className="form-group">
                        <div>
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <button 
                            onClick={handleEmailNext}
                            disabled={loading}
                            className="btn-next"
                        >
                            {loading ? 'Checking...' : 'Next'}
                        </button>
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <p>Already have an account? <a href="/login">Login here</a></p>
                </div>
            )}

            {step === 2 && (
                <div className="register-step">
                    <h2>Create Account - Step 2 of 3</h2>
                    <p>Select your role</p>

                    {!isNewUser && (
                        <div className="existing-user-banner">
                            ✓ Account found! Your existing credentials will be used. <br/>
                            <small>Existing roles: {existingRoles.join(', ')}</small>
                        </div>
                    )}

                    <div className="roles-grid">
                        {availableRoles.map((role) => (
                            <div
                                key={role}
                                className="role-card"
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

                    <button 
                        onClick={() => setStep(1)}
                        className="btn-back"
                    >
                        Back
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="register-step">
                    <h2>Create Account - Step 3 of 3</h2>
                    <p>Enter your details to complete registration</p>

                    {error && <div className="error-msg">{error}</div>}
                    <RegistrationForm />
                </div>
            )}
        </div>
    );
}
