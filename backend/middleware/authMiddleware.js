import jwt from 'jsonwebtoken'

export const authorizeRoles = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.user || !req.user.role) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized. Please log in first."
			});
		}

		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: `Forbidden. Your role (${req.user.role}) does not have access to this resource.`
			});
		}

		next();
	};
};

export function attachToken(req, res, next) {
	// ? here means if authorization doesnt exists in header then dont try to split
	const token = req.headers['authorization']?.split(' ')[1]

	if (!token) {
		return res.status(401).json({ error: 'No token provided' })
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) return res.status(403).json({ error: 'Invalid token' })
		req.user = decoded
		next()
	})
}

export function verifyToken(req, res, next) {
	const cookie = req.cookies.auth_token;
	if (cookie) {
		jwt.verify(cookie, process.env.JWT_SECRET, (err, decoded) => {
			if (err) return res.status(403).json({ error: 'Invalid token' })
			req.user = decoded
			next()
		})
	}
}
export default attachToken
