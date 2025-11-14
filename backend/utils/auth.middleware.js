
import jwt from "jsonwebtoken";
//const jwt = require('jsonwebtoken');

//const users = require('../models/users.model'); // Uso ?

//const JWT_SECRET = process.env.JWT_SECRET || 'changeme_in_production';
const SECRET_KEY = process.env.JWT_SECRET;

export function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization || '';

    console.log("AUTH HEADER RECIBIDO: ", authHeader);

    const token = authHeader.startsWith('Bearer') ? authHeader.slice(6) : null;

    console.log("TOKEN EXTRAÍDO (BACKEND): ", token);
    
    if (!token) {
        console.log("TOKEN VACÍO O NULO");
        return res.status(401).json({ message: 'Token requerido'});
    }

    try {
        const payload = jwt.verify(token, SECRET_KEY);
        
        console.log("TOKEN DECODIFICADO (PAYLOAD): ", payload);

        req.user = payload; //{id, email, role, iat, exp...}
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expirado",
                expired: true,
            });
        }

        console.log("ERROR AL VALIDAR TOKEN: ", err.message);
        return res.status(401).json({
            message: 'Token inválido',
            expired: false,
        });
    }
}

export async function requireAdmin(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autorizado en requireAdmin'});
        }if (req.user.rol_id !== 1 && req.user.rol_id !== "1" && req.user.rol_id !== "admin" ) {
            //return res.status(403).json({ message: 'Se requiere rol administrador'});
            return res.status(403).json({ message: 'Se requiere rol administrador'});
        }
        next();
    } catch (err) {
        console.error("Error en requireAdmin:", err);
        return res.status(500).json({ message: "Error interno en la verificación del rol" });
        //next(err);
    }
}

export async function requireAdminOrOwner(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No autorizado en requireAdminOrOwner'});
        }
        const targetId = req.params.id;
        if (req.user.rol_id === 'admin' || String(req.user.id) === String(req.params.id) ) {
            return next();
        }
        return res.status(403).json({ message: 'No se cuentan con los permisos necesarios'});
    } catch (err) {
        next(err);
    }
}

