
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'pa55w0rdJWT';

export function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        rol: user.rol
    };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '60' });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
}






