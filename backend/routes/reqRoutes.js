import express from 'express'
import { insertBloodRequest, getBloodUnits, getRequestsByHospital, fulfillRequest } from '../controllers/BReqController.js'
import attachToken from "../middleware/authMiddleware.js"

const router = express.Router()
router.use(attachToken)
router.post('/insertBReq', insertBloodRequest)
router.get('/getBU', getBloodUnits)
router.get('/getReqByHospital', getRequestsByHospital)
router.patch('/fulfillRequest', fulfillRequest)

export default router
