import express from 'express'
import { searchDonors, getDonations, rateDonor, getAverageDonations, getNeverTested } from '../controllers/donorController.js'
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(verifyToken)
router.use(authorizeRoles('Donor'))
router.post('/search', searchDonors)
router.post('/history', getDonations)
router.post('/rate', rateDonor)
router.get('/statistics/average', getAverageDonations)
router.get('/never-tested', getNeverTested)

export default router
