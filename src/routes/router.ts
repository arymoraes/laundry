import express from 'express';
import adminAuthMiddleware from '../middleware/admin';
import { createAdmin, adminLogin, adminProfile } from '../controllers/UserController';

const router = express.Router();

// GET
// Get something
// Does not have body

// POST
// Request to send something

// PUT
// Request to update something

// DELETE
// Request to delete something
// Does not have body

router.post('/user/createAdmin', createAdmin);
router.post('/user/admin/login', adminLogin);
router.get('/user/admin/me', adminAuthMiddleware, adminProfile);

export default router;