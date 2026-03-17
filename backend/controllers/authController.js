import { registerUserModel, loginUserModel } from '../models/auth.js'
import generateToken from '../utils/jwt.js';
import jwt from 'jsonwebtoken';
import { hashPassword, verifyPassword } from '../utils/hash_password.js';

import { getNextSerial } from "../models/misc.js"

const baseRegister = async (req, res, role) => {
	try {
		const { email, password, username } = req.body;

		if (!email || !password || !username) {
			return res.status(400).json({ message: "Missing email or password or username" });
		}

		const userid = await getNextSerial(role);
		const hashedPassword = await hashPassword(password);

		const data = {
			username,
			userid,
			email,
			password: hashedPassword,
			role
		};

		const token = await registerUser(data);

		res.cookie("auth_token", token, { httpOnly: true, secure: true });
		return res.status(201).json({ message: "Logged in", userid });
	} catch (error) {
		console.error(`${role} Registration Error:`, error);
		return res.status(500).json({
			message: "Registration failed due to an internal server error.",
			error: error.message
		});
	}
};

export const registerDonor = (req, res) => baseRegister(req, res, "Donor");
export const registerStaff = (req, res) => baseRegister(req, res, "Staff");
export const registerPatient = (req, res) => baseRegister(req, res, "Patient");

export const registerUser = async (data) => {
	await registerUserModel(data)
	const token = generateToken(data)
	return token
}

export const loginUser = async (req, res) => {
	const cookie = req.cookies.auth_token
	if (cookie) {
		if (jwt.verify(cookie, process.env.JWT_SECRET)) {
			res.status(201).json({
				message: "Auth Successful",
			})
		}
		return
	}
	const { userid, password } = req.body
	const record = await loginUserModel(userid) //returns record if exist
	const isPasswordCorrect = await verifyPassword(record.Password, password)
	if (isPasswordCorrect) {
		user = {
			id: userid,
			email: record.email
		}
		const token = generateToken(user)
		res.cookie("auth_token", token, { httpOnly: true, secure: true })
		res.json({
			message: "Auth Successful"
		})
	}
	else {
		res.status(400).json({ message: "Invalid Password" })
	}
}
