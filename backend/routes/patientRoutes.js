import express from 'express'
import { getCompatibleBlood, searchByDisease, getBloodGroups, getHospitals } from '../controllers/patientController.js'
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public route - for registration
router.get('/blood-groups', getBloodGroups)
router.get('/hospitals', getHospitals)

router.use(verifyToken)
router.use(authorizeRoles('Patient'))
router.post('/compatible-blood', getCompatibleBlood)
router.post('/search-disease', searchByDisease)

export default router
