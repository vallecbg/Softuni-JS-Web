const express = require('express');
const {
    saveUser,
    verifyUser,
    guestAccess,
    getUserStatus
} = require('../controllers/user')


const router = express.Router();

router.get('/login', guestAccess, getUserStatus, (req, res) => {
    res.render('loginPage', {
        isLoggedIn: req.isLoggedIn
    });
})

router.get('/signup', guestAccess, getUserStatus, (req, res) => {

    res.render('registerPage', {
        isLoggedIn: req.isLoggedIn
    });
})

router.post("/signup", async (req, res) => {
    const {
        password,
        repeatPassword
    } = req.body;
    if (!password || 
        password.length < 8 || 
        !password.match(/^[A-Za-z0-9]+$/)) {
        console.log("Password is invalid!");
        //res.redirect('/signup?error=true');
        return res.render('registerPage', {
            isLoggedIn: req.isLoggedIn,
            error: "Username or password is not valid!"
        })
    }

    if(password !== repeatPassword){
        return res.render('registerPage', {
            isLoggedIn: req.isLoggedIn,
            error: "The password and repeat password must be the same!"
        })
    }

    const { error } = await saveUser(req, res);


    if (error) {
        //return res.redirect('/signup?error=true');
        return res.render('registerPage', {
            isLoggedIn: req.isLoggedIn,
            error: "Username or password is not valid!"
        })
    }

    res.redirect('/');

})

router.post("/login", async (req, res) => {
    const {error} = await verifyUser(req, res);

    if (error) {
        //return res.redirect('/login?error=true');
        return res.render('loginPage', {
            isLoggedIn: req.isLoggedIn,
            error: "Username or password is not correct!"
        })
    }

    res.redirect('/');

})

module.exports = router