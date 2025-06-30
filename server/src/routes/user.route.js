import express from 'express';
import { deleteUser, getAllUsers, getUserById, updateUser, whoAmI } from '../controllers/user.controller.js';
import varifyToken from '../middlewares/varifyToken.js';

const router = express.Router();

router.get('/all', varifyToken, getAllUsers);
router.get('/whoami', varifyToken, whoAmI);
router.delete('/delete', varifyToken, deleteUser);
router.get('/:id', varifyToken, getUserById);
router.put('/update', varifyToken, updateUser);

export default router;