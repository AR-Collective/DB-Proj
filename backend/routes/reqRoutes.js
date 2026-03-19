import express from 'express'
const router = express.Router()
import { insertBloodRequest, getRequestsByHospital, fulfillRequest } from '../controllers/BReqController.js'
import verifyToken from "../middleware/authMiddleware.js"

router.use(verifyToken)
router.post('/insertBReq', insertBloodRequest)

export default router
