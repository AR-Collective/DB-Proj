import { checkEmailAndGetRoles, completeRegistration } from '../models/authStep.js';
import generateToken from '../utils/jwt.js';

// Step 1: Check email and return available roles
const stepCheckEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const roleInfo = await checkEmailAndGetRoles(email);

        res.status(200).json({
            message: 'Email validation successful',
            data: roleInfo
        });
    } catch (error) {
        console.error('Step 1 - Check Email Error:', error);
        res.status(500).json({
            message: 'Failed to validate email',
            error: error.message
        });
    }
};

// Step 2: Complete registration with remaining details
const stepCompleteRegistration = async (req, res) => {
    try {
        const { email, selectedRole, firstName, lastName, contact, gender, password, bloodGroup, medicalHistory } = req.body;
        
        console.log('Step 3 endpoint called with:', { email, selectedRole, firstName, lastName, contact, gender, bloodGroup, medicalHistory });

        // Validate required fields
        if (!email || !selectedRole) {
            return res.status(400).json({ message: 'Email and role are required' });
        }

        // For new users, validate all fields. Existing users might not provide them.
        if (!firstName && !lastName && !contact && !gender && !password) {
            return res.status(400).json({ message: 'Missing registration details' });
        }

        const result = await completeRegistration(email, selectedRole, firstName || '', lastName || '', contact || '', gender || '', password || '', bloodGroup, medicalHistory);
        
        console.log('Registration result:', result);

        if (result && result.success === false) {
            return res.status(409).json({
                message: result.message,
                data: result
            });
        }
        
        if (!result) {
            return res.status(500).json({
                message: 'No result from registration'
            });
        }

        // Generate token for the newly registered/added user
        const user = {
            userid: result.userid,
            email: result.email,
            firstName: firstName || '',
            lastName: lastName || '',
            contact: contact || '',
            gender: gender || '',
            role: selectedRole
        };

        const token = generateToken(user);

        res.cookie('auth_token', token, { httpOnly: true, secure: true });
        res.status(201).json({
            message: result.message,
            token,
            user,
            data: result
        });
    } catch (error) {
        console.error('Step 2 - Complete Registration Error:', error);
        res.status(500).json({
            message: 'Registration failed',
            error: error.message
        });
    }
};

export { stepCheckEmail, stepCompleteRegistration };
