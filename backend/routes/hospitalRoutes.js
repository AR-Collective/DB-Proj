import express from 'express'
import { getHospitalStock, getStaffProfile } from '../controllers/hospitalController.js'
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(verifyToken)
router.use(authorizeRoles('Staff'))

router.get('/me', getStaffProfile)
router.get('/stock-comparison', getHospitalStock)

export default router
