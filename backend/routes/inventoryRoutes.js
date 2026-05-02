import express from 'express'
import { getBloodInventory, getExpiringUnits, removeExpiredUnits, getBloodDemand, getAvailabilityReport } from '../controllers/inventoryController.js'
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(verifyToken)
router.use(authorizeRoles('Staff'))
router.get('/by-location', getBloodInventory)
router.get('/expiring', getExpiringUnits)
router.delete('/remove-expired', removeExpiredUnits)
router.get('/demand', getBloodDemand)
router.get('/availability-report', getAvailabilityReport)

export default router
