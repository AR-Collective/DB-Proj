const { registerUserModel } = require('../models/auth.js')
const registerUser = (req, res) => {
	// res.write("Hello")
	// res.end()
	registerUserModel(req, res)

}

module.exports = {
	registerUser
}
