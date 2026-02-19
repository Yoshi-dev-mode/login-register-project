const jwt = require('jsonwebtoken')

const generateAccessToken = (id) => {
    const token = jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {expiresIn:process.env.ACCESSTOKEN_EXPIRATION}
    )
    return token
}

const generateRefreshToken = (id) => {
    const token = jwt.sign(
        {id},
        process.env.REFRESH_SECRET,
        {expiresIn:process.env.REFRESHTOKEN_EXPIRATION}
    )
    return token
}


module.exports = {
    generateAccessToken,
    generateRefreshToken
}
