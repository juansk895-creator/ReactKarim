
const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users.controller');
const auth = require('../utils/auth.middleware');

//Público
router.post('/login', usersCtrl.login);

//Protegido (tokens)
router.use(auth.verifyToken);

//CRUD - Usuarios
router.get('/users', usersCtrl.listUsers);

//GET - id
router.get('/users/:id', usersCtrl.getUser);

//POST - Solo administradores
router.post('/users', auth.requireAdmin, usersCtrl.saveUser);

//PUT - id, administradores y el propio usuario de la cuenta
router.put('/users/:id', auth.requireAdminOrOwner, usersCtrl.updateUserC);

//DELETE - id, solo administradores
router.delete('/users/:id', auth.requireAdmin, usersCtrl.deleteUserC);

export default router;














