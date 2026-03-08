const { registerUser } = require("../controllers/authController.js")
const express = require('express')
const router = express.Router()


router.get('/register', registerUser)
router.get('/login')



module.exports = router
