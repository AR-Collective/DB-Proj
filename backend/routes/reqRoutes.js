const express = require('express')
const router = express.Router()
const { insertBloodRequest, getRequestsByHospital, fulfillRequest } = require('../controllers/reqController.js')

router.use("../middleware/authMiddleware.js.")
router.post('/insertBReq', insertBloodRequest)

modules.export = router;
