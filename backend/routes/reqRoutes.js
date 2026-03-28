import express from 'express'
import { insertBloodRequest, getBloodUnits, getRequestsByHospital} from '../controllers/BReqController.js'
import verifyToken from "../middleware/authMiddleware.js"

const router = express.Router()
router.use(verifyToken)
router.post('/insertBReq', insertBloodRequest)
router.get('/getBU', getBloodUnits)
router.get('/getReqByHospital', getRequestsByHospital)

export default router
