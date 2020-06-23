const User = require('../users/User')
const { validationResult } = require('express-validator')
const Tripp = require('./Tripp')

module.exports = {
    get: {
        sharedTripps(req, res, next) {

            Tripp.find().lean().then((tripps) => {
                res.render('tripps/shared-tripps.hbs', {
                    isLoggedIn: req.user !== undefined,
                    userEmail: req.user ? req.user.email : '',
                    tripps
                })
            })
            
        },
        offerTripp(req, res, next) {
            res.render('tripps/offer-tripp.hbs', {
                isLoggedIn: req.user !== undefined,
                userEmail: req.user ? req.user.email : ''
            })
        },
        detailsTripp(req, res, next ) {
            const { id } = req.params;

            Tripp.findById(id).lean().then((tripp) => {
                res.render('tripps/details-tripp.hbs', {
                    isLoggedIn: req.user !== undefined,
                    userEmail: req.user ? req.user.email : '',
                    tripp
                })
            })
        }
    },
    post: {
        offerTripp(req, res, next) {
            const {directions, dateTime, carImage, seats, description} = req.body;
            const [startPoint, endPoint] = directions.split(' - ')
            const [date, time] = dateTime.split(' - ')
            const {_id} = req.user

            const errors = validationResult(req)

            if(!errors.isEmpty()){
                return res.render('tripps/offer-tripp.hbs', {
                    isLoggedIn: req.user !== undefined,
                    userEmail: req.user ? req.user.email : '',
                    message: errors.array()[0].msg
                })
            }

            Tripp.create({startPoint, endPoint, date, time, carImage, seats, description, driver: _id}).then((createdTripp) => {
                res.redirect('/tripp/shared-tripps')
            })
        }
    }
}