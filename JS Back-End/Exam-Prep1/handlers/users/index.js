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
            const { email, password } = req.body;
            const errors = validationResult(req)
            console.log(errors);

            if(!errors.isEmpty()){
                return res.render('users/login.hbs', {
                    isLoggedIn: req.user !== undefined,
                    userEmail: req.user ? req.user.email : '',
                    message: errors.array()[0].msg
                })
            }
            
            User.findOne({email}).then((user) => {
                if(!user){
                    return res.render('users/login.hbs', {
                        isLoggedIn: req.user !== undefined,
                        userEmail: req.user ? req.user.email : '',
                        message: "User with that email or password not found!"
                    })
                }
                return Promise.all([user.passwordsMatch(password), user])
            }).then(([match, user]) => {
                if(!match || !user) {
                    //next(err) // TODO: add the validator
                    return res.render('users/login.hbs', {
                        isLoggedIn: req.user !== undefined,
                        userEmail: req.user ? req.user.email : '',
                        message: "User with that email or password not found!"
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
            const { email, password, rePassword } = req.body;

            if(password !== rePassword){
                return res.render('users/register.hbs', {
                    isLoggedIn: req.user !== undefined,
                    userEmail: req.user ? req.user.email : '',
                    message: "Passwords must match"
                })
            }

            const errors = validationResult(req)
            console.log(errors);

            if(!errors.isEmpty()){
                return res.render('users/register.hbs', {
                    isLoggedIn: req.user !== undefined,
                    userEmail: req.user ? req.user.email : '',
                    message: errors.array()[0].msg
                })
            }

            User.create({
                email,
                password
            }).then((createdUser) => {
                console.log(createdUser);
                res.redirect('/user/login')
            })

        }
    }
}