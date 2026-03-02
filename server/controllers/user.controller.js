const User = require('../models/user.model')
const logger = require('../utils/logger')

const getUsers = async (req, res) => {
    try {
        const user = await User.find({})
        logger.info('Successfully fetch the users')
        res.status(201).json(user)
    } catch (error) {
        logger.error(`Fetching users failed: ${error.message}`)
        res.status(500).json({ message: error.message })
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        logger.info('Successfully fetch a user')
        if (!user) {
            logger.warn('User not found!')
            return res.status(500).json({ messsage: 'User not found!' })
        }
        res.status(201).json(user)
    } catch (error) {
        logger.error(`Fetching user failed: ${error.message}`)
        res.status(500).json({ message: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndUpdate(id, req.body)
        logger.info(`Successfully update a user: ${user}`)
        if (!user) {
            logger.warn('User not found!')
            return res.status(500).json({ messsage: 'User not found!' })
        }
        res.status(201).json(user)
    } catch (error) {
        logger.error(`Updating user failed: ${error.message}`)
        res.status(500).json({ message: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndDelete(id)
        logger.info(`Successfully deleted a user: ${user}`)
        if (!user) return res.status(500).json({ messsage: 'User not found!' })
        res.status(201).json(user)
    } catch (error) {
        logger.error(`Deleting user failed: ${error.message}`)
        res.status(500).json({ message: error.message })
    }
}


module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
}