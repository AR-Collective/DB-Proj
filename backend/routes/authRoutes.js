import { registerDonor, registerStaff, registerPatient, registerAdmin } from "../controllers/authController.js"
import { loginUser } from "../controllers/authController.js"
import express from 'express';
const router = express.Router();


router.post('/register/donor', registerDonor)
router.post('/register/patient', registerPatient)
router.post('/register/staff', registerStaff)
router.post('/register/admin', registerAdmin)
router.post('/login', loginUser)

export default router;
