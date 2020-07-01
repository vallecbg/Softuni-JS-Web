const User = require('../users/User')
const { validationResult } = require('express-validator')
const Play = require('../plays/Play')

module.exports = {
    get: {
        newPlay(req, res, next) {
            res.render('plays/new-play.hbs', {
                isLoggedIn: req.user !== undefined,
                nameUser: req.user ? req.user.username : ''
            })
        },
        details(req, res, next) {
            const {id} = req.params
            Play.findById(id).populate('usersLiked').populate('creator').lean().then((play) => {
                console.log(req.user._id.equals(play.creator._id));
                let isLiked = false
                play.usersLiked.forEach(user => {
                    if(user._id.equals(req.user._id)){
                        isLiked = true
                    }
                })
                res.render('plays/details.hbs', {
                    isLoggedIn: req.user !== undefined,
                    nameUser: req.user ? req.user.username : '',
                    isOwner: req.user._id.equals(play.creator._id),
                    play,
                    isLiked
                })
            })
        },
        likePlay(req, res, next) {
            const {id} = req.params
            const {_id} = req.user

            return Promise.all([
                User.updateOne({_id}, {$push: {likedPlays: id}}),
                Play.updateOne({id}, {$push: {usersLiked: _id}})
            ]).then(([updatedUser, updatedPlay]) => {
                Play.findById(id).lean().then(currPlay => {
                    currPlay.usersLiked.push(_id)
                    currPlay.likesCount++;
                    Play.findByIdAndUpdate(id, {usersLiked: currPlay.usersLiked, likesCount: currPlay.likesCount}).then(x => {
                        console.log(x);
                        res.redirect(`/play/details/${id}`)
                    })
                })
                
                
            }).catch((err) => console.log(err.message))

            // Play.findById(id).populate('usersLiked').lean().then((play) => {
            //     const currentUser = User.findById(_id).populate('likedPlays').lean().then((user) => {
            //         user.likedPlays.push(play)
            //         User.findByIdAndUpdate(_id, {likedPlays: user.likedPlays})
            //         currentUser = user
            //     })
            //     console.log(currentUser);
            // })
        },
        editPlay(req, res, next) {
            const {id} = req.params
            Play.findById(id).lean().then((play) => {
                const isPublic = play.isPublic === true ? 'on' : undefined;
                res.render('plays/edit.hbs', {
                    isLoggedIn: req.user !== undefined,
                    nameUser: req.user ? req.user.username : '',
                    play,
                    isPublic
                })
            })
        },
        deletePlay(req, res, next) {
            const {id} = req.params
            const {_id} = req.user
            Play.findById(id).populate('usersLiked').lean().then((play) => {
                play.usersLiked.map(async function(user) {
                    await User.findByIdAndUpdate({_id: user._id}, {$pull: {likedPlays: id}})
                })
            })

            Play.findById(id).remove().then(() => {
                res.redirect('/')
            })
        }
    },
    post: {
        newPlay(req, res, next) {
            const {title, description, imageUrl, check} = req.body;
            const {_id} = req.user

            const boolReport = check === 'on' ? true : false;
            const isPublic = check === 'on' ? true : false;

            console.log(title, description, imageUrl);
            if(title === '' || description === '' || imageUrl === ''){
                return res.render('plays/new-play.hbs', {
                    isLoggedIn: req.user !== undefined,
                    nameUser: req.user ? req.user.username : '',
                    message: "You can not have empty fields!",
                    oldInput: { title, description, imageUrl, isPublic }
                })
            }

            if(description.length > 50){
                return res.render('plays/new-play.hbs', {
                    isLoggedIn: req.user !== undefined,
                    nameUser: req.user ? req.user.username : '',
                    message: "Description should be maximum 50 characters!",
                    oldInput: { title, description, imageUrl, isPublic }
                })
            }

            // const errors = validationResult(req)
            // console.log(errors);

            // if(!errors.isEmpty()){
            //     return res.render('expenses/new-expense.hbs', {
            //         isLoggedIn: req.user !== undefined,
            //         nameUser: req.user ? req.user.username : '',
            //         message: errors.array()[0].msg,
            //         oldInput: { merchant , total, category, description, report }
            //     })
            // }


            Play.create({title, description, imageUrl, isPublic: boolReport, createdAt: Date.now(), creator: _id, likesCount: 0}).then((createdPlay) => {
                res.redirect('/home/')
            })
        },

        editPlay(req, res, next) {
            const {id} = req.params
            const {title, description, imageUrl, check} = req.body
            const isPublic = check === 'on' ? true : false;
            console.log(title, description, imageUrl, isPublic);

            Play.updateOne({_id: id}, {title, description, imageUrl, isPublic}).then((updatedPlay) => {
                console.log(updatedPlay);
                res.redirect(`/play/details/${id}`)
            })

        }
    }
}