const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        require: [true, 'Please enter username']
    },
    email: {
        type: String,
        require: [true, 'Please enter email']
    },
    password: {
        type: String,
        require: [true, 'Please enter password']
    },
    confirm_password: {
        type: String,
        require: [true, 'Please confirm password']
    }
})

module.exports = mongoose.model('User', UserSchema)