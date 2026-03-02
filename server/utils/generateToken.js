const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

const generateAccessToken = (id) => {
    const token = jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.ACCESSTOKEN_EXPIRATION }
    )
    if(!token) return res.status(400).json({message:'Invalid ID'})

    logger.info('Access Token created successfully')
    return token

}

const generateRefreshToken = (id) => {
    const token = jwt.sign(
        { id },
        process.env.REFRESH_SECRET,
        { expiresIn: process.env.REFRESHTOKEN_EXPIRATION }
    )
    if(!token) return res.status(400).json({message:'Invalid ID'})
    
    logger.info('Refresh Token created successfully')
    return token
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
}
