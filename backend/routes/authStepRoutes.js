import express from 'express';
import { stepCheckEmail, stepCompleteRegistration } from '../controllers/authStepController.js';

const router = express.Router();

// Step 1: Check email and get available roles
router.post('/check-email', stepCheckEmail);

// Step 2: Complete registration with details
router.post('/complete-registration', stepCompleteRegistration);

export default router;
