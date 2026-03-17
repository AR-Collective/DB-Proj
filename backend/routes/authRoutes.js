import { registerDonor, loginUser } from "../controllers/authController.js"
import express from 'express';
const router = express.Router();


router.post('/donor/register', registerDonor)
router.post('/login', loginUser)

export default router;
