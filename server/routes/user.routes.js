const express = require('express')
const {getUsers, getUser,updateUser, deleteUser} = require('../controllers/user.controller')
const verify = require('../middleware/authToken')
const router = express.Router()

router.get('/', verify, getUsers)
router.get('/:id',verify, getUser)
router.put('/:id',verify, updateUser)
router.delete('/:id', verify, deleteUser)

module.exports = router