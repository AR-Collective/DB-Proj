import express from 'express'
import { getBloodInventory, getExpiringUnits, removeExpiredUnits, getBloodDemand } from '../controllers/inventoryController.js'
import verifyToken from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(verifyToken)
router.get('/by-location', getBloodInventory)
router.get('/expiring', getExpiringUnits)
router.delete('/remove-expired', removeExpiredUnits)
router.get('/demand', getBloodDemand)

export default router
