import express from 'express';
import { checkAuth, loginController, logoutController, signupController } from '../controllers/auth.controller.js';
import varifyToken from '../middlewares/varifyToken.js';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', logoutController);

router.get("/check", varifyToken, checkAuth);

export default router;