import express from 'express'
import { searchDonors } from '../controllers/donorController.js'
import verifyToken from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(verifyToken)
router.post('/search', searchDonors)

export default router
