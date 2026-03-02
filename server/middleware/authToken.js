const jwt = require("jsonwebtoken")
const logger = require("../utils/logger")

const verify = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        logger.warn("Access attempt without valid Authorization header", {
            ip: req.ip,
            path: req.originalUrl
        })
        return res.status(401).json({ message: "Unauthorized" })
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded
        next()

    } catch (err) {

        if (err.name === "TokenExpiredError") {
            logger.warn("Expired access token used", {
                ip: req.ip,
                path: req.originalUrl
            })
        } else {
            logger.warn("Invalid access token used", {
                ip: req.ip,
                path: req.originalUrl
            })
        }

        return res.status(401).json({ message: "Unauthorized" })
    }
}

module.exports = verify