import express from 'express'
import { getCompatibleBlood, searchByDisease } from '../controllers/patientController.js'
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(verifyToken)
router.use(authorizeRoles('Patient'))
router.post('/compatible-blood', getCompatibleBlood)
router.post('/search-disease', searchByDisease)

export default router
