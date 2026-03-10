const { registerUserModel, loginUserModel } = require('../models/auth.js')
const jwt = require("../utils/jwt.js")
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
		const token = jwt.generateToken(user)

		res.status(201).json({
			message: "Auth Successful",
			token: token
		})
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
	const { userid, password } = req.body
	const record = loginUserModel(userid) //returns record if exist
	const isPasswordCorrect = await verifyPassword(record.Password, password)
	if (isPasswordCorrect) {
		user = {
			id: userid,
			email: record.email
		}
		const token = jwt.generateToken(user)
		res.json({
			message: "Auth Successful",
			token: token
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
