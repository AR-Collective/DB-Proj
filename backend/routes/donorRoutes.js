import express from 'express'
import { searchDonors, getDonations, rateDonor, getAverageDonations, getNeverTested, getBloodGroups, getMyDonorProfile, getMyDonationHistory } from '../controllers/donorController.js'
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public route - for registration
router.get('/blood-groups', getBloodGroups)

// Protected routes
router.use(verifyToken)
router.use(authorizeRoles('Donor'))
router.get('/me', getMyDonorProfile)
router.get('/my-history', getMyDonationHistory)
router.post('/search', searchDonors)
router.post('/history', getDonations)
router.post('/rate', rateDonor)
router.get('/statistics/average', getAverageDonations)
router.get('/never-tested', getNeverTested)

export default router
