const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
const userRegister = require('./routes/registerusers.route')
const userLogin = require('./routes/loginuser.route')
const refreshToken = require('./routes/refreshToken.route')
const logout = require('./routes/logout.route')
const cookieParser = require("cookie-parser")
const app = express()
require('dotenv').config()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/api/register-user', userRegister)
app.use('/api/login-user', userLogin)
app.use('/api/refresh', refreshToken)
app.use('/api/logout', logout)
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MONGOOSE Successfully connected!')
        app.listen(process.env.PORT, () => {
            console.log(`Welcome to localhost ${process.env.PORT}`)
        })
    })
    .catch(() => {
        console.error('Something went wrong!')
    })