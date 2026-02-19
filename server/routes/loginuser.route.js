const express = require('express')
const router = express.Router()
const {postUserLogin} = require('../controllers/users.controller')

router.post('/', postUserLogin)

module.exports = router