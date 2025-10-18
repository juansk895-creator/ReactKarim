
import jwt from "jsonwebtoken";
//const jwt = require('jsonwebtoken');
const users = require('../models/users.model');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_in_production';

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Token requerido'});

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload; //{id, email, role, iat, exp...}
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido'});
    }
}

async function requireAdmin(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autorizado'});
        }if (req.user.rol != 'admin') {
            return res.status(403).json({ message: 'Se requiere rol administrador'});
        }
        next();
    } catch (err) {
        next(err);
    }
}

async function requireAdminOrOwner(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autorizado'});
        }
        if (req.user.rol === 'admin') {
            return next();
        }
        const targetId = req.params.id;
        if (String(req.user.id) === String(targetId)) {
            return next();
        }
        return res.status(403).json({ message: 'No se cuentan con los permisos necesarios'});
    } catch (err) {
        next(err);
    }
}

export {
    verifyToken,
    requireAdmin,
    requireAdminOrOwner
};




