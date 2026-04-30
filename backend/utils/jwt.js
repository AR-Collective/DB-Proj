import jwt from 'jsonwebtoken';

export default function generateToken(user) {
    const roles = user.roles || (user.role ? [user.role] : []);
    return jwt.sign(
        {
            userid: user.userid,
            email: user.email,
            role: user.role || roles[0],
            roles
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}
