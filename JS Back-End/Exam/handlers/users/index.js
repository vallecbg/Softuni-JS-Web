const User = require('./User')
const jwt = require('../../utils/jwt')
const {cookie} = require('../../config/config')
const { validationResult } = require('express-validator')


module.exports = {
    get: {
        login(req, res, next){
            res.render('users/login.hbs')
        },

        register(req, res, next) {
            res.render('users/register.hbs')
        },
        
        logout(req, res, next) {
            req.user = null
            res.clearCookie(cookie).redirect('/home/')
        }
       
    },
    post: {
        login(req, res, next){
            const { username, password } = req.body;
            const errors = validationResult(req)
            console.log(errors);

            if(!errors.isEmpty()){
                return res.render('users/login.hbs', {
                    isLoggedIn: req.user !== undefined,
                    nameUser: req.user ? req.user.username : '',
                    message: errors.array()[0].msg,
                    oldInput: { username, password }
                })
            }
            
            User.findOne({username}).then((user) => {
                if(!user){
                    return res.render('users/login.hbs', {
                        isLoggedIn: req.user !== undefined,
                        nameUser: req.user ? req.user.username : '',
                        message: "User with that username or password not found!",
                        oldInput: { username, password }
                    })
                }
                return Promise.all([user.passwordsMatch(password), user])
            }).then(([match, user]) => {
                if(!match || !user) {
                    return res.render('users/login.hbs', {
                        isLoggedIn: req.user !== undefined,
                        nameUser: req.user ? req.user.username : '',
                        message: "User with that username or password not found!",
                        oldInput: { username, password }
                    })
                }

                const token = jwt.createToken(user)

                res.status(201)
                .cookie(cookie, token, {maxAge: 3600000})
                .redirect('/home/')
            }).catch((e) => {
                
            })
        },
        register(req, res, next){
            const { username, password, rePassword } = req.body;

            if(password !== rePassword){
                return res.render('users/register.hbs', {
                    isLoggedIn: req.user !== undefined,
                    nameUser: req.user ? req.user.username : '',
                    message: "Passwords must match",
                    oldInput: { username, password, rePassword }
                })
            }

            const errors = validationResult(req)
            console.log(errors);

            if(!errors.isEmpty()){
                return res.render('users/register.hbs', {
                    isLoggedIn: req.user !== undefined,
                    nameUser: req.user ? req.user.username : '',
                    message: errors.array()[0].msg,
                    oldInput: { username, password, rePassword }
                })
            }

            User.findOne({username})
                .then((currentUser) => {
                    if(currentUser) {
                        throw new Error('The given username is already used!')
                    }
                    return User.create({username, password})
                }).then((createdUser) => {
                    return res.redirect('/user/login')
                }).catch((err) => {
                    res.render('users/register.hbs', {
                        isLoggedIn: req.user !== undefined,
                        nameUser: req.user ? req.user.username : '',
                        message: err.message,
                        oldInput: { username, password, rePassword }
                    })
                })
        }
    }
}