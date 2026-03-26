import express from 'express'
import { getHospitalStock } from '../controllers/hospitalController.js'
import verifyToken from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(verifyToken)
router.get('/stock-comparison', getHospitalStock)

export default router
