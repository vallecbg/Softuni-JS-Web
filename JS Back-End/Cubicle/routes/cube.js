const { getCubeWithAccessories } = require('../controllers/cubes')
const express = require('express');
const jwt = require('jsonwebtoken')
const Cube = require('../models/cube')
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env]

const {checkAuthentication, checkAuthenticationJSON, getUserStatus} = require("../controllers/user")

const router = express.Router();


router.get('/edit', checkAuthentication, getUserStatus, (req, res) => {
    res.render('editCubePage', {
        isLoggedIn: req.isLoggedIn
    });
})

router.get('/delete', checkAuthentication, getUserStatus, (req, res) => {
    res.render('deleteCubePage', {
        isLoggedIn: req.isLoggedIn
    });
})

router.get('/create', checkAuthentication, getUserStatus, (req, res) => {
    res.render('create', {
        title: 'Create Cube | Cube Workshop',
        isLoggedIn: req.isLoggedIn
    })
})

router.post('/create', checkAuthenticationJSON, async (req, res) => {
    const {
        name,
        description,
        imageUrl,
        difficultyLevel
    } = req.body

    const token = req.cookies['aid']
    const decodedObject = jwt.verify(token, config.privateKey);
    console.log(decodedObject);

    const cube = new Cube({
        name: name.trim(),
        description: description.trim(),
        imageUrl,
        difficulty: difficultyLevel,
        creatorId: decodedObject.userID
    })

    try{
        await cube.save()

        res.redirect("/")
    }
    catch(e){
        return res.render("create", {
            title: 'Create Cube | Cube Workshop',
            isLoggedIn: req.isLoggedIn,
            error: 'Cube details are not valid!'
        })
    }

   
})

router.get('/details/:id', getUserStatus, async (req, res) => {

    const cube = await getCubeWithAccessories(req.params.id)


    res.render('details', {
        title: 'Details | Cube Workshop',
        ...cube,
        isLoggedIn: req.isLoggedIn
    })
})

module.exports = router