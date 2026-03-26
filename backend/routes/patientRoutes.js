import express from 'express'
import { getCompatibleBlood } from '../controllers/patientController.js'
import verifyToken from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(verifyToken)
router.post('/compatible-blood', getCompatibleBlood)

export default router
