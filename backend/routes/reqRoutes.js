const express = require('express')
const router = express.Router()
const { insertBloodRequest, getRequestsByHospital, fulfillRequest } = require('../controllers/reqController.js')
const verifyToken = require("../middleware/authMiddleware.js")

router.use(verifyToken)
router.post('/insertBReq', insertBloodRequest)

module.exports = router;
