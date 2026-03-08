const { registerUserModel, LoginUserModel } = require('../models/auth.js')
const utils = require("../utils/jwt.js")
const registerUser = (req, res) => {
	registerUserModel(req, res)

}

const loginUser = (req, res) => {
	const { userid, password } = req.body
	LoginUserModel(userid, password) //iske undr verify krna
	//email = getUseremail(userid)
	user = {
		id: userid,
		email: email
	}
	utils.generateToken(user)
	res.json({
		message: "Auth Successful",
		token: token
	})


}

module.exports = {
	registerUser,
	loginUser
}
