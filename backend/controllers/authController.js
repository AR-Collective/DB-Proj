const { registerUserModel, loginUserModel } = require('../models/auth.js')
const jwt = require("../utils/jwt.js")
const { hashPassword, verifyPassword } = require('../utils/hash_password.js')

//TODO: error handling
const registerUser = (req, res) => {
	const data = req.body
	data.password = hashPassword(data.password)
	registerUserModel(data)
	user = {
		id: data.userid,
		email: data.email
	}
	const token = jwt.generateToken(user)
	res.json({
		message: "Auth Successful",
		token: token
	})
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
