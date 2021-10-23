import express from 'express';
import { createAdmin } from '../controllers/UserController';

const router = express.Router();

router.post('/user/createAdmin', createAdmin);

export default router;