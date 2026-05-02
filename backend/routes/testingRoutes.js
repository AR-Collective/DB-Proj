import express from 'express'
import { getTestResults } from '../controllers/testingController.js'
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(verifyToken)
router.use(authorizeRoles('Patient', 'Staff'))
router.get('/results', getTestResults)

export default router
