import express from 'express'
import { getBloodInventory, getExpiringUnits } from '../controllers/inventoryController.js'
import verifyToken from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(verifyToken)
router.get('/by-location', getBloodInventory)
router.get('/expiring', getExpiringUnits)
router.delete('/remove-expired', removeExpiredUnits)

export default router
