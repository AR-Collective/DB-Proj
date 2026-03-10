const jwt = require("jsonwebtoken")

function generateToken(user) {
	return jwt.sign(
		{ id: user.id, email: user.email },
		process.env.JWT_SECRET,
		{ expiresIn: '24h' }
	)
}
module.exports = { generateToken }
