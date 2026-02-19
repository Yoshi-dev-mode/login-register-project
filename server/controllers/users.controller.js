const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken')
const jwt = require('jsonwebtoken')
const { client } = require('../lib/rdb')

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

const postUser = async (req, res) => {
    try {
        const { username, email, password, confirm_password } = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const validEmail = await User.findOne({ email })
        if (validEmail) {
            return res.status(400).json({ message: 'Email already existed!' })
        }
        if (password != confirm_password) {
            return res.status(400).json({ message: 'Password must match!' })
        }
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        })
        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        await client.setEx(
            `refreshToken:${refreshToken}`,
            60 * 60 * 24 * 7, // 7 days TTL
            user._id.toString()
        );
        res.status(201).json({
            accessToken,
            refreshToken,
            email,
            password: hashedPassword,
        })
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

const postUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" })
        }

        // 1. Find user
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        // 2. Verify password
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        // 3. Generate tokens
        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        // 4. Store refresh token in Redis
        await client.setEx(
            `refreshToken:${refreshToken}`,
            60 * 60 * 24 * 7, // 7 days
            user._id.toString()
        )
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // 5. Respond
        return res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken
        })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


const refreshToken = async (req, res) => {
    try {
        const refreshTokenValue = req.cookies.refreshToken;
        console.log("🍪 Cookie:", refreshTokenValue);

        if (!refreshTokenValue) {
            return res.status(401).json({ message: "No refresh token" });
        }

        const storedUserId = await client.get(
            `refreshToken:${refreshTokenValue}`
        );

        if (!storedUserId) {
            return res.status(401).json({ message: "Token not recognized" });
        }

        jwt.verify(
            refreshTokenValue,
            process.env.REFRESH_SECRET,
            async (err, decoded) => {
                if (err) return res.status(401).json({ message: "Invalid token" });
                console.log(decoded.id)
                const newAccessToken = generateAccessToken(decoded.id);
                const newRefreshToken = generateRefreshToken(decoded.id);

                // rotate token
                await client.del(`refreshToken:${refreshTokenValue}`);
                await client.setEx(
                    `refreshToken:${newRefreshToken}`,
                    60 * 60 * 24 * 7,
                    decoded.id.toString()
                );

                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    path: "/",
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });

                return res.json({ accessToken: newAccessToken });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken, "DETECTED")

    if (refreshToken) {
      // remove from redis
      await client.del(`refreshToken:${refreshToken}`);
    }

    // clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,     // true in production HTTPS
      sameSite: "lax",
      path: "/"
    });

    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    return res.status(500).json({ message: "Logout failed" });
  }
};




module.exports = {
    getUsers,
    getUser,
    postUser,
    updateUser,
    deleteUser,
    postUserLogin,
    refreshToken,
    logout
}