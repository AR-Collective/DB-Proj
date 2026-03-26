import express from 'express'
import { getTestResults } from '../controllers/testingController.js'
import verifyToken from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(verifyToken)
router.get('/results', getTestResults)

export default router
