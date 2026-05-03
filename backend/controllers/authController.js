import { registerUserModel, getUserRoles, getUserByEmail, registerDonorModel, registerPatientModel } from '../models/auth.js';
import generateToken from '../utils/jwt.js';
import jwt from 'jsonwebtoken';
import { hashPassword, verifyPassword } from '../utils/hash_password.js';


export const registerUser = async (data) => {
    await registerUserModel(data);
};

export const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    if (!role) {
        return res.status(400).json({ message: 'Missing role' });
    }

    if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password.' });
    }

    const record = await getUserByEmail(email);
    if (!record) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const storedHash = record.password || record.Password;
    if (!storedHash) {
        return res.status(500).json({ message: 'Account has no password set.' });
    }

    const isPasswordCorrect = await verifyPassword(storedHash, password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid password.' });
    }

    const userId = record.userid || record.UserID;
    const roles = await getUserRoles(userId);
    if (!roles.includes(role)) {
        return res.status(403).json({ message: `This account does not have the '${role}' role.` });
    }

    const user = {
        userid: userId,
        email: record.email || record.Email,
        firstName: record.firstname || record.FirstName,
        lastName: record.lastname || record.LastName,
        contact: record.contact || record.Contact,
        gender: record.gender || record.Gender,
        role: role,
        roles: roles,
    };

    const token = generateToken(user);
    res.cookie('auth_token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
    return res.json({ message: 'Auth Successful', token, user });
};

const handleRegistration = async (req, res, roleName, validateRoleSpecifics, executeModel) => {
    try {
        const { email, password, firstName, lastName, contact, gender } = req.body;

        // 1. Common Validation
        if (!email || !password || !firstName || !lastName || !contact) {
            return res.status(400).json({ message: 'Missing required registration fields.' });
        }

        // 2. Role-Specific Validation (if provided)
        if (validateRoleSpecifics) {
            const errorMessage = validateRoleSpecifics(req.body);
            if (errorMessage) {
                return res.status(400).json({ message: errorMessage });
            }
        }

        // 3. Prepare Common Data
        const hashedPassword = await hashPassword(password);
        const lastLogin = new Date().toISOString();
        const commonData = {
            firstName,
            lastName,
            email,
            hashedPassword,
            contact,
            gender: gender || null,
            lastLogin,
            role: roleName
        };

        const { userId, existingUser } = await executeModel(commonData, req.body);

        // 5. Post-Registration Tasks
        const roles = await getUserRoles(userId);
        const user = {
            userid: userId,
            email,
            firstName: existingUser?.FirstName || firstName,
            lastName: existingUser?.LastName || lastName,
            contact: existingUser?.Contact || contact,
            gender: existingUser?.Gender || gender,
            role: roleName,
            roles
        };

        const token = generateToken(user);

        res.cookie('auth_token', token, { httpOnly: true, secure: true });
        return res.status(201).json({ message: 'Registered', token, user });

    } catch (error) {
        console.error(`${roleName} Registration Error:`, error);
        if (error.code === 'ROLE_EXISTS') {
            return res.status(409).json({ message: 'A user with this email and role already exists.' });
        }
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }
        return res.status(500).json({
            message: 'Registration failed due to an internal server error.',
            error: error.message
        });
    }
};


export const registerDonor = (req, res) => {
    return handleRegistration(
        req, res, 'Donor',
        (body) => {
            if (!body.age || !body.bloodGroup) return 'Age and blood group required for donor registration.';
            return null;
        },
        async (common, body) => await registerDonorModel(
            common.firstName, common.lastName, common.email, common.hashedPassword,
            common.contact, common.gender, common.lastLogin, body.age, body.bloodGroup
        )
    );
};

export const registerPatient = (req, res) => {
    return handleRegistration(
        req, res, 'Patient',
        (body) => {
            if (!body.age || !body.bloodGroup || !body.disease || !body.hospitalId) {
                return 'Age, blood group, disease, and hospital are required for patient registration.';
            }
            return null;
        },
        async (common, body) => await registerPatientModel(
            common.firstName, common.lastName, common.email, common.hashedPassword,
            common.contact, common.gender, common.lastLogin, body.age, body.bloodGroup,
            body.hospitalId, body.disease
        )
    );
};

export const registerStaff = (req, res) => {
    return handleRegistration(
        req, res, 'Staff',
        null, // No extra validation needed
        null
        // async (common) => await registerStaffModel(
        //     common.firstName, common.lastName, common.email, common.hashedPassword,
        //     common.contact, common.gender, common.lastLogin
        // )
    );
};

export const registerAdmin = (req, res) => {
    return handleRegistration(
        req, res, 'Admin',
        null, // No extra validation needed
        null
        // async (common) => await registerAdminModel(
        //     common.firstName, common.lastName, common.email, common.hashedPassword,
        //     common.contact, common.gender, common.lastLogin
        // )
    );
};
