import express from 'express'
import { getCompatibleBlood, searchByDisease } from '../controllers/patientController.js'
import verifyToken from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(verifyToken)
router.post('/compatible-blood', getCompatibleBlood)
router.post('/search-disease', searchByDisease)

export default router
