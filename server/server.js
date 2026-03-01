const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
const cookieParser = require("cookie-parser")
const registerRoutes = require('./routes/index')
const app = express()
require('dotenv').config()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // Need for detecting and selecting cookies
}))
// For cookies. Without this, it returns UNDEFINED
app.use(cookieParser())
// For JSON interaction. Without this, it returns UNDEFINED
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// Router Middleware
registerRoutes(app)
// MongoDB Connection
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