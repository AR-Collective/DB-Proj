import { registerUserModel, loginUserModel } from '../models/auth.js'
import generateToken from '../utils/jwt.js';
import jwt from 'jsonwebtoken';
import { hashPassword, verifyPassword } from '../utils/hash_password.js';

import { getNextSerial } from "../models/misc.js"


export const registerDonor = async (req, res) => {
	try {

		const userid = await getNextSerial("Donor")

		if (!req.body.email || !req.body.password || !req.body.username) {
			return res.status(400).json({ message: "Missing email or password or username" })
		}
		const data = {
			username: req.body.username,
			userid: userid,
			email: req.body.email,
			password: await hashPassword(req.body.password),
			role: "Donor"
		}
		const token = await registerUser(data)
		res.cookie("auth_token", token, { httpOnly: true, secure: true })
		res.status(201).json({ message: "Logged in" });
	}
	catch (error) {
		console.error("Registration Error:", error);
		res.status(500).json({
			message: "Registration failed due to an internal server error.",
			error: error.message
		});
	}
}

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
