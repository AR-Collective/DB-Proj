import express from 'express'
import { searchDonors, getDonations, rateDonor } from '../controllers/donorController.js'
import verifyToken from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(verifyToken)
router.post('/search', searchDonors)
router.post('/history', getDonations)
router.post('/rate', rateDonor)

export default router
