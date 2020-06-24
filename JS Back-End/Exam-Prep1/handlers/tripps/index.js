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

            Tripp.findById(id).populate('driver').populate('buddies').lean().then((tripp) => {
                //console.log(tripp);
                const isDriver = req.user._id.equals(tripp.driver._id);
                const areSeatsAvailable = tripp.seats > 0;
                const isUserJoined = tripp.buddies.some(x => x._id.equals(req.user._id));
                res.render('tripps/details-tripp.hbs', {
                    isLoggedIn: req.user !== undefined,
                    userEmail: req.user ? req.user.email : '',
                    currentUserId: req.user ? req.user._id : '',
                    isDriver,
                    areSeatsAvailable,
                    isUserJoined,
                    tripp
                })
            })
        },
        deleteTripp(req, res, next) {
            const { id } = req.params;

            Tripp.findById(id).remove().then(() => {
                res.redirect('/tripp/shared-tripps')
            })
        },
        joinTripp(req, res, next) {
            const { id } = req.params;

            Tripp.findById(id).populate('buddies').lean().then((tripp) => {
                tripp.seats--
                tripp.buddies.push(req.user)
                
                Tripp.findByIdAndUpdate(id, {seats: tripp.seats, buddies: tripp.buddies}).then(() => {
                    res.redirect(`/tripp/details-tripp/${id}`)
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