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
        },

        info(req, res, next) {
            const {_id} = req.user
            User.findById(_id).populate('expenses').lean().then((currUser) => {
                let totalExpenses = 0;
                let totalExpensesCount = 0;
                for(let i = 0; i < currUser.expenses.length; i++){
                    totalExpenses += currUser.expenses[i].total
                    totalExpensesCount++
                }
                console.log(totalExpenses);
                console.log(totalExpensesCount);
                //console.log(expensesTotal);
                res.render('users/info.hbs', {
                    isLoggedIn: req.user !== undefined,
                    nameUser: req.user ? req.user.username : '',
                    totalExpenses,
                    totalExpensesCount,
                    availableAmount: currUser.amount
                })
            })
            
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
            const { username, password, rePassword, amount } = req.body;
            //TODO: check with no amount
            console.log(amount.substr(1));
            const userAmount = amount.substr(1) !== '' ? parseFloat(amount.substr(1)) : 0;
            console.log(userAmount);

            if(password !== rePassword){
                return res.render('users/register.hbs', {
                    isLoggedIn: req.user !== undefined,
                    nameUser: req.user ? req.user.username : '',
                    message: "Passwords must match",
                    oldInput: { username, password, rePassword, amount }
                })
            }

            if(userAmount < 0){
                return res.render('users/register.hbs', {
                    isLoggedIn: req.user !== undefined,
                    nameUser: req.user ? req.user.username : '',
                    message: "Account amount should be positive number",
                    oldInput: { username, password, rePassword, amount }
                })
            }

            const errors = validationResult(req)
            console.log(errors);

            if(!errors.isEmpty()){
                return res.render('users/register.hbs', {
                    isLoggedIn: req.user !== undefined,
                    nameUser: req.user ? req.user.username : '',
                    message: errors.array()[0].msg,
                    oldInput: { username, password, rePassword, amount }
                })
            }

            User.findOne({username})
                .then((currentUser) => {
                    if(currentUser) {
                        throw new Error('The given username is already used!')
                    }
                    return User.create({username, password, amount: userAmount})
                }).then((createdUser) => {
                    return res.redirect('/user/login')
                }).catch((err) => {
                    res.render('users/register.hbs', {
                        isLoggedIn: req.user !== undefined,
                        nameUser: req.user ? req.user.username : '',
                        message: err.message,
                        oldInput: { username, password, rePassword, amount }
                    })
                })
        },
        increase(req, res, next) {
            const {refillAmount} = req.body;
            const {_id} = req.user
            User.findById(_id).lean().then((currentUser) => {
                currentUser.amount += parseFloat(refillAmount)
                User.findByIdAndUpdate(_id, {amount: currentUser.amount}).then(() => {
                    res.redirect('/home/')
                })
            })
        }
    }
}