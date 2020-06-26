const Expense = require('./Expense')
const User = require('../users/User')
const { validationResult } = require('express-validator')


module.exports = {
    get: {
        newExpense(req, res, next) {
            res.render('expenses/new-expense.hbs', {
                isLoggedIn: req.user !== undefined,
                nameUser: req.user ? req.user.username : ''
            })
        },
        report(req, res, next) {
            const {id} = req.params
            Expense.findById(id).lean().then((expense) => {
                res.render('expenses/report.hbs',
                {
                    isLoggedIn: req.user !== undefined,
                    nameUser: req.user ? req.user.username : '',
                    expense
                })
            })
        },
        stopTracking(req, res, next) {
            const {id} = req.params
            Expense.findById(id).remove().then(() => {
                res.redirect('/home/')
            })
        }
    },
    post: {
        newExpense(req, res, next) {
            const {merchant , total, category, description, report} = req.body
            const {_id} = req.user
            const boolReport = report === 'on' ? true : false;
            console.log(category);

            if(category === undefined) {
                return res.render('expenses/new-expense.hbs', {
                    isLoggedIn: req.user !== undefined,
                    nameUser: req.user ? req.user.username : '',
                    message: "You must choose category!",
                    oldInput: { merchant , total, category, description, report }
                })
            }

            const errors = validationResult(req)
            console.log(errors);

            if(!errors.isEmpty()){
                return res.render('expenses/new-expense.hbs', {
                    isLoggedIn: req.user !== undefined,
                    nameUser: req.user ? req.user.username : '',
                    message: errors.array()[0].msg,
                    oldInput: { merchant , total, category, description, report }
                })
            }

            Expense.create({merchant , total, category, description, report: boolReport, creator: _id}).then((createdExpense) => {
                User.findById(_id).populate('expenses').lean().then((currUser) => {
                    currUser.expenses.push(createdExpense._id)
                    currUser.amount -= createdExpense.total
                    User.findByIdAndUpdate(_id, {expenses: currUser.expenses, amount: currUser.amount}).then(() => {
                        res.redirect('/home/')
                    })
                })
            })
        }
    }
}