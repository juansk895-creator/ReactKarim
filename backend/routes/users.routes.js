import express from 'express';
import * as usersCtrl from '../controllers/users.controller.js';
import { verifyToken, requireAdmin, requireAdminOrOwner } from '../utils/auth.middleware.js';

const router = express.Router();

//Público
router.post('/login', usersCtrl.login);

//Protegido (tokens)
//router.use(auth.verifyToken); //descomentar al confirmar el funcionamiento del fetch

//CRUD - Usuarios
// Lista de usuarios
router.get('/', verifyToken, requireAdmin, usersCtrl.listUsers);

//PERFIL
router.get('/me', verifyToken, usersCtrl.getMe);
router.patch('/me', verifyToken, usersCtrl.updateMe);
router.patch('/me/password', verifyToken, usersCtrl.updatePasswordC);
router.patch('/me/status', verifyToken, usersCtrl.updateStatusC);
router.delete('/me', verifyToken, usersCtrl.deleteUserC);

//ESTADÍSTICAS - Revisar cuestión de permisos
router.get('/stats/roles', verifyToken, requireAdmin, usersCtrl.getStatsRolesC);
router.get('/stats/status', verifyToken, requireAdmin, usersCtrl.getStatsStatusC);
router.get('/stats/age', verifyToken, requireAdmin, usersCtrl.getStatsAgeC);

//GET - id
router.get('/:id', verifyToken, usersCtrl.getUser);

//PATCH - Cambiar estado, administradores
router.patch('/:id/status', verifyToken, requireAdmin, usersCtrl.updateStatusC);

//PATCH - Cambiar contraseña, administradores y el propio usuario de la cuenta
router.patch('/:id/password', verifyToken, requireAdminOrOwner, usersCtrl.updatePasswordC);

//POST - Registrar usuario, Solo administradores
router.post('/', verifyToken, requireAdmin, usersCtrl.saveUser);

//PUT - Actualizar usuario, administradores y el propio usuario de la cuenta
router.put('/:id', verifyToken, requireAdminOrOwner, usersCtrl.updateUserC);

//DELETE - Eliminar usuario, solo administradores
router.delete('/:id', verifyToken, requireAdmin, usersCtrl.deleteUserC);

export default router;
