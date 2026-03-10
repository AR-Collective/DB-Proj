const { registerUserModel, loginUserModel } = require('../models/auth.js')
const jwt_utils = require("../utils/jwt.js")
const jwt = require("jsonwebtoken")
const { hashPassword, verifyPassword } = require('../utils/hash_password.js')

const registerUser = async (req, res) => {
	try {
		const data = req.body
		if (!data.email || !data.password) {
			return res.status(400).json({ message: "Missing data" })
		}
		data.password = await hashPassword(data.password)
		await registerUserModel(data)
		user = {
			id: data.userid,
			email: data.email
		}
		const token = jwt_utils.generateToken(user)
		res.cookie("auth_token", token, { httpOnly: true, secure: true })
		res.status(201).json({ message: "Logged in" });
	}
	//TODO: make it better 
	catch (error) {
		console.error("Registration Error:", error);
		res.status(500).json({
			message: "Registration failed due to an internal server error.",
			error: error.message
		});

	}
}

const loginUser = async (req, res) => {
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
		const token = jwt_utils.generateToken(user)
		res.cookie("auth_token", token, { httpOnly: true, secure: true })
		res.json({
			message: "Auth Successful"
		})
	}
	else {
		res.status(400).json({ message: "Invalid Password" })
	}
}

module.exports = {
	registerUser,
	loginUser
}
