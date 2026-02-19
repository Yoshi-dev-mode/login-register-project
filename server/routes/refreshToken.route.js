const express = require('express')
const router = express.Router()
const {refreshToken} = require('../controllers/users.controller')

router.post('/', refreshToken)

module.exports = router