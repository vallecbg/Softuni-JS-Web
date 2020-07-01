const User = require('../users/User')
const Play = require('../plays/Play')

module.exports = {
    get: {
        home(req, res, next) {
            if(req.user !== undefined){
                User.findById(req.user._id).lean().then((currUser) => {
                    Play.find({}).populate('usersLiked').populate('creator').lean().then((allPlays) => {
                        let plays = []
                        allPlays.forEach(play => {
                            if(play.isPublic || play.creator._id.equals(req.user._id)){
                                play.likesCount = play.usersLiked.length
                                plays.push(play)
                                console.log(play);
                            }
                        })

                        plays.sort(function(a,b) {
                            return b.createdAt - a.createdAt
                        })
                        

                        res.render('home/home.hbs', {
                            isLoggedIn: req.user !== undefined,
                            nameUser: req.user ? req.user.username : "",
                            userId: req.user ? req.user._id : "",
                            playsFound: plays.length > 0 ? true : false,
                            plays,
                        })
                    })
                    
                })
            } else {
                Play.find({}).populate('usersLiked').lean().then((allPlays) => {
                    let plays = []
                        allPlays.forEach(play => {
                            if(play.isPublic){
                                //play.likesCount = play.usersLiked.count
                                plays.push(play)
                                //console.log(play);
                            }
                        })
                        plays.sort(function(a,b) {
                            return b.likesCount - a.likesCount
                        })
                        

                        const sliced = plays.slice(0, 3)
                        console.log(sliced);

                    res.render('home/home.hbs', {
                        isLoggedIn: req.user !== undefined,
                        nameUser: req.user ? req.user.username : "",
                        userId: req.user ? req.user._id : "",
                        playsFound: plays.length > 0 ? true : false,
                        plays: sliced
                    })
                })
            }
        },
        sortByLikes(req, res, next) {
            User.findById(req.user._id).lean().then((currUser) => {
                Play.find({}).populate('usersLiked').populate('creator').lean().then((allPlays) => {
                    let plays = []
                    allPlays.forEach(play => {
                        if(play.isPublic || play.creator._id.equals(req.user._id)){
                            play.likesCount = play.usersLiked.length
                            plays.push(play)
                            console.log(play);
                        }
                    })

                    plays.sort(function(a,b) {
                        return b.likesCount - a.likesCount
                    })
                    

                    res.render('home/home.hbs', {
                        isLoggedIn: req.user !== undefined,
                        nameUser: req.user ? req.user.username : "",
                        userId: req.user ? req.user._id : "",
                        playsFound: plays.length > 0 ? true : false,
                        plays,
                    })
                })
                
            })
        },
        sortByDate(req, res, next){
            User.findById(req.user._id).lean().then((currUser) => {
                Play.find({}).populate('usersLiked').populate('creator').lean().then((allPlays) => {
                    let plays = []
                    allPlays.forEach(play => {
                        if(play.isPublic || play.creator._id.equals(req.user._id)){
                            play.likesCount = play.usersLiked.length
                            plays.push(play)
                            console.log(play);
                        }
                    })

                    plays.sort(function(a,b) {
                        return b.createdAt - a.createdAt
                    })
                    

                    res.render('home/home.hbs', {
                        isLoggedIn: req.user !== undefined,
                        nameUser: req.user ? req.user.username : "",
                        userId: req.user ? req.user._id : "",
                        playsFound: plays.length > 0 ? true : false,
                        plays,
                    })
                })
                
            })
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