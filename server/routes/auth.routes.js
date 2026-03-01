const express = require('express')
const router = express.Router()
const {postUserLogin, logout, refreshToken, postUser} = require('../controllers/auth.controller')

router.post('/login', postUserLogin)
router.post('/logout', logout)
router.post('/refresh', refreshToken)
router.post('/register', postUser)

module.exports = router