const User = require('../models/user')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const privateKey = 'CUBE-WORKSHOP-SOFTUNI'

const saveUser = async (req, res) => {

    const {username, password} = req.body;

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
        username,
        password: hashedPassword
    })

    const userObject= await user.save();
    const token = jwt.sign({
        userID: userObject._id,
        username: userObject.username
    }, privateKey)

    res.cookie('aid', token)

    console.log(token);
    return true;


}

module.exports = {
    saveUser
}