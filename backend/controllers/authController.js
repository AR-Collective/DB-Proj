import { registerUserModel, getUserRoles, getUserByEmail } from '../models/auth.js';
import { registerDonorModel } from '../models/donor.js';
import { registerPatientModel } from '../models/patient.js';
import generateToken from '../utils/jwt.js';
import jwt from 'jsonwebtoken';
import { hashPassword, verifyPassword } from '../utils/hash_password.js';

const baseRegister = async (req, res, role) => {
    try {
        const { email, password, firstName, lastName, contact, gender, age, bloodGroup, disease, hospitalId } = req.body;

        if (!email || !password || !firstName || !lastName || !contact) {
            return res.status(400).json({ message: 'Missing required registration fields.' });
        }

        if (role === 'Donor' && (!age || !bloodGroup)) {
            return res.status(400).json({ message: 'Age and blood group required for donor registration.' });
        }

        const hashedPassword = await hashPassword(password);

        const data = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            contact,
            gender,
            role,
            lastLogin: new Date().toISOString(),
            status: 'Active'
        };

        const { userId, existingUser } = await registerUserModel(data);
        
        // Register in Donor table if role is Donor
        if (role === 'Donor') {
            await registerDonorModel(userId, age, bloodGroup);
        }

        if (role === 'Patient') {
            if (!age || !bloodGroup || !disease || !hospitalId) {
                return res.status(400).json({ message: 'Age, blood group, disease, and hospital are required for patient registration.' });
            }
            await registerPatientModel(userId, age, bloodGroup, hospitalId, disease);
        }

        const roles = await getUserRoles(userId);
        const user = {
            userid: userId,
            email,
            firstName: existingUser?.FirstName || firstName,
            lastName: existingUser?.LastName || lastName,
            contact: existingUser?.Contact || contact,
            gender: existingUser?.Gender || gender,
            role: data.role,
            roles
        };

        const token = generateToken(user);

        res.cookie('auth_token', token, { httpOnly: true, secure: true });
        return res.status(201).json({ message: 'Registered', token, user });
    } catch (error) {
        console.error(`${role} Registration Error:`, error);
        if (error.code === 'ROLE_EXISTS') {
            return res.status(409).json({
                message: 'A user with this email and role already exists.'
            });
        }
        return res.status(500).json({
            message: 'Registration failed due to an internal server error.',
            error: error.message
        });
    }
};

export const registerDonor = (req, res) => baseRegister(req, res, 'Donor');
export const registerStaff = (req, res) => baseRegister(req, res, 'Staff');
export const registerPatient = (req, res) => baseRegister(req, res, 'Patient');
export const registerAdmin = (req, res) => baseRegister(req, res, 'Admin');

export const registerUser = async (data) => {
    await registerUserModel(data);
};

export const loginUser = async (req, res) => {
    const cookie = req.cookies.auth_token;
    if (cookie) {
        try {
            if (jwt.verify(cookie, process.env.JWT_SECRET)) {
                const decoded = jwt.decode(cookie, process.env.JWT_SECRET);
                console.log(decoded)
                return res.status(200).json({ message: 'Auth Successful', user: { role: decoded.role } });
            }
        } catch (err) {
            // continue to email/password login if cookie is invalid
        }
    }

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

    const isPasswordCorrect = await verifyPassword(record.Password, password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid Password' });
    }

    const roles = await getUserRoles(record.UserID);
    console.log(roles)
    if (!roles.includes(role)) {
        console.log("NOT FOUND")
        throw err
    }
    const user = {
        userid: record.UserID,
        email: record.Email,
        firstName: record.FirstName,
        lastName: record.LastName,
        contact: record.Contact,
        gender: record.Gender,
        role: role,
        roles: roles,
    };

    const token = generateToken(user);
    res.cookie('auth_token', token, { httpOnly: true, secure: true });
    return res.json({ message: 'Auth Successful', token, user });
};
