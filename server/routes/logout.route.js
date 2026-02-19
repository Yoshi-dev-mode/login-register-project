const express = require('express')
const router = express.Router()
const {logout} = require('../controllers/users.controller')

router.post('/', logout)

module.exports = router