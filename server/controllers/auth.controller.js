const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken')
const jwt = require('jsonwebtoken')
const { client } = require('../lib/rdb')
const logger = require('../utils/logger')

const postUser = async (req, res) => {
    try {
        const { username, email, password, confirm_password } = req.body

        const validEmail = await User.findOne({ email })
        if (validEmail) {
            logger.warn(`Registration attempt with existing email: ${email}`)
            return res.status(400).json({ message: 'Email already existed!' })
        }

        if (password !== confirm_password) {
            logger.warn(`Password mismatch during registration for email: ${email}`)
            return res.status(400).json({ message: 'Password must match!' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        })

        logger.info(`New user registered: ${email} (id: ${user._id})`)

        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        await client.setEx(
            `refreshToken:${refreshToken}`,
            60 * 60 * 24 * 7,
            user._id.toString()
        )

        logger.info(`Refresh token stored in Redis for user: ${user._id}`)

        return res.status(201).json({
            accessToken,
            refreshToken,
            email
        })

    } catch (error) {
        logger.error(`Registration error: ${error.message}`, {
            stack: error.stack
        })
        return res.status(500).json({ message: "Server error" })
    }
}


const postUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            logger.warn(`Login attempt missing email or password`)
            return res.status(400).json({ message: "Email and password required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            logger.warn(`Failed login attempt (user not found): ${email}`)
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            logger.warn(`Failed login attempt (wrong password): ${email}`)
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        await client.setEx(
            `refreshToken:${refreshToken}`,
            60 * 60 * 24 * 7,
            user._id.toString()
        )

        logger.info(`User logged in successfully: ${email} (id: ${user._id})`)

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken
        })

    } catch (error) {
        logger.error(`Login error: ${error.message}`, {
            stack: error.stack
        })
        return res.status(500).json({ message: "Server error" })
    }
}


const refreshToken = async (req, res) => {
    try {
        const refreshTokenValue = req.cookies.refreshToken

        if (!refreshTokenValue) {
            logger.warn("Refresh attempt without token")
            return res.status(401).json({ message: "No refresh token" })
        }

        const storedUserId = await client.get(`refreshToken:${refreshTokenValue}`)

        if (!storedUserId) {
            logger.warn("Refresh attempt with unrecognized token")
            return res.status(401).json({ message: "Token not recognized" })
        }

        jwt.verify(
            refreshTokenValue,
            process.env.REFRESH_SECRET,
            async (err, decoded) => {
                if (err) {
                    logger.warn("Invalid refresh token used")
                    return res.status(401).json({ message: "Invalid token" })
                }

                const newAccessToken = generateAccessToken(decoded.id)
                const newRefreshToken = generateRefreshToken(decoded.id)

                await client.del(`refreshToken:${refreshTokenValue}`)
                await client.setEx(
                    `refreshToken:${newRefreshToken}`,
                    60 * 60 * 24 * 7,
                    decoded.id.toString()
                )

                logger.info(`Refresh token rotated for user: ${decoded.id}`)

                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    path: "/",
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })

                return res.json({ accessToken: newAccessToken })
            }
        )

    } catch (err) {
        logger.error(`Refresh token error: ${err.message}`, {
            stack: err.stack
        })
        return res.status(500).json({ message: "Server error" })
    }
}


const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (refreshToken) {
            await client.del(`refreshToken:${refreshToken}`)
            logger.info("User refresh token removed from Redis during logout")
        } else {
            logger.warn("Logout attempted without refresh token cookie")
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/"
        })

        logger.info("User logged out successfully")

        return res.status(200).json({ message: "Logged out" })

    } catch (err) {
        logger.error(`Logout error: ${err.message}`, {
            stack: err.stack
        })
        return res.status(500).json({ message: "Logout failed" })
    }
}

module.exports = {
    postUser,
    postUserLogin,
    refreshToken,
    logout
}