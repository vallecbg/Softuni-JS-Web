const User = require('../models/user')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env]


const generateToken = data => {
    const token = jwt.sign(data, config.privateKey);
    return token;
}

const saveUser = async (req, res) => {

    const {
        username,
        password
    } = req.body;

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
        username,
        password: hashedPassword
    })

    const userObject = await user.save();

    const token = generateToken({
        userID: userObject._id,
        username: userObject.username
    })

    res.cookie('aid', token)

    console.log(token);
    return true;


}

const verifyUser = async (req, res) => {

    const {
        username,
        password
    } = req.body;

    const user = await User.findOne({
        username
    })

    const status = await bcrypt.compare(password, user.password)

    if (status) {
        const token = generateToken({
            userID: user._id,
            username: user.username
        })
        res.cookie('aid', token)
    }


    return status
}

const checkAuthentication = (req, res, next) => {

    const token = req.cookies['aid']
    if (!token) {
        return res.redirect('/')
    }
    try {
        const decodedObject = jwt.verify(token, config.privateKey)
        console.log(decodedObject);
        next()
    } catch (e) {
        return res.redirect('/')
    }

}


const guestAccess = (req, res, next) => {

    const token = req.cookies['aid']
    if (token) {
        return res.redirect('/')
    }
    next()
}

const getUserStatus = (req, res, next) => {
    const token = req.cookies['aid']
    if (!token) {
        req.isLoggedIn = false
    }
    try {
        jwt.verify(token, config.privateKey)
        req.isLoggedIn = true
    } catch (e) {
        req.isLoggedIn = false
    }
    next()
}

const checkAuthenticationJSON = (req, res, next) => {

    const token = req.cookies['aid']
    if (!token) {
        return res.json({
            error: "Not authenticated"
        })
    }
    try {
        jwt.verify(token, config.privateKey)
        next()
    } catch (e) {
        return res.json({
            error: "Not authenticated"
        })
    }

}

module.exports = {
    saveUser,
    verifyUser,
    checkAuthentication,
    guestAccess,
    getUserStatus,
    checkAuthenticationJSON
}