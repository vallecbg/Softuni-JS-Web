//const Tripps = require('../tripps')
const User = require('../users/User')

module.exports = {
    get: {
        home(req, res, next) {
            if(req.user !== undefined){
                User.findById(req.user._id).lean().populate('expenses').then((currUser) => {
                    const expenses = [...currUser.expenses];
                    res.render('home/home.hbs', {
                        isLoggedIn: req.user !== undefined,
                        nameUser: req.user ? req.user.username : "",
                        userId: req.user ? req.user._id : "",
                        expenses
                    })
                })
            } else {
                res.render('home/home.hbs', {
                    isLoggedIn: req.user !== undefined,
                    nameUser: req.user ? req.user.username : "",
                })
            }


        },
        notFound(req, res, next) {
            res.render('home/404.hbs', {
                isLoggedIn: req.user !== undefined,
                nameUser: req.user ? req.user.username : ""
            })
        }
    },
    post: {
        
    }
}