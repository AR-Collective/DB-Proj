import { registerDonor, registerStaff, registerPatient } from "../controllers/authController.js"
import { loginUser } from "../controllers/authController.js"
import express from 'express';
const router = express.Router();


router.post('/register/donor', registerDonor)
router.post('/register/patient', registerPatient)
router.post('/register/staff', registerStaff)
router.post('/login', loginUser)

export default router;
