import jwt from 'jsonwebtoken';

export default function generateToken(user) {
	return jwt.sign(
		{
			userid: user.userid,
			email: user.email,
			role: user.role
		},
		process.env.JWT_SECRET,
		{ expiresIn: '24h' },
	)
}
