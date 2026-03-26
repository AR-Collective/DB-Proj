import express from 'express'
import { searchDonors, getDonations } from '../controllers/donorController.js'
import verifyToken from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(verifyToken)
router.post('/search', searchDonors)
router.post('/history', getDonations)

export default router
