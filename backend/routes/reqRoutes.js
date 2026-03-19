import express from 'express'
import { insertBloodRequest, getBloodUnits } from '../controllers/BReqController.js'
import verifyToken from "../middleware/authMiddleware.js"

const router = express.Router()
router.use(verifyToken)
router.post('/insertBReq', insertBloodRequest)
router.get('/getBU', getBloodUnits)

export default router
