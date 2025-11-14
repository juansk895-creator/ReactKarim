
import jwt from 'jsonwebtoken';
//import dotenv from 'dotenv';  // comentar ?

//dotenv.config(); // comentar ?

const SECRET_KEY = process.env.JWT_SECRET || 'pa55w0rdJWT';
const EXPIRES = process.env.JWT_EXPIRES_IN || '24h';

export function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        rol_id: user.rol_id
    };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES });
}

export function decodeToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
}

