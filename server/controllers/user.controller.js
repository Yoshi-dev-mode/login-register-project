const User = require('../models/user.model')

const getUsers = async (req, res) => {
    try {
        const user = await User.find({})
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) return res.status(500).json({ messsage: 'User not found!' })
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndUpdate(id, req.body)
        if (!user) return res.status(500).json({ messsage: 'User not found!' })
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndDelete(id)
        if (!user) return res.status(500).json({ messsage: 'User not found!' })
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
}