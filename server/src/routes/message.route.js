import express from 'express';
import { getMessages, getUsersForSidebar, sendMessage } from '../controllers/message.controller.js';
import verifyToken from '../middlewares/varifyToken.js';

const router = express.Router();

router.get("/users", verifyToken, getUsersForSidebar);
router.get("/:id", verifyToken, getMessages);
router.post("/send/:id", verifyToken, sendMessage);

export default router;