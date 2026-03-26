import express from 'express'
import { getBloodInventory } from '../controllers/inventoryController.js'
import verifyToken from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(verifyToken)
router.get('/by-location', getBloodInventory)

export default router
