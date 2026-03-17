import { registerDonor, loginUser } from "../controllers/authController.js"
import express from 'express';
const router = express.Router();
export default router;


router.post('/donor/register', registerDonor)
router.post('/login', loginUser)
