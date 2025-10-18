
import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller.js';

const router = Router();
//const router = express.Router();

//Login
router.post('/login', loginUser);

//Sign in
router.post('/register', registerUser);

export default router;




