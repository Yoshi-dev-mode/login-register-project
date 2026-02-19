const express = require('express')
const {getUsers, getUser, postUser, updateUser, deleteUser} = require('../controllers/users.controller')
const verify = require('../middleware/authToken')
const router = express.Router()

router.get('/', verify, getUsers)
router.get('/:id',verify, getUser)
router.post('/', verify,postUser)
router.put('/:id',verify, updateUser)
router.delete('/:id', verify, deleteUser)

module.exports = router