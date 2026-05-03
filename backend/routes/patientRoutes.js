import express from 'express'
import { getCompatibleBlood, searchByDisease, getBloodGroups, getHospitals, getMyProfile, getMyRequests, createBloodRequest } from '../controllers/patientController.js'
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public routes - for registration
router.get('/blood-groups', getBloodGroups)
router.get('/hospitals', getHospitals)

// Protected patient routes
router.use(verifyToken)
router.use(authorizeRoles('Patient'))
router.get('/me', getMyProfile)
router.get('/my-requests', getMyRequests)
router.post('/request', createBloodRequest)
router.post('/compatible-blood', getCompatibleBlood)
router.post('/search-disease', searchByDisease)

export default router
